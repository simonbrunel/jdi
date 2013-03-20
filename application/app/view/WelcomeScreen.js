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
 * @class App.view.WelcomeScreen
 * @author Simon Brunel
 */
Ext.define('App.view.WelcomeScreen', {
    extend: 'Ext.Panel',
    xtype: 'welcomescreen',
    requires: [
        'App.util.Strings',
        'App.view.Discover'
    ],

    config: {

        /**
         * @cfg {Boolean} samplesEnabled
         * Whenever samples have been installed or not.
         * @accessor
         */
        samplesInstalled: false,

        cls: 'view-welcomescreen',

        layout: 'vbox',

        items: [
            {   // header
                cls: 'panel-header',
                layout: { type: 'hbox' },
                items: [
                    {
                        cls: 'title',
                        html: 'Getting Started'
                    },
                    {   xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        action: 'close',
                        iconCls: 'cancel',
                        iconMask: true
                    }
                ]
            },
            {
                xtype: 'tabpanel',
                flex: 1,
                items: [
                    {
                        itemId: 'page-welcome',
                        title: 'Welcome',
                        styleHtmlContent: true,
                        scrollable: { direction: 'vertical', directionLock: true },
                        layout: { type: 'vbox', align: 'center', pack: 'top' },
                        items: [
                            {   xtype: 'image',
                                src: 'resources/images/contest.png',
                                width: '192px',
                                height: '80px'
                            },
                            {   html: App.util.Strings['welcome_brief'],
                                margin: '16 0'
                            },
                            {   xtype: 'button',
                                action: 'samples-install',
                                iconCls: 'install',
                                iconMask: true
                            },
                            {   html: App.util.Strings['welcome_description'],
                                margin: '16 0'
                            }
                        ]
                    },
                    {
                        xtype: 'discover',
                        itemId: 'page-discover',
                        title: 'Discover'
                    },
                    {
                        itemId: 'page-about',
                        title: 'About',
                        styleHtmlContent: true,
                        scrollable: { direction: 'vertical', directionLock: true },
                        layout: 'vbox',
                        items: [
                            {   xtype: 'image',
                                src: 'resources/images/logo.png',
                                height: '64px'
                            },
                            {   html: App.util.Strings['about_version'],
                                cls: 'about-version',
                                margin: '24 0 8 0'
                            },
                            {   html: App.util.Strings['about_brief'],
                                margin: '8 0'
                            },
                            {   html: App.util.Strings['about_details']
                            }
                        ]
                    }
                ]
            }
        ],

        control: {
            'button[action=samples-install]': { tap: '_installSamples' },
            'button[action=close]': { tap: 'hide' }
        }
    },

    updateSamplesInstalled: function(installed) {
        var button = this.down('button[action=samples-install]');
        button.setUi(installed? 'defused' : 'action');
        button.setText(installed? 'Installed' : 'Generate Sample Tasks');
    },

    setPage: function(page) {
        var pages = this.child('tabpanel'),
            page = !Ext.isEmpty(page)? pages.child('#page-' + page) : null;
        pages.setActiveItem(page || 0);
    },

    setSection: function(section) {
        var page = this.child('tabpanel').getActiveItem();
        if (page && page.setSection) {
            page.setSection(section);
        }
    },

    /**
     * @private
     */
    _installSamples: function() {
        this.fireEvent('samplesinstall');
    }

});
