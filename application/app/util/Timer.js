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
 * @class App.util.Timer
 * @author Simon Brunel
 *
 * **Todo**: auto-correct tick delay by recomputing the effective interval.
 */
Ext.define('App.util.Timer', {
    mixins: [ 'Ext.mixin.Observable' ],

    config: {

        active: false,

        /**
         * Timer duration in milliseconds.
         */
        duration: 0,

        tickInterval: 1000

    },

    _started: null,

    constructor: function(config) {
        this.initConfig(config);
    },

    updateActive: function(active) {
        if (active) {
            this._started = new Date();
            this._evaluate();
        } else {
            this._started = null;
        }
    },

    applyTickInterval: function(interval) {
        return Math.max(100, interval);
    },

    /**
     * Start (or restart) the timer with the given *duration*.
     * @param {Number} duration Timer total duration.
     */
    start: function(duration) {
        this.setDuration(duration);
        this.setActive(true);
    },

    /**
     * Alias for setActive(false).
     */
    stop: function() {
        this.setActive(false);
    },

    /**
     * @private
     */
    _evaluate: function() {
        if (!this.getActive() || !this._started) {
            return;
        }

        var duration = this.getDuration(),
            elapsed = new Date().getTime() - this._started.getTime(),
            remaining = Math.max(0, duration - elapsed),
            interval = 0;

        if (remaining > 0) {
            this.fireEvent('tick', this, elapsed, remaining, duration);
            interval = Math.min(remaining, this.getTickInterval());
            Ext.defer(this._evaluate, interval, this);
        } else {
            this.fireEvent('timeout', this, duration);
            this.updateActive(false);
        }
    }
});
