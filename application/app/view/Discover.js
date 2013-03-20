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
 * @class App.view.Discover
 * @author Simon Brunel
 *
 * **Todo**: Move all sections into separated views.
 */
Ext.define('App.view.Discover', {
    extend: 'Ext.Container',
    xtype: 'discover',
    requires: [
        'App.util.Strings'
    ],

    config: {

        layout: 'vbox',

        items: [
            {   // sections (carousel)
                xtype: 'carousel',
                directionLock: true,
                ui: 'light',
                flex: 1,

                defaults: {
                    styleHtmlContent: true,
                    layout: { type: 'vbox' },
                    scrollable: {
                        direction: 'vertical',
                        directionLock: true
                    }
                },

                items: [
                    {   // Overview
                        itemId: 'section-overview',
                        items: [
                            {   html: 'Overview', cls: 'x-title'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_toolbar.png',
                                height: 58
                            },
                            {   html: App.util.Strings['help_toolbar'],
                                margin: '16 0'
                            },
                            {   html: 'User Account',
                                cls: 'x-title'
                            },
                            {   html: App.util.Strings['help_account_brief'],
                                margin: '0 0 16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_account.png',
                                height: 138
                            },
                            {   html: App.util.Strings['help_account_legend'],
                                margin: '16 0'
                            }
                        ]
                    },
                    {   // Create Task
                        itemId: 'section-taskcreate',
                        items: [
                            {   html: 'Create a task',
                                cls: 'x-title',
                                margin: '0 0 16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_create_form.png',
                                height: 240
                            },
                            {   html: App.util.Strings['help_create_form_legend'],
                                margin: '16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_create_actions.png',
                                height: 64
                            },
                            {   html: App.util.Strings['help_create_actions_legend'],
                                margin: '16 0'
                            }
                        ]
                    },
                    {   // Task List
                        itemId: 'section-tasklist',
                        items: [
                            {   html: 'Browse', cls: 'x-title'
                            },
                            {   html: App.util.Strings['help_tasklist_brief'],
                                margin: '0 0 16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_tasklist_elements.png',
                                height: 128
                            },
                            {   html: App.util.Strings['help_tasklist_elements'],
                                margin: '16 0'
                            },
                            {   html: 'Interact', cls: 'x-title'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_tasklist_actions.png',
                                height: 172
                            },
                            {   html: App.util.Strings['help_tasklist_actions'],
                                margin: '16 0'
                            }
                        ]
                    },
                    {   // Task Panel
                        itemId: 'section-taskpanel',
                        items: [
                            {   html: 'Review your tasks',
                                cls: 'x-title'
                            },
                            {   html: App.util.Strings['help_taskpanel_brief'],
                                margin: '0 0 16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_taskpanel_elements.png',
                                height: 130
                            },
                            {   html: App.util.Strings['help_taskpanel_elements'],
                                margin: '16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_taskpanel_actions.png',
                                height: 72
                            },
                            {   html: App.util.Strings['help_taskpanel_actions'],
                                margin: '16 0'
                            },
                            {   html: 'Edit your tasks',
                                cls: 'x-title'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_taskedit_form.png',
                                height: 224
                            },
                            {   html: App.util.Strings['help_taskedit_form'],
                                margin: '16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_taskedit_actions.png',
                                height: 64
                            },
                            {   html: App.util.Strings['help_taskedit_actions'],
                                margin: '16 0'
                            }
                        ]
                    },
                    {   // Session Task
                        itemId: 'section-session',
                        items: [
                            {   html: 'Challenge Yourself', cls: 'x-title'
                            },
                            {   html: App.util.Strings['help_session_brief'],
                                margin: '0 0 16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_session_setup.png',
                                height: 116
                            },
                            {   html: App.util.Strings['help_session_setup'],
                                margin: '16 0'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_session_running.png',
                                height: 116
                            },
                            {   html: App.util.Strings['help_session_running'],
                                margin: '16 0'
                            },
                            {   html: 'Interact',
                                cls: 'x-title'
                            },
                            {   xtype: 'image',
                                src: 'resources/images/help_session_actions.png',
                                height: 240
                            },
                            {   html: App.util.Strings['help_session_actions'],
                                margin: '16 0'
                            }
                        ]
                    }
                ]
            },
            {   // action bar
                layout: { type: 'hbox', pack: 'center' },
                defaultType: 'toolbutton',
                cls: 'x-actionbar',
                items: [
                    {
                        xtype: 'button',
                        action: 'previous',
                        iconCls: 'previous',
                        iconMask: true
                    },
                    {
                        xtype: 'button',
                        action: 'next',
                        iconCls: 'next',
                        iconMask: true
                    }
                ]
            }
        ],

        control: {
            'button[action=previous]': { tap: '_previous' },
            'button[action=next]': { tap: '_next' },
            'carousel': { activeitemchange: '_update' }
        }
    },

    initialize: function() {
        this.callParent(arguments);
        this._update();
    },

    setSection: function(section) {
        var sections = this.down('carousel'),
            section = sections.child('#section-' + section);
        if (section) {
            sections.setActiveItem(section);
        }
    },

    /**
     * @private
     */
    _previous: function() {
        this.down('carousel').previous();
    },

    /**
     * @private
     */
    _next: function() {
        this.down('carousel').next();
    },

    /**
     * @private
     */
    _update: function(carousel) {
        var previous = this.down('button[action=previous]'),
            next = this.down('button[action=next]'),
            sections = this.down('carousel'),
            index = sections.getActiveIndex(),
            last = sections.getMaxItemIndex();

        previous.setDisabled(index <= 0);
        next.setDisabled(index >= last);
    }
});
