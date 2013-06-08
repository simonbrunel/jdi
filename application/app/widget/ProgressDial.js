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
 * @class App.widget.ProgressDial
 * @author Simon Brunel
 *
 * **Note:** inspired in "Building Sencha Touch Custom Component" tutorial at
 * <http://www.sencha.com/blog/building-sencha-touch-customer-components-part-1/>
 */
Ext.define('App.widget.ProgressDial', {
    extend: 'Ext.Component',
    xtype: 'progressdial',
    requires: [
        'App.util.Math'
    ],

    config: {

        /**
         * @cfg {Number} value
         * Progress bar's current value.
         * @accessor
         */
        value: 0,

        /**
         * @cfg {Number} minimum
         * Progress bar's minimum value.
         * @accessor
         */
        minimum: 0,

        /**
         * @cfg {Number} maximum
         * Progress bar's maximum value.
         * @accessor
         */
        maximum: 100,

        interactive: false
    },

    cachedConfig: {
        baseCls:  Ext.baseCSSPrefix + 'progressdial'
    },

    template: [
        {
            cls: 'x-slice x-left',
            children: [
                {   // left slice mask
                    reference: 'lslice',
                    children: [ {} ]
                }
            ]
        },
        {
            cls: 'x-slice x-right',
            children: [
                {   // right slice mask
                    reference: 'rslice',
                    children: [ {} ]
                }
            ]
        },
        {   cls: 'x-indicator x-up' },
        {   cls: 'x-indicator x-down' }
    ],

    _listeners: null,

    _dragStartValue: null,

    applyValue: function(value) {
        return App.util.Math.bound(
            this.getMinimum(),
            Math.ceil(value),
            this.getMaximum()
        );
    },

    updateValue: function(value) {
        this._update();
        this.fireEvent('valuechanged', value);
    },

    updateMinimum: function() {
        this._update();
    },

    updateMaximum: function() {
        this._update();
    },

    updateInteractive: function(interactive) {
        var listeners = this._listeners;
        if (!listeners) {
            listeners = this._listeners = {
                touchstart: this._onTouchStart,
                touchend: this._onTouchEnd,
                dragstart: this._onDragStart,
                drag: this._onDrag,
                scope: this
            }
        }

        if (interactive) {
            this.element.on(listeners);
            this.addCls('x-interactive');
        } else {
            this.element.un(listeners);
            this.removeCls('x-interactive');
        }
    },

    currentPercent: function() {
        var min = this.getMinimum(),
            diff = this.getMaximum() - min;
        return diff > 0 ? (this.getValue() - min) / diff : 0;
    },

    /**
     * @private
     */
    _update: function() {
        var value = this.getValue(),
            angle = 360 * this.currentPercent(),
            rangle = App.util.Math.bound(0, angle, 180),
            langle = App.util.Math.bound(180, angle, 360);

        this.rslice.setStyle({
            '-webkit-transform': 'rotate(' + rangle + 'deg)',
            'visibility': (angle > 0? 'visible' : 'hidden')
        });

        this.lslice.setStyle({
            '-webkit-transform': 'rotate(' + langle + 'deg)',
            'visibility': (angle > 180? 'visible' : 'hidden')
        });

        this.toggleCls('x-minimum', value == this.getMinimum());
        this.toggleCls('x-maximum', value == this.getMaximum());
    },

    /**
     * @private
     */
    _onTouchStart: function(e) {
        this.addCls('x-pressing');
    },

    /**
     * @private
     */
    _onTouchEnd: function(e) {
        this.removeCls('x-pressing');
    },

    /**
     * @private
     */
    _onDragStart: function(e) {
        this._dragStartValue = this.getValue();
        e.stopPropagation();
    },

    /**
     * @private
     */
    _onDrag: function(e) {
        var start = this._dragStartValue,
            delta = e.deltaY / 256,
            min = this.getMinimum(),
            max = this.getMaximum();

        this.setValue(start + delta * Math.abs(max - min));
    }
});
