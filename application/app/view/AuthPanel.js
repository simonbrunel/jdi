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
 * @class App.view.AuthPanel
 * @author Simon Brunel
 */
Ext.define('App.view.AuthPanel', {
    extend: 'Ext.Container',
    xtype: 'authpanel',

    config: {

        method: 'login',

        cls: 'view-authpanel',

        layout: 'vbox',

        items: [
            {
                xtype: "formpanel",
                scrollable: null,
                items: [
                    {
                        xtype: 'emailfield',
                        placeHolder: "Email",
                        clearIcon: false,
                        name: 'email'
                    },
                    {
                        xtype: 'passwordfield',
                        placeHolder: 'Password',
                        clearIcon: false,
                        name: 'password'
                    },
                    {
                        xtype: 'button',
                        action: 'user-login',
                        text: 'Login',
                        ui: 'confirm'
                    },
                    {
                        xtype: 'button',
                        action: 'user-register',
                        text: 'Register',
                        ui: 'action'
                    }
                ]
            },
            {   // footer
                layout: { type: 'vbox', align: 'center' },
                cls: 'footer',
                items: [
                    {
                        xtype: 'button',
                        action: 'method-register',
                        text: 'Not yet registered on JDI?',
                        ui: 'action-link'
                    },
                    {
                        xtype: 'button',
                        action: 'method-login',
                        text: 'Already have a JDI account?',
                        ui: 'confirm-link'
                    }
                ]
            }

        ],

        control: {
            'button[action=user-login]': { tap: '_userLogin' },
            'button[action=user-register]': { tap: '_userRegister' },
            'button[action=method-login]': { tap: '_showLogin' },
            'button[action=method-register]': { tap: '_showRegister' }
        }
    },

    updateMethod: function(method) {
        var loginLink = this.down('button[action=method-login]'),
            loginButton = this.down('button[action=user-login]'),
            registerLink = this.down('button[action=method-register]'),
            registerButton = this.down('button[action=user-register]');

        loginLink.setHidden(method == 'login');
        loginButton.setHidden(method != 'login');
        registerLink.setHidden(method != 'login');
        registerButton.setHidden(method == 'login');
    },

    /**
     * @private
     */
    _userLogin: function() {
        var data = this.child('formpanel').getValues();
        this.fireEvent('userlogin', data.email, data.password);
    },

    /**
     * @private
     */
    _userRegister: function() {
        var data = this.child('formpanel').getValues();
        this.fireEvent('userregister', data.email, data.password);
    },

    /**
     * @private
     */
    _showLogin: function() {
        this.setMethod('login');
    },

    /**
     * @private
     */
    _showRegister: function() {
        this.setMethod('register');
    }
});