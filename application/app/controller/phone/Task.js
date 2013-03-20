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
 * @class App.controller.phone.Task
 * @author Simon Brunel
 *
 * Phone profile specific task controller: unlike tablet and desktop versions,
 * the task info panel is displayed only when there is selected task.
 */
Ext.define('App.controller.phone.Task', {
    extend: 'App.controller.Task',

    config: {

        control: {

            // Task panel controls
            '#app-tasks taskpanel': {
                panelswipe: '_onTaskPanelSwipe',
                close: '_hideTaskPanel'
            }

        }

    },

    updateCurrentTask: function(record) {
        this.callParent([ record ]);
        if (record) {
            this._showTaskPanel();
        } else {
            this._hideTaskPanel();
        }
    },

    /**
     * @private
     */
    _showTaskPanel: function() {
        var tasklist = this.getTaskList();
        this.getTaskPanel().show({
            type: 'slideIn',
            direction: 'left',
            listeners: {
                animationend: function() {
                    tasklist.addCls('taskpanel-visible');
                }
            }
        });
    },

    /**
     * @private
     */
    _hideTaskPanel: function() {
        var tasklist = this.getTaskList();
        tasklist.removeCls('taskpanel-visible');
        this.getTaskPanel().hide({
            type: 'slideOut',
            direction: 'right',
            listeners: {
                animationend: function() {
                    tasklist.deselectAll();
                }
            }
        });
    },

    /**
     * @private
     */
    _onTaskPanelSwipe: function(event) {
        if (event.deltaX > 0) {
            this._hideTaskPanel();
        }
    }
});