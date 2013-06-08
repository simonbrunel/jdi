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
 * @class App.util.Overrides
 * @author Simon Brunel
 *
 * App global overrides, currently used for Sencha.io external fixes.
 */
Ext.define('App.util.Overrides', {
    requires: [
        'Ext.io.Io'     // Should be loaded before our override
    ]
}, function() {

    // PATCH IO 0.7.13 (callback not called when there is no proxy)
    Ext.data.Store.prototype._sync_base_impl = Ext.data.Store.prototype.sync;
    Ext.data.Store.override({
        sync: function(callback, scope) {
            var result = this._sync_base_impl(callback, scope);
            if (callback && typeof(this.getProxy().sync) === 'undefined') {
                callback.call(scope, { r: 'ok' });
            }
            return result;
        }
    });

    // PATCH TOUCH 2.2.1 (isPainted is really too slow)
    // Code from Sencha Touch 2.1.1
    Ext.dom.Helper.override({
        insertHtml: function(where, el, html) {
            var setStart, range, frag, rangeEl, isBeforeBegin, isAfterBegin;

            where = where.toLowerCase();

            if (Ext.isTextNode(el)) {
                if (where == 'afterbegin' ) {
                    where = 'beforebegin';
                } else if (where == 'beforeend') {
                    where = 'afterend';
                }
            }

            isBeforeBegin = where == 'beforebegin';
            isAfterBegin = where == 'afterbegin';

            range = Ext.feature.has.CreateContextualFragment ? el.ownerDocument.createRange() : undefined;
            setStart = 'setStart' + (this.endRe.test(where) ? 'After' : 'Before');

            if (isBeforeBegin || where == 'afterend') {
                if (range) {
                    range[setStart](el);
                    frag = range.createContextualFragment(html);
                } else {
                    frag = this.createContextualFragment(html);
                }
                el.parentNode.insertBefore(frag, isBeforeBegin ? el : el.nextSibling);
                return el[(isBeforeBegin ? 'previous' : 'next') + 'Sibling'];
            } else {
                rangeEl = (isAfterBegin ? 'first' : 'last') + 'Child';
                if (el.firstChild) {
                    if (range) {
                        range[setStart](el[rangeEl]);
                        frag = range.createContextualFragment(html);
                    } else {
                        frag = this.createContextualFragment(html);
                    }

                    if (isAfterBegin) {
                        el.insertBefore(frag, el.firstChild);
                    } else {
                        el.appendChild(frag);
                    }
                } else {
                    el.innerHTML = html;
                }
                return el[rangeEl];
            }
        }
    });
});
