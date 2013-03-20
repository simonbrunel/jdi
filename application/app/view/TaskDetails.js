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
 * @class App.view.TaskDetails
 * @author Simon Brunel
 */
Ext.define('App.view.TaskDetails', {
    extend: 'Ext.Container',
    xtype: 'taskdetails',
    requires: [
        'App.widget.Stopwatch',
        'App.util.Date'
    ],

    config: {

        data: {},

        cls: 'view-taskdetails',

        scrollable: { direction: 'vertical', directionLock: true },

        layout: 'vbox',

        items: [
            {
                itemId: 'task-title',
                cls: 'task-title'
            },
            {
                cls: 'task-attributes',
                layout: 'hbox',
                items: [
                    {   // attributes
                        itemId: 'task-attributes',
                        flex: 1
                    },
                    {   // duration
                        xtype: 'stopwatch',
                        itemId: 'task-duration'
                    }
                ]
            }
        ]
    },

    /**
     * @private
     * Internal component references (optimizations)
     * See _ensureRefs for available references.
     */
    _refs: null,

    updateData: function(data) {
        this._updateTitle(data);
        this._updateDuration(data);
        this._updateAttributes(data);
    },

    /**
     * @private
     */
    _ensureRefs: function() {
        if (this._refs == null) {
            this._refs = {
                attributes: this.down('#task-attributes'),
                stopwatch: this.down('#task-duration'),
                title: this.down('#task-title')
            };
        }

        return this._refs;
    },

    /**
     * @private
     */
     _updateTitle: function(data) {
        var refs = this._ensureRefs(),
            title = data? data.title : null;
        refs.title.setHidden(Ext.isEmpty(title));
        refs.title.setHtml(title || '');
    },

    /**
     * @private
     */
     _updateDuration: function(data) {
        var refs = this._ensureRefs(),
            duration = data ? data.duration || 0 : 0;
        refs.stopwatch.setHidden(duration <= 0);
        refs.stopwatch.setTime(duration);
    },

    /**
     * @private
     */
    _updateAttributes: function(data) {
        var refs = this._ensureRefs(),
            due = null,
            created = null,
            completed = null,
            attributes = [],
            items = [];

        if (data) {
            due = data.due || due;
            created = data.created || created;
            completed = data.completed || completed;
        }

        if (Ext.isDate(completed)) {
            attributes.push({
                label: 'done',
                value: App.util.Date.toTimeAgo(completed),
                cls: 'completed'
            });
        }

        if (Ext.isDate(due)) {
            attributes.push({
                label: 'due',
                value: App.util.Date.toTimeAgo(due),
                cls: !Ext.isDate(completed)? App.util.Date.groupCls(due) : null
            });
        }

        if (Ext.isDate(created)) {
            attributes.push({
                label: 'added',
                value: App.util.Date.toTimeAgo(created)
            });
        }

        Ext.each(attributes, function(attribute) {
            items.push({
                cls: ['task-attribute', attribute.cls || ''],
                data: attribute,
                tpl: '<div class="label">{label}</div>'
                    +'<div class="value">{value}</div>'
            });
        });

        refs.attributes.setHidden(Ext.isEmpty(items));
        refs.attributes.setItems(items);
    }
});
