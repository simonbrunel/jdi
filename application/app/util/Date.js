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
 * @class App.util.Date
 * @author Simon Brunel
 *
 * Date manipulation static helpers.
 */
Ext.define('App.util.Date', {

    statics: {

        _groupOrder: [ 'late', 'today',  'tomorrow',  'soon', 'someday' ],

        toTimeAgo: function(date) {
            if (!date || !Ext.isDate(date)) {
                return date;
            }

            var days = this._dayDiff(date, new Date());
            if (days < -1) {
                var range = this._rangeFromDays(days);
                return Ext.String.format('{0} {1} ago', range.count, range.name);
            } else if (days == -1) {
                return 'yesterday';
            } else if (days == 0) {
                return'today';
            } else if (days == 1) {
                return 'tomorrow';
            } else { // days > 1
                var range = this._rangeFromDays(days);
                return Ext.String.format('in {0} {1}', range.count, range.name);
            }
        },

        /**
         * Returns a 'user friendly' range for the given number of days, for
         * instance for 42 days, returns {name: 'month', count: 1}.
         * Range name can be 'day(s)', 'week(s)', 'month(s)', 'year(s)'
         *
         * **Note**: The range count is always >= 0.
         */
        _rangeFromDays: function(days) {
            var count, name;
            days = Math.abs(days);
            if (days < 7) {
                count = days;
                name = count <= 1? 'day' : 'days';
            } else if (days < 31) {
                count = Math.round(days / 7);
                name = count <= 1? 'week' : 'weeks';
            } else if (days < 365) {
                count = Math.round(days / 31);
                name = count <= 1? 'month' : 'months';
            } else { // days >= 365
                count = Math.round(days / 365);
                name = count <= 1? 'year' : 'years';
            }

            return { name: name, count: count };
        },

        /**
         * Returns a group name base on the given *date* and relative to 'now'.
         * @returns {String} late, today, soon, someday
         */
        groupName: function(date) {
            if (!date || !Ext.isDate(date)) {
                return 'today';
            }

            var days = this._dayDiff(date, new Date());
            if (days < 0) {
                return 'late';
            } else if (days == 0) {
                return 'today';
            //} else if (days == 1) {
            //    return 'tomorrow';
            } else if (days < 7) {  // one week
                return 'soon';
            } else {
                return 'someday';
            }
        },

        groupCls: function(date) {
            return this.groupName(date).toLowerCase();
        },

        groupSorter: function(group1, group2) {
            var i1 = Ext.Array.indexOf(this._groupOrder, group1),
                i2 = Ext.Array.indexOf(this._groupOrder, group2);
            return (i1 > i2 ? 1 : (i1 < i2 ? -1 : 0));
        },

        encode: function(value) {
            if (Ext.isDate(value)) {
                return value.toISOString();
            } else {
                return value;
            }
        },

        decode: function(value) {
            if (Ext.isString(value)) {
                return new Date(value);
            } else {
                return value;
            }
        },

        /**
         * @private
         * Returns a date rounded to hour 0 of the day (used for diff).
         */
        round: function(date) {
            date.setHours(0);
            date.setMinutes(0);
            date.setSeconds(0);
            date.setMilliseconds(0);
            return date;
        },

        /**
         * @private
         * Returns the number of days between the given dates *d1* and *d2*.
         *
         * **Note**: date associated time is not take in account.
         */
        _dayDiff: function(d1, d2) {
            return ~~((this.round(d1) - this.round(d2))/86400000);
        }
    }

});