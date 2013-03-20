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
 * @class App.store.Tasks
 * @author Simon Brunel
 */
Ext.define('App.store.Tasks', {
    extend: 'Ext.data.Store',
    requires: [
        'App.model.Task',
        'Ext.io.User'
    ],

    /**
     * @event sync
     * Fires just after the store have been synced.
     * @param {Ext.data.Store} this
     * @param {Boolean} successful `true` if the operation was successful.
     */

    config: {

        model: 'App.model.Task',

        storeId: 'tasks',

        autoLoad: true,

        autoSync: false,

        proxy: {
            type: 'syncstorage',
            id: 'jdi-tasks',
            owner: 'user',
            access: 'private'
        },

        filters: [
            { property: 'deleted', value: false }
        ],

        grouper: {
            sorterFn: function(item1, item2) {
                var groupFn = this.getGroupFn();
                return App.util.Date.groupSorter(
                    groupFn.call(this, item1),
                    groupFn.call(this, item2));
            },

            groupFn: function(record) {
                return App.util.Date.groupName(record.get('due'));
            }
        },

        sorters: [
            { property: 'due' },
            { property: 'duration' },
            { property: 'create' },
            { property: 'title' }
        ]
    },

    _synchronzing: false,

    _syncRequests: [],

    /**
     * Fixing the 'local updates do need to be synched, but a remote sync is
     * currently in progress' error, by buffering sync() requests. Requests
     * made during a synchronization are buffered and a new synchronization
     * is perform when the current one is terminated. Note that only one
     * synchronization is made for all buffered requests, but each given
     * *callback* are executed.
     */
    sync: function(callback, scope) {

        this._syncRequests.push({ callback: callback, scope: scope });
        if (this._synchronzing) {
            return;
        }

        var requests = [],
            me = this;

        requests = me._syncRequests;
        me._synchronzing = true;
        me._syncRequests = [];

        this.callParent([ function(response) {
            var args = arguments;
            me._synchronzing = false;

            console.log("sio/ tasks sync:", response);

            // Notify all queued sync requests.
            Ext.each(requests, function(request) {
                Ext.callback(request.callback, request.scope || me, args);
            });

            me.fireEvent('sync', me, response.r == 'ok');

            // Process new queued sync requests.
            if (!Ext.isEmpty(me._syncRequests)) {
                me.sync();
            }
        } ]);
    },

    /**
     * Broadcasts store changes to other devices. This method should be
     * called after a store successful synchronization (sync()).
     */
    broadcast: function(callback, scope) {
        Ext.io.User.getCurrent(function(user) {
            if (user) {
                console.log('sio/ notifying update to other devices');
                user.send({ message: 'updated' }, function() {
                    if (callback) {
                        callback.call(scope || this);
                    }
                });
            }
        });
    }
});