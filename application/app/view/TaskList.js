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
 * @class App.view.TaskList
 * @author Simon Brunel
 */
Ext.define('App.view.TaskList', {
    extend: 'Ext.dataview.List',
    xtype: 'tasklist',
    requires: [
        'App.view.TaskListItem'
    ],

    config: {

        store: 'tasks',

        cls: 'view-tasklist',

        defaultType: 'tasklistitem',

        emptyText: 'Nothing to do!<br/>[+] to add a task',

        deferEmptyText: true,

        grouped: true,

        pinHeaders: false,

        variableHeights: false,

        refreshHeightOnUpdate: false,

        scrollToTopOnRefresh: false,

        /**
         * @cfg scrollable
         * Direction lock to 'mark as done' tasks on horizontal swipe.
         */
        scrollable: { direction: 'vertical', directionLock: true },

        infinite: true
    }
});
