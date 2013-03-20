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
 * @class App.view.TaskPanel
 * @author Simon Brunel
 */
Ext.define('App.view.TaskPanel', {
    extend: 'Ext.Panel',
    xtype: 'taskpanel',
    requires: [
        'App.widget.ToolButton',
        'App.view.TaskDetails',
        'App.view.TaskForm'
    ],

     /**
     * @event taskupdate
     * @preventable _endEdit
     * Fires when the user submit the task edition form.
     * @param {Ext.form.Panel} Submitted form panel.
     */
     /**
     * @event tasktoggle
     * Fires when the user mark as done/undone the current task.
     * @param {Ext.data.Model} record Task associated record.
     * @param {Boolean} completed True if the task is done, else false.
     */
     /**
     * @event taskdelete
     * Fires when the user delete the current task.
     * @param {Ext.data.Model} record Task associated record.
     */
     /**
     * @event panelswipe
     * Fires when there is a swipe on the panel.
     * @param {Ext.event.Event} event Ext event encapsulating the DOM event.
     */
     /**
     * @event close
     * Fires when the user clicked the 'close' button.
     * @param {Ext.Panel} this component panel.
     */

    config: {

        record: null,

        /**
         * @cfg {Boolean} closeable
         * This config holds whether widgets related to provide the user a way
         * to close this panel, should be displayed or not.
         * @accessor
         */
        closeable: false,

        cls: 'view-taskpanel',

        layout: 'vbox',

        ui: 'light',

        items: [
            {   // header
                cls: 'panel-header',
                layout: { type: 'hbox' },
                items: [
                    {
                        itemId: 'header-title',
                        cls: 'title'
                    },
                    {   xtype: 'spacer'
                    },
                    {   xtype: 'button',
                        action: 'help',
                        help: 'taskpanel',
                        iconCls: 'help',
                        iconMask: true
                    },
                    {
                        xtype: 'button',
                        action: 'close',
                        iconCls: 'cancel',
                        iconMask: true
                    }
                ]
            },
            {   // pages
                layout: { type: 'card', animation: 'fade'},
                flex: 1,
                items: [
                    {   // task information
                        itemId: 'page-info',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'taskdetails',
                                flex: 1
                            },
                            {   // action bar
                                layout: { type: 'hbox', pack: 'center' },
                                defaultType: 'toolbutton',
                                cls: 'x-actionbar',
                                items: [
                                    {
                                        action: 'task-toggle',
                                        iconCls: 'task_check',
                                        iconMask: true,
                                        checkable: true
                                    },
                                    {
                                        action: 'task-edit',
                                        iconCls: 'task_edit',
                                        iconMask: true
                                    },
                                    {
                                        action: 'task-delete',
                                        iconCls: 'task_delete',
                                        iconMask: true
                                    }
                                ]
                            }
                        ]
                    },
                    {   // task edition
                        itemId: 'page-edit',
                        layout: 'vbox',
                        items: [
                            {
                                xtype: 'taskform',
                                flex: 1
                            },
                            {   // action bar
                                layout: { type: 'hbox', pack: 'center' },
                                defaultType: 'toolbutton',
                                cls: 'x-actionbar',
                                items: [
                                    {
                                        action: 'task-update',
                                        iconCls: 'task_update',
                                        iconMask: true,
                                        ui: 'confirm'
                                    },
                                    {
                                        action: 'task-cancel',
                                        iconCls: 'cancel',
                                        iconMask: true
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],

        control: {
            'button[action=task-toggle]': { tap: '_toggleTask' },
            'button[action=task-update]': { tap: '_updateTask' },
            'button[action=task-delete]': { tap: '_deleteTask' },
            'button[action=task-edit]': { tap: '_beginEdit' },
            'button[action=task-cancel]': { tap: '_endEdit' },
            'button[action=close]': { tap: '_close' }
        }
    },

    /**
     * @private
     * Internal component references (optimizations).
     * See *_ensureRefs* for available references.
     */
    _refs: null,

    _statusCls: '',

    initialize: function() {
        this.callParent();
        this.element.on({
            scope: this,
            swipe: function(event) {
                this.fireEvent('panelswipe', event);
            }
        });
        this._showPage('info');
        this.updateRecord(null);
    },

    applyRecord: function(record) {
        this._showPage('info');
        return record;
    },

    updateRecord: function(record) {
        var data = record? record.getData() : {},
            refs = this._ensureRefs();

        // update status class
        var statusCls = (
            !record? '' :
            data.completed? 'status-completed' :
            'status-' + App.util.Date.groupCls(data.due));

        if (statusCls != this._statusCls) {
            this.replaceCls(this._statusCls, statusCls);
            this._statusCls = statusCls;
        }

        // update details
        refs.details.setData(data);

        // update buttons state
        refs.buttonedit.setDisabled(record == null);
        refs.buttondelete.setDisabled(record == null);
        refs.buttontoggle.setDisabled(record == null);
        refs.buttontoggle.setChecked(data.completed || false);
    },

    updateCloseable: function(closeable) {
        var refs = this._ensureRefs();
        refs.buttonclose.setHidden(!closeable);
    },

    /**
     * @private
     */
    _ensureRefs: function() {
        if (this._refs == null) {
            this._refs = {
                buttonclose: this.down('button[action=close]'),
                buttonedit: this.down('button[action=task-edit]'),
                buttondelete: this.down('button[action=task-delete]'),
                buttontoggle: this.down('button[action=task-toggle]'),
                details: this.down('taskdetails'),
                form: this.down('taskform'),
                title: this.down('#header-title')
            };
        }

        return this._refs;
    },

    /**
     * @private
     */
    _showPage: function(id) {
        var component = this.down('#page-' + id),
            refs = this._ensureRefs(),
            title = '';

        if (!component) {
            console.error('invalid page id:', id);
            return;
        }

        if (id == 'info') {
            title = 'Task Info';
        } else if (id == 'edit') {
            title = 'Edit Task';
        }

        refs.title.setHtml(title);
        component.getParent().setActiveItem(component);
    },

    /**
     * @private
     */
    _toggleTask: function(button) {
        var record = this.getRecord();
        if (!record) {
            return;
        }

        this.fireEvent('tasktoggle', record, button.getChecked());
    },

    /**
     * @private
     */
    _updateTask: function() {
        var record = this.getRecord();
        if (!record) {
            return;
        }

        var refs = this._ensureRefs();
        this.fireAction('taskupdate', [ refs.form ], '_endEdit');
    },

    /**
     * @private
     */
    _deleteTask: function() {
        var record = this.getRecord();
        if (!record) {
            return;
        }

        this.fireEvent('taskdelete', record);
    },

    /**
     * @private
     */
    _beginEdit: function() {
        var refs = this._ensureRefs(),
            record = this.getRecord();
        refs.form.setRecord(record);

        // HACK because of the date conversion in the Task model, so we need
        // to force string->date conversion by calling the model getData().
        refs.form.setValues(record.getData());

        this._showPage('edit');
    },

    /**
     * @private
     */
    _endEdit: function() {
        this._showPage('info');
    },

    /**
     * @private
     */
    _close: function() {
        this.fireEvent('close', this);
    }
});
