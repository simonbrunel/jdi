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
 * @class App.view.TaskListHeader
 * @author Simon Brunel
 *
 * **Todo**: move into App.util.Array?
 */
function _arrayDiff(array1, array2) {
    return array1.filter(function(item) {
        return !Ext.Array.contains(array2, item);
    });
}

Ext.define('App.view.TaskListHeader', {
    extend: 'Ext.Component',
    xtype: 'tasklistheader',

    config: {

        baseCls: 'x-list-header',

        html: ' ',

        hidden: true
    },

    _extraCls: [],

    updateHtml: function(html) {

        var extraCls = [],
            cls = '';

        this.callParent(arguments);

        if (!Ext.isEmpty(html)) {
            cls = this._clsFromHtml(html);
            if (!Ext.isEmpty(cls)) {
                extraCls.push('group-' + cls);
            }
        }

        this.removeCls(_arrayDiff(this._extraCls, extraCls));
        this._extraCls = extraCls;
        this.addCls(extraCls);
    },

    /**
     * @private
     */
    _clsFromHtml: function(html) {
        return html
            .trim()
            .replace(/<[^>]*>/gi, '')
            .replace(/ /gi, '_')
            .toLowerCase();
    }
});

Ext.define('App.view.TaskListItem', {
    extend: 'Ext.dataview.component.ListItem',
    xtype: 'tasklistitem',
    requires: [
        'App.util.Date',
        'App.widget.ProgressDial'
    ],

    config: {

        body: {

            xtype: 'container',
            cls: Ext.baseCSSPrefix + 'list-item-body',
            layout: { type: 'hbox', align: 'center' },
            items: [
                {
                    xtype: 'progressdial',
                    itemId: 'progress',
                    cls: 'task-duration',
                    maximum: 3600
                },
                {   // information
                    layout: { type: 'vbox', align: 'left' },
                    flex: 1,
                    items: [
                        {
                            itemId: 'task-title',
                            cls: 'task-title',
                            tpl: '{title}',
                            width: '100%'           //< to enable ellipsis
                        },
                        {
                            itemId: 'task-due',
                            cls: 'task-due',
                            tpl: '{due}'
                        }
                    ]
                }
            ]
        },

        header: {
            xtype: 'tasklistheader'
        }

    },

    cachedConfig: {
        baseCls: Ext.baseCSSPrefix + 'list-item'
    },

    _extraCls: [],

    updateRecord: function(record) {
        var dataview = this.dataview || this.getDataview(),
            store = dataview.getStore(),
            data = record && dataview.prepareData(
                record.getData(true),
                store.indexOf(record),
                record);

        this._record = record;
        this._updateBody(data);
        this.fireEvent('updatedata', this, data);
    },

    /**
     * @private
     */
    _updateBody: function(data) {
        var body = this.getBody();
        if (!body) {
            return;
        }

        var extraCls = [];
        if (data) {
            extraCls.push('task-' + App.util.Date.groupCls(data.due));
            if (data.completed) {
                extraCls.push('task-completed');
            }
        }

        // update body elements
        body.down('#progress').setValue(data && (data.duration || 0));
        body.down('#task-title').setData({ title: data && (data.title || '') });
        body.down('#task-due').setData({
            due: (data && data.due ?
                App.util.Date.toTimeAgo(data.due) :
                'No due date')
        });

        // update body classes
        body.removeCls(_arrayDiff(this._extraCls, extraCls));
        body.addCls(extraCls);
        this._extraCls = extraCls;
    }

});