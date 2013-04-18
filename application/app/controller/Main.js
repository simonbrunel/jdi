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
 * @class App.controller.Main
 * @author Simon Brunel
 *
 * Controls application global execution, including Sencha.io initialization,
 * user login, registeration and logout, splashscreen display, etc. Note
 * that the *Main* view is handled in profiles.
 *
 * **Todo:** move login/register/logout methods into the User controller.
 */
Ext.define('App.controller.Main', {
    extend: 'Ext.app.Controller',
    requires: [
        'App.view.SplashScreen'
    ],

    config: {

        stores: ['Tasks'],

        refs: {
            splashScreen: '#app-splashscreen'
        },

        control: {

            // 'main' controls
            'button[action=user-logout]' : { tap: '_logout' },

            // 'loading' controls
            '#app-splashscreen': {
                userloaded: '_onUserLoaded'
            },

            '#app-splashscreen authpanel': {
                userlogin: '_login',
                userregister: '_register'
            }
        }
    },

    _userAuthorized: false,

    _userLoaded: false,

    _loading: false,

    launch: function(app) {

        Ext.fly('app-loading-indicator').destroy();

        Ext.Viewport.add([
            {   // FLOATING
                xtype: 'splashscreen',
                id: 'app-splashscreen',
                centered: true,
                height: '100%',
                width: '100%'
            }
        ]);

        // binding to the sencha IO controller
        var sio = this.getApplication().sio;
        if (sio) {
            sio.on({
                nouser: '_onSIONoUser',
                logout: '_onSIOLogout',
                authorized: '_onSIOAuthorized',
                scope: this
            });
        }

        // start loading.
        this._loading = true;
        this._showMask('Loading');
    },

    /**
     * @private
     * Executed just after the application loading, when resources are
     * ready and fully loaded, then the splash screen will be removed.
     */
    _start: function() {
        var splashscreen = this.getSplashScreen(),
            me = this;

        this._loading = false;
        splashscreen.hide({
            type: 'fadeOut',
            duration: 250,
            listeners: {
                animationend: function() {
                    splashscreen.destroy();
                }
            }
        });

        // Sencha IO synchronization
        this._showMask('Synchronizing');
        Ext.getStore('tasks').sync(function(response) {
            console.log('tasks sync:', response);
            me._hideMask();
        });

        this.getApplication().fireEvent('loadingcomplete');
    },

    /**
     * @private
     */
    _login: function(email, password) {
        var sio = this.getApplication().sio,
            me = this;

        this._showMask('Authentication');
        Ext.io.User.authenticate({
            email: email,
            password: password,
            provider: 'senchaio'
        },
        function(user, errors){
            me._hideMask();
            if (user) {
                // auth() is private, but can't find public API.
                sio.auth();
            } else {
                me._showError('Login Error', errors.message);
            }
        });
    },

    /**
     * @private
     */
    _register: function(email, password) {
        var sio = this.getApplication().sio,
            me = this;

        this._showMask('Registration');
        Ext.io.User.register({
            email: email,
            password: password,
            provider: 'senchaio'
        },
        function(user, errors){
            me._hideMask();
            if (user) {
                // auth() is private, but can't find public API.
                sio.auth();
            } else {
                me._showError('Register Error', errors.message);
            }
        });
    },

    /**
     * @private
     */
    _logout: function() {

        this._showMask('Logout');

        // Calling sio.logout does not clear copies of sync store.
        // http://docs.sencha.io/current/index.html#!/api/Ext.io.User-method-logout
        Ext.getStore('tasks').getProxy().clear();

        this.getApplication().sio.logout();
    },

    /**
     * @private
     */
    _showError: function(title, message) {
        Ext.Msg.show({
            cls: 'x-warning',
            title: title,
            message: message,
            buttons: Ext.MessageBox.OK
        });
    },

    /**
     * @private
     */
    _setState: function(state) {
        this.getSplashScreen().setState(state);
    },

    /**
     * @private
     */
    _showMask: function(message) {
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: message,
            indicator: true
        });
    },

    /**
     * @private
     */
    _hideMask: function() {
        Ext.Viewport.setMasked(null);
    },

    /**
     * @private
     */
    _checkLoadingCompleted: function() {
        if (!this._loading) {
            return true;
        }

        if (this._userLoaded) {
            Ext.defer(this._start, 1000, this);
            return true;
        }

        return false;
    },

    /**
     * @private
     */
    _onSIONoUser: function() {
        if (this._loading) {
            this._hideMask();
            this._setState('login');
        }
    },

    /**
     * @private
     * - **Note**: This event is supposed to arrive AFTER logout is complete,
     * but if we immediatly reload the page, next startup will find back the
     * current user (should be reported as a bug to Sencha.io)
     */
    _onSIOLogout: function() {
        this._waitUntilLogout(function(succeeded) {
            this._hideMask();
            if (succeeded) {
                window.location.reload();
            }
        });
    },

    /**
     * @private
     */
    _waitUntilLogout: function(callback, retry) {
        var me = this;
        retry = (retry !== undefined ? retry : 8);
        Ext.io.User.getCurrent(function(user){
            if (!user) {
                Ext.callback(callback, me, [ true ]);
                return;
            }

            if (retry < 1) {
                Ext.callback(callback, me, [ false ]);
                return;
            }

            Ext.defer(me._waitUntilLogout, 1000, me, [ callback, retry-1 ]);
        });
    },

    /**
     * @private
     */
    _onSIOAuthorized: function() {
        this._userAuthorized = true;
        if (this._loading) {
            this._setState('logged');
            this._showMask('Loading');
            this._checkLoadingCompleted();
        }
        return true;
    },

    /**
     * @private
     */
    _onUserLoaded: function() {
        this._hideMask();
        this._setState('loaded');
        this._userLoaded = true;
        this._checkLoadingCompleted();
    }

});