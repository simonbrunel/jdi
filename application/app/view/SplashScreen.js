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
 * @class App.view.SplashScreen
 * @author Simon Brunel
 *
 * Displayed during the application loading.
 */
Ext.define('App.view.SplashScreen', {
    extend: 'Ext.Container',
    xtype: 'splashscreen',
    requires: [
        'App.view.AuthPanel'
    ],

    config: {

        /**
         * @cfg {String} state
         * Current state of this screen: 'login', 'logged'
         * @accessor
         */
        state: '',

        cls: 'view-splashscreen',

        layout: { type: 'vbox', pack: 'center', align: 'center' },

        items: [
            {   // application logo
                cls: 'logo'
            },
            {   // application details
                itemId: 'user-info',
                layout: { type: 'vbox', pack: 'center', align: 'center' },
                cls: 'user-info',
                hidden: true,
                items: [

                    {   // user avatar
                        xtype: 'image',
                        itemId: 'user-avatar',
                        cls: 'user-avatar'
                    },
                    {   // user pseudo
                        xtype: 'label',
                        itemId: 'user-pseudo',
                        cls: 'user-pseudo',
                        tpl: '{pseudo}'
                    }
                ]
            },
            {   // authentication panel
                xtype: 'authpanel',
                hidden: true
            }
        ],

        control: {
            '#user-avatar': {
                error: '_onUserLoaded',
                load: '_onUserLoaded'
            }
        }
    },

    updateState: function(current, previous) {
        var login = this.child('authpanel'),
            info = this.child('#user-info'),
            me = this;

        if (current == 'login') {
            login.show();
            info.hide();
        } else if (current == 'logged') {
            login.hide();
            info.show();
        }

        Ext.defer(function() {
            me.replaceCls(previous, current, 'state-');
        }, 50);
    },

    /**
     * @private
     * This event (HACK?!) is used to allow the Main controller to wait until
     * the user image is fully loaded before closing this splashscreen.
     */
    _onUserLoaded: function() {
        this.fireEvent('userloaded');
    }
});