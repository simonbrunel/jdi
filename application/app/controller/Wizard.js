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
 * @class App.controller.Wizard
 * @author Simon Brunel
 *
 * This controller takes care of all things related to the welcome screen,
 * such as display and interactions, including sample task installation.
 */
Ext.define('App.controller.Wizard', {
    extend: 'Ext.app.Controller',
    requires: [
        'App.store.Tasks',
        'App.util.Date',
        'App.util.Samples',
        'App.util.Strings',
        'App.view.WelcomeScreen'
    ],

    config: {

        refs: {
            welcomeScreen: '#app-welcomescreen'
        },

        control: {

            'button[action=about]': { tap: '_showAbout' },
            'button[action=help]': { tap: '_onHelpRequest' },

            welcomeScreen: {
                'samplesinstall': '_installSamples'
            }
        }
    },

    init: function() {

        this.callParent(arguments);

        this.getApplication().on({
            loadingcomplete: {
                fn: this._onLoadingComplete,
                scope: this,
                single: true
            }
        });

        Ext.getStore('tasks').on({
            sync: {
                fn: this._onStoreSync,
                scope: this,
                single: true
            }
        });

    },

    /**
     * @private
     * Whenever the application is fully loaded.
     */
    _loaded: false,

    /**
     * @private
     * Whenever the store have been synced.
     */
    _synced: false,

    /**
     * @private
     * Checks if the application loading is finished and if the store has been
     * synchronized. If all conditions pass then displaying the welcome screen
     * if needed.
     */
    _checkReady: function() {
        if (!this._loaded || !this._synced) {
            return false;
        }

        var tasks = Ext.getStore('tasks');
        if (tasks.getAllCount() == 0) {
            // Tasks are never destroyed (only mark as deleted and filtered on
            // the 'deleted' field), so we can check if getAllCount() == 0 and
            // if true, this mean that the user never created tasks. As soon
            // as the user will create a task, the welcome screen will never
            // be displayed again.
            this._showWelcomeScreen();
        }

        return true;
    },

    /**
     * @private
     */
    _onLoadingComplete: function() {
        this._loaded = true;
        this._checkReady();
    },

    /**
     * @private
     */
    _onStoreSync: function() {
        this._synced = true;
        this._checkReady();
    },

    /**
     * @private
     */
    _showWelcomeScreen: function(page, section) {
        var panel = this.getWelcomeScreen();
        if (!Ext.isDefined(panel)) {
            panel = Ext.Viewport.add({
                xtype: 'welcomescreen',
                id: 'app-welcomescreen',
                modal: true,
                centered: true,
                width: '90%',
                height: '90%',
                maxWidth: '24em',
                zIndex: 99  // fixed issue with the create panel
            });
        }

        // TODO update the 'samples' button
        panel.show('fadeIn');
        panel.setPage(page || 'welcome');
        if (section) {
            panel.setSection(section);
        }
    },

    /**
     * @private
     */
    _showAbout: function() {
        this._showWelcomeScreen('about');
    },

    /**
     * @private
     */
    _onHelpRequest: function(button) {
        this._showWelcomeScreen('discover', button.config.help || null);
    },

    /**
     * @private
     */
    _installSamples: function() {
        var store = Ext.getStore('tasks'),
            me = this;

        if (store.getCount() == 0) {
            me._doInstallSamples();
            return;
        }

        Ext.Msg.show({
            title: App.util.Strings['message_samples_warning_title'],
            message: App.util.Strings['message_samples_warning_text'],
            buttons: Ext.MessageBox.YESNO,
            fn: function(button) {
                if (button == Ext.MessageBox.YES.itemId) {
                    me._doInstallSamples();
                }
            }
        });
    },

    /**
     * @private
     */
    _doInstallSamples: function() {
        var view = this.getWelcomeScreen(),
            store = Ext.getStore('tasks'),
            now = new Date(),
            tasks = [],
            duration = null,
            done = null,
            due = null;

        view.setMasked({
            xtype: 'loadmask',
            message: 'Installing Samples',
            indicator: true
        });

        Ext.each(App.util.Samples.data, function(sample) {
            if (Math.random() < 0.2) {
                done = App.util.Date.round(new Date());
                done.setDate(done.getDate() - Math.round(Math.random()*31));
            } else {
                done = null;
            }

            due = App.util.Date.round(new Date());
            due.setDate(due.getDate() + sample.duedelta);
            duration = (sample.duration? sample.duration*60 : Math.random()*3600);
            tasks.push(
                Ext.create('App.model.Task', {
                    title: sample.title,
                    duration: duration,
                    due: due,
                    completed: done,
                    created: now,
                    updated: now
                })
            );
        });

        store.add(tasks);
        store.sync(function(response) {
            view.setMasked(null);
            if (response.r == 'ok') {
                Ext.Msg.show({
                    buttons: Ext.MessageBox.OK,
                    title: App.util.Strings['message_samples_installed_title'],
                    message: Ext.String.format(
                        App.util.Strings['message_samples_installed_text'],
                        tasks.length)
                });

                view.setSamplesInstalled(true);
                store.broadcast();
            }
        });
    }
});
