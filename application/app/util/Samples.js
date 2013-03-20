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
 * @class App.util.Samples
 * @author Simon Brunel
 */
Ext.define('App.util.Samples', {

    statics: {

        /**
         * Sample tasks data:
         * 2 lates / 1 yesterday / 2 today / 1 tomorrow / 4 soon / 6 someday
         *
         * **Note**: durations are expressed in minutes.
         */
        data: [
            { duration: 10, duedelta: -64, title: 'Repair my bike wheel' },
            { duration: 40, duedelta: -32, title: 'Join the badminton club' },
            { duration: 05, duedelta: -1, title: 'Make an appointment with the dentist' },
            { duration: 25, duedelta: 0, title: 'Sort paperwork and discard those that are no longer useful' },
            { duration: 25, duedelta: 0, title: 'Write and send a letter to cancel the car insurance' },
            { duration: 10, duedelta: 1, title: 'Pay electric bill' },
            { duration: 30, duedelta: 2, title: 'Buy birthday presents' },
            { duration: 35, duedelta: 4, title: 'Organize a party with badminton club buddies' },
            { duration: 60, duedelta: 6, title: 'Bake a birthday cake for my sweetheart' },
            { duration: 20, duedelta: 6, title: 'Get the suit to the dry cleaner\'s' },
            { duration: 45, duedelta: 8, title: 'Get a haircut, really :)' },
            { duration: 05, duedelta: 10, title: 'Reserve a table to dinner for 4 people' },
            { duration: 10, duedelta: 12, title: 'Go outside and hug a tree' },
            { duration: 20, duedelta: 16, title: 'Clean and organize my closet' },
            { duration: 15, duedelta: 32, title: 'Water indoor and outdoor plants' },
            { duration: 15, duedelta: 64, title: 'Book flight for the summer holidays (Orlando, Florida)' }
        ]
    }

});
