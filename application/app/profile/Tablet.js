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
 * @class App.profile.Tablet
 * @author Simon Brunel
 */
Ext.define('App.profile.Tablet', {
    extend: 'Ext.app.Profile',
    requires: [
        'App.view.tablet.Main'
    ],

    config: {

        name: 'Tablet',

        controllers: [
            'App.controller.Task'
        ],

        views: [
            'Main'
        ]

    },

    launch: function() {

        Ext.Viewport.addCls('x-profile-tablet');
        Ext.Viewport.add({
            id: 'app-main',
            xclass: 'App.view.tablet.Main',
            fullscreen: true
        });

    },

    isActive: function() {
        return !Ext.os.is.Phone;
    }
});
