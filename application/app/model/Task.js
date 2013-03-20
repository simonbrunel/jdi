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
 * Data type used in our *Task* model for date field. Knowing that we can't use
 * the standard *date* type with Sencha IO data synchronization, we use the
 * *String* data type with sortType *asDate*.
 *
 * -**See**: <http://docs.sencha.com/touch/2-1/#!/api/Ext.data.Types>
 */
Ext.data.Types.DATETIME = {
    convert: function(value) {
        // 'this' is the actual field that calls this convert method
        return (value === undefined || value === null)
            ? (this.getAllowNull() ? null : '')
            : String(value);
    },
    sortType: Ext.data.SortTypes.asDate,
    type: 'datetime'
};

/**
 * @class App.model.Task
 * @author Simon Brunel
 *
 * **[HACK]** Sencha IO date support.
 *
 * Sencha IO 0.7.5 should be fixed to work correctly with date, so currently we
 * must use ISO string date to make this store working with sencha cloud. Also
 * trying to define a new data Type, with custom methods encode/decode/convert,
 * but doesn't work. It's why getters and setters have been overrided for
 * convenience, to avoid outside type conversions.
 */
Ext.define('App.model.Task', {
    extend: 'Ext.data.Model',

    config: {

        fields: [
            { name: 'title', type: 'string' },
            { name: 'duration', type: 'int', defaultValue: 0 },
            { name: 'due', type: 'datetime', defaultValue: null },
            { name: 'created', type: 'datetime' },
            { name: 'updated', type: 'datetime' },
            { name: 'completed', type: 'datetime', defaultValue: null },
            { name: 'deleted', type: 'boolean', defaultValue: false }
        ],

        validations: [
            { type: 'presence', name: 'title', message: "Enter a task label" }
        ]
    },

    _dateFields: [ 'due', 'created', 'updated', 'completed' ],

    get: function(fieldName) {
        var value = this.callParent([ fieldName ]);
        if (Ext.Array.contains(this._dateFields, fieldName)) {
            value = App.util.Date.decode(value);
        }
        return value;
    },

    getData: function(includeAssociated) {
        var data = this.callParent([ includeAssociated ]),
            me = this;
        Ext.Object.each(data, function(key, value) {
            if (Ext.Array.contains(me._dateFields, key)) {
                data[key] = App.util.Date.decode(value);
            }
        });
        return data;
    },

    set: function(fieldName, value) {
        if (arguments.length == 1) {

            var me = this;
            Ext.Object.each(fieldName, function(key, value) {
                if (Ext.Array.contains(me._dateFields, key)) {
                    fieldName[key] = App.util.Date.encode(value);
                }
            });

            this.callParent([ fieldName ]);

        } else {

            if (Ext.Array.contains(this._dateFields, fieldName)) {
                value = App.util.Date.encode(value);
            }

            this.callParent([ fieldName, value ]);

        }
    }
});