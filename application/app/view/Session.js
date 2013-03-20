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
 * @class App.view.Session
 * @author Simon Brunel
 */
Ext.define('App.view.Session', {
    extend: 'Ext.Panel',
    requires: [
        'App.widget.AutoBoxLayout',
        'App.widget.Stopwatch'
    ],

    config: {

        /**
         * @cfg {String} orientation
         * The session remaining time
         * @accessor
         */
        time: null,

        /**
         * @cfg {String} state
         * Current session state ('setup' or 'running')
         * @accessor
         */
        state: 'setup',

        statistics: { active: 0, total: 0,  done: 0 },

        /**
         * @cfg {String} orientation
         * Panel inner orientation ('auto', 'horizontal' or 'vertical')
         * @@accessor
         */
        orientation: 'auto',

        cls: 'view-session',

        layout: 'vbox',

        ui: 'light',

        items: [
            {   // header
                cls: 'panel-header',
                layout: { type: 'hbox', align: 'top' },
                items: [
                    {   cls: 'title',
                        html: 'Session'
                    },
                    {   xtype: 'spacer'
                    },
                    {   xtype: 'button',
                        action: 'help',
                        help: 'session',
                        iconCls: 'help',
                        iconMask: true
                    },
                    {   xtype: 'button',
                        action: 'session-close',
                        iconCls: 'cancel',
                        iconMask: true
                    }
                ]
            },
            {   // content
                layout: { type: 'autobox', reverse: true },
                flex: 1,
                items: [
                    {   // stopwatch
                        layout: { type: 'hbox', align: 'center', pack: 'center' },
                        flex: 1,
                        items: [
                            {
                                xtype: 'stopwatch',
                                itemId: 'stopwatch',
                                interactive: true,
                                emptyText: 'Select a duration',
                                time: 0
                            }
                        ]
                    },
                    {
                        layout: { type: 'vbox', align: 'center', pack: 'center' },
                        flex: 1,
                        items: [
                            {   // active statistics
                                xtype: 'label',
                                itemId: 'stats-active',
                                cls: ['statistics', 'tasks-active'],
                                tpl: '{active}/{total}',
                                data: { active: 0, total: 0 }
                            },
                            {   // done statistics
                                xtype: 'label',
                                itemId: 'stats-done',
                                cls: ['statistics', 'tasks-done'],
                                tpl: '{done}',
                                data: { done: 0 }
                            },
                            {   // start button
                                xtype: 'button',
                                text: 'start',
                                action: 'session-start',
                                iconMask: true,
                                iconCls: 'start',
                                iconAlign: 'right',
                                ui: 'action',
                                disabled: true
                            }
                        ]
                    }
                ]
            }
        ],

        control: {
            'button[action=session-close]': { tap: 'hide' },
            'button[action=session-start]': { tap: '_startSession' },
            '#stopwatch': { timechange: '_onStopwatchTimeChange' }
        }
    },

    /**
     * @private
     * Internal component references (optimizations)
     * See _ensureRefs for available references.
     */
    _refs: null,

    updateTime: function(time) {
        var refs = this._ensureRefs();
        refs.stopwatch.setTime(time);
    },

    updateState: function(state) {
        var refs = this._ensureRefs();
        if (state == 'setup') {
            refs.stopwatch.setInteractive(true);
            refs.buttonstart.show();
            refs.statsdone.hide();
        } else { // state == 'running'
            refs.stopwatch.setInteractive(false);
            refs.buttonstart.hide();
            refs.statsdone.show(true);
        }
    },

    applyStatistics: function(statistics) {
        var current = this.getStatistics();
        for (key in current) {
            if (!Ext.isDefined(statistics[key])) {
                statistics[key] = current[key];
            }
        }

        return statistics;
    },

    updateStatistics: function(statistics) {
        var refs = this._ensureRefs(),
            state = this.getState();

        refs.statsdone.setData(statistics);
        refs.statsactive.setData(statistics);
        if (state == 'setup') {
            refs.buttonstart.setDisabled(statistics.active == 0);
        }
    },

    updateOrientation: function(orientation) {
        var layout = this.getAt(1).getLayout(); // 0 == header
        if (orientation == 'auto') {
            layout.setAuto(true);
        } else {
            layout.setOrient(orientation);
            layout.setAuto(false);
        }
    },

    /**
     * @private
     */
    _ensureRefs: function() {
        if (this._refs == null) {
            this._refs = {
                buttonstart: this.down('button[action=session-start]'),
                statsactive: this.down('#stats-active'),
                statsdone: this.down('#stats-done'),
                stopwatch: this.down('#stopwatch')
            };
        }

        return this._refs;
    },

    /**
     * @private
     */
    _startSession: function() {
        var refs = this._ensureRefs();
        this.fireEvent('sessionstart', refs.stopwatch.getTime());
    },

    /**
     * @private
     */
    _onStopwatchTimeChange: function(time) {
        this.fireEvent('timechange', time);
    }
});