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
 * @class App.view.tablet.Main
 * @author Simon Brunel
 */
Ext.define('App.view.tablet.Main', {
    extend: 'Ext.Container',
    requires: [
        'App.widget.AutoBoxLayout',
        'App.widget.ToolButton',
        'App.view.TaskCreate',
        'App.view.Session',
        'App.view.TaskPanel',
        'App.view.TaskList'
    ],

    config: {

        layout: 'vbox',

        items: [
            {   // toolbar
                id: 'app-toolbar',
                xtype: 'apptoolbar'
            },
            {
                id: 'app-tasks',
                layout: 'hbox',
                flex: 1,
                items: [
                    {   // tasklist
                        xtype: 'tasklist',
                        itemId: 'tasklist',
                        flex: 1
                    },
                    {
                        layout: 'vbox',
                        flex: 1,
                        items: [
                            {
                                id: 'app-section-session',
                                xclass: 'App.view.Session',
                                showAnimation: 'fadeIn',
                                hideAnimation: 'fadeOut',
                                orientation: 'horizontal',
                                hidden: true
                            },
                            {   // taskpanel
                                xtype: 'taskpanel',
                                itemId: 'taskpanel',
                                closeable: false,
                                flex: 1
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
