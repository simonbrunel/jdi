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

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext.io': 'libraries/sencha-io/src/io',
    'Ext.cf': 'libraries/sencha-io/src/cf',
    'Ext': 'touch/src',
    'App': 'app'
});
//</debug>

/**
 * @author Simon Brunel
 */
Ext.application({

    name: 'App',

    // BUG doesn't work on android browser / chrome mobile (SGSII)
    //viewport: {
    //    autoMaximize: true
    //},

    requires: [
        'App.util.Strings',
        'App.util.Overrides',
        'App.controller.Session',
        'App.controller.Task',
        'App.controller.User',
        'App.controller.Main',
        'Ext.io.Controller',
        'Ext.MessageBox'
    ],

    models:[
        'Task'
    ],

    stores: [
        'Tasks'
    ],

    io: {   // Sencha IO config
        appId: '9d9d3676-6c67-45dd-80fc-4a4b71fa7cb1',
        authOnStartup: true,
        manualLogin: true
    },

    profiles: [
        'Phone',
        'Tablet'
    ],

     controllers: [
        'Main',
        'Ext.io.Controller',        // important: after the main controller
        'User',
        'Session',
        'Wizard'
    ],

    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});
