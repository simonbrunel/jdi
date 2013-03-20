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
 * @class App.controller.Task
 * @author Simon Brunel
 *
 * Implements base task actions, such as creation, edition, deletion,
 * synchonization and display.
 */
Ext.define('App.controller.Task', {
    extend: 'Ext.app.Controller',
    requires: [
        'App.util.Date',
        'App.util.Math',
        'App.view.TaskCreate'
    ],

    config: {

        stores: ['Tasks'],

        currentTask: null,

        refs: {
            taskList: '#app-tasks tasklist',
            taskPanel: '#app-tasks taskpanel',
            taskCreatePanel: '#app-taskcreatepanel'
        },

        control: {

            // 'Create' main action.
            'button[action=task-create]': {
                tap: '_showTaskCreate'
            },

            // 'Create' section.
            '#app-taskcreatepanel': {
                taskcommit: '_commitTask',
                close: '_closeTaskCreate'
            },

            // Task panel.
            '#app-tasks taskpanel': {
                tasktoggle: '_toggleTask',
                taskupdate: '_commitTask',
                taskdelete: '_deleteTask'
            },

            // Task list.
            '#app-tasks tasklist': {
                selectionchange: '_onTaskListSelectionChange',
                itemswipe: '_onTaskListItemSwipe'
            }
        }
    },

    init: function() {
        this.callParent(arguments);
        Ext.getStore('tasks').on({
            scope: this,
            updaterecord: this._onUpdateRecord,
            deleterecords: this._onDeleteRecords
        });
    },

    launch: function() {

        // start monitoring the Sencha IO controller.
        this.getApplication().sio.on({
            usermessage: '_onSIOUserMessage',
            scope: this
        });

    },

    /**
     * Display the task associated to the given record. This method can be
     * reimplement by derived controller for profile specific implementation.
     */
    updateCurrentTask: function(record) {
        this.getTaskPanel().setRecord(record);
    },

    /**
     * @private
     */
    _validateTask: function(record) {
        var errors = record.validate();
        if (errors.isValid()) {
            return true;
        }

        var message = '';
        errors.each(function(error){
            message += error.getMessage() + '<br/>';
        }, this);

        Ext.Msg.alert('Invalid fields', message);
        return false;
    },

    /**
     * @private
     * Pushes retrieved values from the submitted *form* into the tasks store
     * as a new record or an update (depending on the form's record validity).
     */
    _commitTask: function(form) {
        var record = form.getRecord(),
            values = form.getValues(),
            isNew = (record == null),
            now = new Date();

        if (isNew) {
            record = Ext.create('App.model.Task', { created: now });
        }

        record.beginEdit();
        record.set({
            title: values.title || '',
            duration: values.duration || null,
            due: values.due || null,
            updated: now
        });

        // Task field validation
        if (!this._validateTask(record)) {
            record.cancelEdit();
            return false;
        }

        record.endEdit();

        if (isNew) {
            Ext.getStore('tasks').add(record);
            //! @TODO 'Add' notification ?!
        } else {
            //! @TODO 'Edit' notification ?!
        }

        this._sync();
        return true;
    },

    /**
     * @private
     */
    _toggleTask: function(record, completed) {
        record.set('completed', completed? new Date() : null);

        //! @TODO notification (if completed)

        this._sync();
        return true;
    },

    /**
     * @private
     * Mark as deleted the given *record*.
     */
    _deleteTask: function(record) {
        record.set('deleted', true);

        //! @TODO notification

        this._sync();
        return true;
    },

    /**
     * @private
     */
    _restoreTask: function(record) {
        record.set({
            completed: null,
            deleted: false
        });

        this._sync();
        return true;
    },

    /**
     * @private
     * Synchronize the tasks store and notify changes to other devices.
     */
    _sync: function() {
        var store = Ext.getStore('tasks');
        store.sync(function(response) {
            if (response.r == 'ok') {
                store.broadcast();
            }
        });
    },

    /**
     * @private
     * Called when the app receives a message from the Sencha IO API.
     */
    _onSIOUserMessage: function(sender, message) {
        if (message == 'updated') {
            Ext.getStore('tasks').sync(function(response) {
                console.log('sio/ tasks re-synced:', response.r);
            });
        }
    },

    /**
     * @private
     */
    _onUpdateRecord: function(store, record) {
        var curr = this.getCurrentTask();
        if (curr != null && record != null && curr.getId() == record.getId()) {

            // WORKAROUND: apparently we do not receive the store
            // deleterecords notification when deleting an item
            // from another device (Sencha IO bug?)
            if (!record.get('deleted')) {
                this.getTaskPanel().updateRecord(record);
            } else {
                this.setCurrentTask(null);
            }
        }
    },

    /**
     * @private
     */
    _onDeleteRecords: function(store, records) {
        if (Ext.Array.contains(records, this.getCurrentTask())) {
            this.setCurrentTask(null);
        }
    },

    /**
     * @private
     * - **Note**: the 'current task' update is defered because we receiving
     * two events for 'selectionchange', one for the previous deselected
     * record and another for the current selected item (10 ms seems enought,
     * we just need to go through the event loop). If we don't do that, we
     * will experience some UI unwanted hide/show behaviour.
     */
    _onTaskListSelectionChange: function(list) {
        var me = this;
        Ext.defer(function() {
            var records = list.getSelection(),
                record = !Ext.isEmpty(records)? records[0] : null;
            if (record != me.getCurrentTask()) {
                me.setCurrentTask(record);
            }
        }, 10);
    },

    /**
     * @private
     */
    _onTaskListItemSwipe:  function(list, index, target, record, e) {
        if (record.get('completed')) {
            if (e.direction == 'left') {
                this._restoreTask(record);
            } else {
                this._deleteTask(record);
            }
        } else {
            if (e.direction == 'right') {
                this._toggleTask(record, true);
            }
        }
    },

    /**
     * @private
     */
    _showTaskCreate: function() {
        var panel = this.getTaskCreatePanel();
        if (!Ext.isDefined(panel)) {
            panel = Ext.Viewport.add({
                xtype: 'taskcreate',
                id: 'app-taskcreatepanel',
                modal: true,
                centered: true,
                width: '90%',
                height: '90%',
                maxWidth: '20em'
            });
        }

        panel.show('fadeIn');
    },

    /**
     * @private
     */
    _closeTaskCreate: function() {
        var panel = this.getTaskCreatePanel();
        panel.hide('fadeOut');
    }
});