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
 * @class App.widget.ToolButton
 * @author Simon Brunel
 *
 * This component provides a simple checkable button.
 *
 * **Note**: inspired from Qt QAbstractButton implementation at
 * <http://qt-project.org/doc/qt-5.0/qtwidgets/qabstractbutton.html>
 */
Ext.define('App.widget.ToolButton', {
    extend: 'Ext.Button',

    xtype: 'toolbutton',

    config: {

        /**
         * @cfg {Boolean} checkable
         * This config holds whether the button is checkable (default: false).
         * @accessor
         */
        checkable: false,

        /**
         * @cfg {Boolean} checked
         * This config holds whether the button is checked. Only checkable
         * buttons can be checked. By default, the button is unchecked.
         * @accessor
         */
        checked: false,

        /**
         * @cfg {String} checkedCls
         * The CSS class to add to the Button when it is checked.
         * @accessor
         */
        checkedCls: Ext.baseCSSPrefix + 'button-pressed'

    },

    updateCheckable: function(checkable) {
        if (checkable) {
            this.onBefore({ tap: '_toggleCheck' });
        } else {
            this.unBefore({ tap: '_toggleCheck' });
        }
    },

    updateChecked: function(checked) {
        if (this.getCheckable() && checked) {
            this.addCls(this.getCheckedCls());
        } else {
            this.removeCls(this.getCheckedCls());
        }
    },

    /**
     * @private
     */
    _toggleCheck: function() {
        this.setChecked(!this.getChecked());
    }

});
