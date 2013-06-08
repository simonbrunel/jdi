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
 * @class App.widget.Stopwatch
 * @author Simon Brunel
 */
Ext.define('App.widget.Stopwatch', {
    extend: 'Ext.Container',
    xtype: 'stopwatch',
    requires: [
        'App.widget.ProgressDial'
    ],

    /**
     * @event timechange
     * Fires when the stopwatch time has changed.
     * @param {Number} time Current stopwatch time.
     */

     config: {

        /**
         * @cfg {Number} duration
         * Stopwatch duration (in minutes)
         * @accessor
         */
        time: 0,

        /**
         * @cfg {Boolean} interactive
         * When the stopwatch is interactive, the user can interact with this
         * widget to manually change the value of *time*.
         * @accessor
         */
        interactive: false,

        /**
         * @cfg {String} emptyText
         * Text displayed when the current time is 0 ('0min' by default).
         * @accessor
         */
        emptyText: null,

        labelHidden: false,

        layout: { type: 'hbox', align: 'center' },

        items: [
            {   xtype: 'progressdial',
                itemId: 'progress',
                minimum: 0,
                maximum: 60,
                interactive: false
            },
            {   xtype: 'component',
                itemId: 'label',
                cls: 'x-label',
                flex: 1,
                tpl: [
                    '<tpl if="empty">',
                        '<div class="x-emptytext">{text}</div>',
                    '<tpl else>',
                        '<div class="x-value">{time}</div>',
                        '<div class="x-suffix">min</div>',
                    '</tpl>'
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

    cachedConfig: {
        baseCls: Ext.baseCSSPrefix + 'stopwatch'
    },

    applyTime: function(time) {
        return App.util.Math.bound(0, Math.ceil(time), 60);
    },

    updateTime: function(time) {
        var refs = this._ensureRefs();
        refs.progress.setValue(time);
        this._updateLabel(refs.label);
        this.fireEvent('timechange', time);
    },

    updateInteractive: function(interactive) {
        var refs = this._ensureRefs(),
            progress = refs.progress,
            listeners = {
                valuechanged: this._onProgressValueChanged,
                scope: this
            };

        progress.setInteractive(interactive);
        if (interactive) {
            progress.on(listeners);
        } else {
            progress.un(listeners);
        }

        this._updateLabel(refs.label);
    },

    updateEmptyText: function() {
        var refs = this._ensureRefs();
        this._updateLabel(refs.label);
    },

    updateLabelHidden: function(hidden) {
        var refs = this._ensureRefs();
        refs.label.setHidden(hidden);
    },

    /**
     * @private
     */
    _ensureRefs: function() {
        if (this._refs == null) {
            this._refs = {
                progress: this.child('#progress'),
                label: this.child('#label')
            };
        }

        return this._refs;
    },

    /**
     * @private
     */
    _updateLabel: function(component) {
        var text = this.getEmptyText(),
            time = this.getTime();
        component.setData({
            empty: (text && time == 0),
            time: time,
            text: text
        });
    },

    /**
     * @private
     */
    _onProgressValueChanged: function(value) {
        this.setTime(value);
    }
});
