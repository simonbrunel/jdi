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
 * @class App.view.TaskCreate
 * @author Simon Brunel
 */
Ext.define('App.view.TaskCreate', {
    extend: 'Ext.Panel',
    xtype: 'taskcreate',
    requires: [
        'App.view.TaskForm'
    ],

    /**
     * @event taskcommit
     * @preventable _doTaskCommit
     * Fires when the user submit the task creation form.
     * @param {formpanel} the submitted form panel.
     */

    config: {

        cls: 'view-taskcreate',

        layout: 'vbox',

        items: [
            {   // header
                cls: 'panel-header',
                layout: { type: 'hbox' },
                items: [
                    {   cls: 'title',
                        html: 'Add Task'
                    },
                    {   xtype: 'spacer'
                    },
                    {   xtype: 'button',
                        action: 'help',
                        help: 'taskcreate',
                        iconCls: 'help',
                        iconMask: true
                    }
                ]
            },
            {
                xtype: 'taskform',
                flex: 1
            },
            {   // action bar
                layout: { type: 'hbox', pack: 'center' },
                defaultType: 'toolbutton',
                cls: 'x-actionbar',
                items: [
                    {
                        xtype: 'button',
                        action: 'task-commit',
                        text: 'Add',
                        iconCls: 'task_add',
                        iconMask: true,
                        ui: 'confirm'
                    },
                    {
                        xtype: 'button',
                        action: 'task-cancel',
                        text: 'Cancel',
                        iconCls: 'cancel',
                        iconMask: true
                    }
                ]
            }

        ],

        control: {
            'button[action=task-commit]': { tap: '_create' },
            'button[action=task-cancel]': { tap: '_close' }
        }
    },

    /**
     * @private
     */
    _close: function() {
        this.fireEvent('close', this);
    },

    /**
     * @private
     */
    _create: function(e) {
        var form = this.child('taskform');
        if (this.fireEvent('taskcommit', form)) {
            // we don't use fireAction, doesn't work on this case, _doTaskCommit
            // is called before controller listeners (why?!)
            this._doTaskCommit();
        }
    },

    /**
     * @private
     */
    _doTaskCommit: function() {
        this.child('taskform').reset();
        this._close();
    }

});
