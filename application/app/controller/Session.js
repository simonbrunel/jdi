/*
 * This file is part of JDI.
 * Copyright (c) 2013 Simon Brunel.
 * Contact: http://www.github.com/simonbrunel
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * @class App.controller.Session
 * @author Simon Brunel
 *
 * Session execution manager.
 */
Ext.define('App.controller.Session', {
    extend: 'Ext.app.Controller',
    requires: [
        'App.util.Timer'
    ],

    config: {

        refs: {
            sessionView: '#app-section-session',
            taskList: '#app-tasks tasklist'
        },

        control: {

            // 'Create' main action.
            'button[action=session]': {
                tap: '_onSessionButtonTap'
            },

             // 'session' section controls
            '#app-section-session': {
                sessionstart: '_start',
                timechange: '_onSessionTimeChange',
                hide: function(view) { this._onSessionHiddenChange(view, true); },
                show: function(view) { this._onSessionHiddenChange(view, false); }
            }
        }
    },

    statics: {

        _fields: {
            expired: '_session_expired',
            excluded: '_session_excluded',
            postponed: '_session_postponed'
        }

    },

    _store: null,

    _timer: null,           // created during the controller initialization.

    _duration: 0,

    _remaining: 0,

    _isRunning: false,

    _totalTasks: 0,

    _removedDoneTasks: 0,

    _storeFilter: null,    // created during the controller initialization.

    _storeGrouper: null,   // created during the controller initialization.

    _groupOrder: [ 'active',  'postponed',  'out of time', 'done' ],

    _oldStoreGrouper: null,

    init: function() {

        // initializing store grouper / filter here because of there scope.
        this._storeFilter = Ext.bind(this._storeFilterFn, this);
        this._storeGrouper = Ext.create('Ext.util.Grouper', {
            sorterFn: Ext.bind(this._storeSorterFn, this),
            groupFn: Ext.bind(this._storeGroupFn, this)
        });

        this._timer = Ext.create("App.util.Timer", {
            duration: 0,
            tickInterval: 1000,
            listeners: {
                scope: this,
                tick: '_onTick',
                timeout: '_onTimeout' }
        });
    },

    /**
     * @private
     */
    _restart: function() {
        if (this._isRunning) {
            this._stop();
        }

        var view = this.getSessionView();
        view.setTime(0);
        view.setState('setup');
    },

    /**
     * @private
     */
    _suspend: function() {
        if (!this._isRunning) {
            return;
        }

        var view = this.getSessionView();
        this._stop();
        view.setState('setup');
        view.setTime(0);

    },

    /**
     * @private
     * Start a new session of the given *duration*
     */
    _start: function(duration) {
        var view = this.getSessionView(),
            list = this.getTaskList(),
            store = list.getStore();

        view.setState('running');
        view.setTime(duration);

        this._duration = duration;
        this._remaining = duration;
        this._resetRecords(store);
        this._polishStore(store);         // after reset to avoid notificaitons
        this._resetStatistics(store);
        this._timer.start(duration * 1000);
        this._isRunning = true;

        list.onBefore('itemswipe', '_onItemSwipe', this);
    },

    /**
     * @private
     */
    _stop: function() {
        var view = this.getSessionView(),
            list = this.getTaskList(),
            store = list.getStore();

        list.un('itemswipe', '_onItemSwipe', this);

        this._timer.stop();
        this._isRunning = false;
        this._unpolishStore(store);
        this._resetRecords(store);
    },

    /**
     * @private
     */
    _update: function(store) {
        var statistics = this._updateStatistics(store);
        if (this._isRunning) {

            // FIX: we don't know which task the user is currently doing, so
            // the session is really completed when there is no more task to
            // do, including expired ones. A better alternative would to
            // track the 'running' task.
            if (statistics.active == 0 && statistics.expired == 0) {
                var me = this;
                Ext.Msg.show({
                    title: 'Session Completed',
                    message: 'Start a new JDI session?',
                    buttons: Ext.MessageBox.YESNO,
                    fn: function(button) {
                        if (button == Ext.MessageBox.YES.itemId) {
                            me._restart();
                        } else {
                            me._suspend();
                            me.getSessionView().close();
                        }
                    }
                });
            }
        }
    },

    /**
     * @private
     */
    _polishStore: function(store) {

        this._store = store;
        this._oldStoreGrouper = store.getGrouper();
        store.filter(this._storeFilter);
        store.setGrouper(this._storeGrouper);

        // we need to manually sort the store to apply the new grouper.
        //! @TODO report this behaviour as a bug to sencha ?!
        store.sort();

        store.on({
            scope: this,
            updaterecord: this._onRecordUpdated,
            removerecords: this._onRecordRemoved
        });
    },

    /**
     * @private
     */
    _unpolishStore: function(store) {
        if (store != this._store) {
            console.error('store != this._store !');
        }

        store.un({
            scope: this,
            updaterecord: this._onRecordUpdated,
            removerecords: this._onRecordRemoved
        });

        store.setGrouper(this._oldStoreGrouper);
        store.getData().removeFilters(this._storeFilter);

        // because we accessed directly to the internal data of the store,
        // we have to to re-apply filters to have the store up-to-date.
        store.filter();
        store.sort();
    },

    /**
     * @private
     */
    _storeSorterFn: function(item1, item2) {
        var g1 = this._storeGroupFn(item1),
            g2 = this._storeGroupFn(item2),
            i1 = Ext.Array.indexOf(this._groupOrder, g1),
            i2 = Ext.Array.indexOf(this._groupOrder, g2);
        return (i1 > i2 ? 1 : (i1 < i2 ? -1 : 0));
    },

    /**
     * @private
     */
    _storeGroupFn: function(record) {
        if (record.get('completed')) {
            return this._groupOrder[3];
        } else if (record.get(this.self._fields.expired)) {
            return this._groupOrder[2];
        } else if (record.get(this.self._fields.postponed)) {
            return this._groupOrder[1];
        } else {
            return this._groupOrder[0];
        }
    },

    /**
     * @private
     */
    _storeFilterFn: function(record) {
        return (
            !record.get(this.self._fields.excluded) &&
            record.get('duration') < this._duration);
    },

    /**
     * @private
     * Reset records state for a new session (done tasks will be excluded).
     */
    _resetRecords: function(store) {
        var fields = this.self._fields,
            values = {};

        values[fields.expired] = false;
        values[fields.postponed] = false;
        store.each(function(record) {
            values[fields.excluded] = (record.get('completed') != null);
            record.set(values);
        });
    },

    /**
     * @private
     */
    _filterRecords: function(store, duration) {
        var fields = this.self._fields,
            expired = false;

        store.each(function(record) {
            expired = (duration <= 0 || record.get('duration') > duration);
            if (record.get(fields.expired) != expired) {
                record.set(fields.expired, expired);
            }
        });
    },

    /**
     * @private
     */
    _resetStatistics: function(store) {
        this._totalTasks = store.getCount();
        this._removedDoneTasks = 0;
        this._update(store);
    },

    /**
     * @private
     */
    _updateStatistics: function(store) {
        var view = this.getSessionView(),
            remaining = this._remaining,
            duration = 0,
            statistics = {
                done: this._removedDoneTasks,
                total: this._totalTasks,
                expired: 0,
                active: 0
            };

        store.each(function(record) {
            duration = record.get('duration');
            if (record.get('completed')) {
                statistics.done++;
            } else if (!duration || duration <= remaining) {
                statistics.active++;
            } else { // expired
                statistics.expired++;
            }
        });

        view.setStatistics(statistics);
        view.setTime(remaining);
        return statistics;
    },

    /**
     * @private
     */
    _onTick: function(timer, elapsed, remaining, duration) {
        if (!this._store) {
            return;
        }

        this._remaining = remaining/1000; // ms => s convertion
        this._filterRecords(this._store, this._remaining);
        this.getSessionView().setTime(this._remaining);
    },

    /**
     * @private
     */
    _onTimeout: function(timer, duration) {
        if (!this._store) {
            return;
        }

        this._remaining = 0;
        this._filterRecords(this._store, this._remaining);
        this.getSessionView().setTime(this._remaining);

        var me = this;
        Ext.Msg.show({
            title: 'Time is up',
            message: 'Start a new JDI session?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(button) {
                if (button == Ext.MessageBox.YES.itemId) {
                    me._restart();
                } else {
                    me._suspend();
                    me.getSessionView().close();
                }
            }
        });
    },

    /**
     * @private
     */
    _onItemSwipe: function(list, index, target, record, e) {
        if (!this._store) {
            return;
        }

        if (!record.get('completed')) {
            record.set(this.self._fields.postponed, e.direction == 'left');
        }
    },

    /**
     * @private
     */
    _onRecordUpdated: function(store) {
        this._update(store);
    },

    /**
     * @private
     */
    _onRecordRemoved: function(store, records, indices) {
        var completed = 0;
        Ext.each(records, function(record) {
            if (record.get('completed')) {
                completed++;
            }
        });

        this._removedDoneTasks = completed;
        this._update(store);
    },

    /**
     * @private
     * Called when the user tapped a button to show/hide the session view.
     */
    _onSessionButtonTap: function(button) {
        var view = this.getSessionView(),
            visible = (button.getChecked?
                button.getChecked() :
                !view._visible);

        if (visible) {
            view.show();
        } else {
            view.hide();
        }
    },

    /**
     * @private
     * Handles session state when the associated panel is shown or hidden.
     * Also, synchronizing session show/hide button(s).
     */
    _onSessionHiddenChange: function(view, hidden) {
        if (!hidden) {
            this._restart();
        } else {
            this._suspend();
        }

        Ext.each(
            Ext.ComponentQuery.query('button[action=session]'),
            function(button) {
                if (button.setChecked) {
                    button.setChecked(!hidden);
                }
            }
        );
    },

    /**
     * @private
     * Called when the user interacts with the session stopwatch during setup.
     * We will compute candidate tasks and set the session 'startable' state.
     */
    _onSessionTimeChange: function(time) {
        if (this._isRunning) {
            return;
        }

        // computing active / total tasks
        var statistics = { done: 0, total: 0, active: 0 },
            store = Ext.getStore('tasks'),
            view = this.getSessionView(),
            duration = 0;

        store.each(function(record) {
            if (!record.get('completed') && !record.get('deleted')) {
                duration = record.get('duration');
                statistics.total++;
                if (!duration || duration <= time) {
                    statistics.active++;
                }
            }
        });

        view.setStatistics(statistics);
    }
});