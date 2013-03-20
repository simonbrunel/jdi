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
 * @class App.widget.AutoBoxLayout
 * @author Simon Brunel
 *
 * Layout for which its orientation is based on the current device orientation.
 */
Ext.define('App.widget.AutoBoxLayout', {
    extend: 'Ext.layout.FlexBox',
    alias: 'layout.autobox',

    config: {

        /**
         * @cfg {Boolean} auto
         *
         * If *true*, the layout orientation (orient) will automatically be
         * changed according to the current device (viewport) orientation:
         *
         * - *vertical* layout if device is in *portrait* mode
         * - *horizontal* layout if device is in *landscape* mode
         *
         * @accessor
         */
        auto: true,

        /**
         * @cfg {Boolean} reverse
         * Reversed layout are *vertical* in *landscape*, else *horizontal*.
         * @accessor
         */
        reverse: false
    },

    statics: {

        /**
         * @private
         */
        _reverseOrient: function(orient) {
            return (orient == 'vertical'? 'horizontal' : 'vertical');
        }
    },

    updateAuto: function(auto) {
        if (auto) {
            Ext.Viewport.on('orientationchange', '_orientationChange', this);
            this._updateOrientation();
        } else {
            Ext.Viewport.un('orientationchange', '_orientationChange', this);
        }
    },

    /**
     * @private
     */
    _updateOrientation: function(orientation) {
        orientation = orientation || Ext.Viewport.getOrientation();
        var orient = (orientation == 'portrait' ? 'vertical' : 'horizontal');
        this.setOrient(
            this.getReverse()?
                this.self._reverseOrient(orient) :
                orient);
    },

    /**
     * @private
     * Called when the viewport orientation have changed.
     */
    _orientationChange: function(viewport, orientation) {
        if (!this.getAuto()) {
            return;
        }

        this._updateOrientation(orientation);
    }
});
