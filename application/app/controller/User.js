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
 * @class App.controller.User
 * @author Simon Brunel
 *
 * Handles user information and related views, and uses the Gravatar online
 * service to retrieve available user avatar and information.
 *
 * - **Gravatar API**: http://www.gravatar.com/site/implement/
 */
Ext.define('App.controller.User', {
    extend: 'Ext.app.Controller',
    requires: [
        'App.view.UserPanel',
        'Ext.cf.util.Md5'
    ],

    config: {

        email: '',

        refs: {
            userPanel: 'userpanel'
        },

        control: {

            // 'main' controls
            'button[action=user-info]' : { tap: '_showUserPanel' }

        }
    },

    statics: {

        _gravatarBaseUrl: 'http://www.gravatar.com',

        /**
         * @private
         * Returns the Gravatar compatible hash for the given *email*.
         *
         * - **Note**: this method has Sencha.io dependency (Md5).
         * - **Hash** details: <http://www.gravatar.com/site/implement/hash/>
         */
        _gravatarHash: function(email) {
            email = Ext.String.trim(email).toLowerCase();
            return (!Ext.isEmpty(email)? Ext.cf.util.Md5.hash(email) : null);
        },

        /**
         * @private
         * Returns the Gravatar image url for a given *hash* or the default
         * *"mystery-man"* image is there is no image for the associated user.
         *
         * - **Image** API: <http://www.gravatar.com/site/implement/images/>
         */
        _gravatarImage: function(hash, size) {
            return (!Ext.isEmpty(hash)?
                Ext.String.format(
                    '{0}/avatar/{1}?s={2}&d=mm',
                    this._gravatarBaseUrl,
                    hash,
                    size || 96):
                null);
        },

        /**
         * @private
         * Returns the user profile url for a given *hash*.
         *
         * - **Profiles** API: <http://www.gravatar.com/site/implement/profiles/>
         */
        _gravatarProfileUrl: function(hash) {
            return (!Ext.isEmpty(hash)?
                Ext.String.format(
                    '{0}/{1}.json',
                    this._gravatarBaseUrl,
                    hash) :
                null);
        },

        /**
         * @private
         * Returns the best user pseudo based on the given Gravatar *profile*
         * information. The *defaultValue* is used if there is no available
         * details about the user name.
         */
        _gravatarPseudo: function(profile, defaultValue) {
            if (!Ext.isEmpty(profile.displayName)) {
                return profile.displayName;
            }

            var name = profile.name;
            if (!Ext.isEmpty(name)) {
                if (!Ext.isEmpty(name.formatted)) {
                    return name.formatted;
                }

                if (!Ext.isEmpty(name.givenName)) {
                    var fname = name.givenName,
                        lname = name.familyName;
                    return fname + (!Ext.isEmpty(lname)? ' ' + lname : '');
                }
            }

            if (!Ext.isEmpty(profile.preferredUsername)) {
                return profile.preferredUsername;
            }

            return defaultValue;
        }
    },

    /**
     * @private
     * Gravatar generated cached information, based on the current email.
     */
    _gravatar: {
        hash: null,
        image: null,
        profile: {},
        request: null
    },

    init: function() {
        var sio = this.getApplication().sio;
        if (sio) {
            sio.on({
                authorized: function(user) {
                    this.setEmail(user.getData().email);
                },
                scope: this
            });
        }
    },

    updateEmail: function(email) {
        if (this._gravatar.request) {
            // Profile requests being asynchronous, abort the last JsonP
            // request to keep information matching the last email update.
            Ext.data.JsonP.abort(this._gravatar.request);
        }

        var hash = this.self._gravatarHash(email);
        this._gravatar = {
            hash: hash,
            image: this.self._gravatarImage(hash, 128),
            profile: {},
            request: null
        };

        if (hash) {
            // Retrieving user profile.
            this._gravatar.request = Ext.data.JsonP.request({
                async: true,
                scope: this,
                url: this.self._gravatarProfileUrl(hash),
                callback: function(success, response) {
                    if (success) {
                        this._gravatar.profile = response.entry[0];
                    }

                    this._gravatar.request = null;
                    this._updateViews();
                }
            });
        }
    },

    /**
     * @private
     */
    _updateViews: function() {
        var data = this._gravatar,
            email = this.getEmail(),
            pseudo = this.self._gravatarPseudo(data.profile, email),
            url = data.image || null;

        Ext.each(
            Ext.ComponentQuery.query('image#user-avatar'),
            function(image) {
                image.setSrc(url);
            }
        );

        Ext.each(
            Ext.ComponentQuery.query('label#user-pseudo'),
            function(label) {
                label.setData({pseudo: pseudo});
            }
        );
    },

    /**
     * @private
     */
    _updateUserPanel: function(panel) {
        panel = panel || this.getUserPanel();
        if (!panel) {
            return;
        }

        var data = this._gravatar;
        panel.setAvatar(data.image || null);
        panel.setPseudo(this.self._gravatarPseudo(data.profile));
        panel.setEmail(this.getEmail());
    },

    /**
     * @private
     */
    _showUserPanel: function(button) {
        var panel = this.getUserPanel();

        if (!Ext.isDefined(panel)) {
            panel = Ext.Viewport.add({
                xtype: 'userpanel',
                modal: true,
                centered: true,
                hideOnMaskTap: true,
                showAnimation: 'fade'
            });
        }

        this._updateUserPanel(panel);
        panel.showBy(button);
    }
});
