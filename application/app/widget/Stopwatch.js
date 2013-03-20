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
         * Stopwatch duration (in seconds)
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
            {
                xtype: 'progressdial',
                itemId: 'progress',
                minimum: 0,
                maximum: 3600,
                interactive: false
            },
            {
                xtype: 'label',
                itemId: 'label',
                flex: 1
            }
        ]
    },

    cachedConfig: {
        baseCls: Ext.baseCSSPrefix + 'stopwatch'
    },

    applyTime: function(time) {
        return App.util.Math.bound(0, time, 3599);
    },

    updateTime: function(time) {
        this.child('#progress').setValue(time);
        this._updateLabel();
        this.fireEvent('timechange', time);
    },

    updateInteractive: function(interactive) {
        var progress = this.child('#progress');
        progress.setInteractive(interactive);
        if (interactive) {
            progress.on('valuechanged', '_onProgressValueChanged', this);
        } else {
            progress.un('valuechanged', '_onProgressValueChanged', this);
        }

        this._updateLabel();
    },

    updateEmptyText: function() {
        this._updateLabel();
    },

    updateLabelHidden: function(hidden) {
        this.child('#label').setHidden(hidden);
    },

    /**
     * @private
     */
    _updateLabel: function() {
        var text = this.getEmptyText(),
            label = this.child('#label'),
            time = this.getTime();
        if (text && time == 0) {
            label.addCls('x-emptytext');
            label.setHtml(text);
        } else {
            var value = Math.ceil(time/60); // minutes
            label.removeCls('x-emptytext');
            label.setHtml(
                '<div class="x-value">' + value + '</div>'+
                '<div class="x-suffix">min</div>'
            );
        }
    },

    /**
     * @private
     */
    _onProgressValueChanged: function(value) {
        this.setTime(value);
    }
});
