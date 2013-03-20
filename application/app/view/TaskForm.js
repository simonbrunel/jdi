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
 * @class App.view.TaskForm
 * @author Simon Brunel
 */
Ext.define('App.view.TaskForm', {
    extend: 'Ext.form.Panel',
    xtype: 'taskform',

    config: {

        layout: 'vbox',

        defaults: {
            labelAlign: 'top',
            clearIcon: false
        },

        items: [
            {
                xtype: 'textfield',
                name: 'title',
                label: 'Task label',
                required: true
            },
            {
                xtype: 'datepickerfield',
                name: 'due',
                label: 'Due date',
                picker: {
                    value: new Date(),
                    doneButton: {
                        xtype: 'button',
                        iconCls: 'confirm',
                        iconMask: true
                    },
                    cancelButton: {
                        xtype: 'button',
                        iconCls: 'cancel',
                        iconMask: true
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'duration',
                label: 'Duration (in minutes)'
            }
        ]
    },

    /**
     * **[HACK]** duration conversion (seconds => minutes).
     * Better alternative: duration field widget.
     */
    setValues: function(values) {
        var duration = null,
            result = null;

        if (Ext.isDefined(values.duration) &&
            Ext.isNumber(values.duration)) {
            duration = values.duration;
            values.duration = Math.round(values.duration / 60);
        }

        result = this.callParent(arguments);
        if (duration) {
            // restore previous record duration value.
            values.duration = duration;
        }

        return result;
    },

    /**
     * **[HACK]** duration conversion (minutes => seconds).
     * Better alternative: duration field widget.
     */
    getValues: function(enabled, all) {
        var values = this.callParent(arguments);
        if (Ext.isDefined(values.duration) &&
            Ext.isNumber(values.duration)) {
            values.duration *= 60;
        }

        return values;
    }
});
