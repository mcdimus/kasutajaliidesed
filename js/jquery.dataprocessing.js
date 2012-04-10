/**
 * jQuery Data Processing Plugin
 * version: 0.1 (2012-04-03)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Author Dmitri Maksimov
 */

(function( $, window, document, undefined ) {
    var Processor = {
        init: function( data, options ) {
            var self = this;

            if ( !$.isArray(data) ) {
                console.log('Array should be passed to the function!');
                return false;
            }

            self.data = data;

            if ( typeof options === 'object' ) {
                // rewrite defaults
                self.options = $.extend({}, $.processData.options, options);
            } else {
                // use defaults
                self.options = $.processData.options;
            }

            return true;
        },
        cycle: function() {
            var self = this;

            if (self.options.sort) {
                self.sort();
            }

            if (self.options.search) {
                self.search();
            }

            if (self.options.filter) {
                self.filter();
            }

            return self.data;
        },
        sort: function() {
            var self = this;

            var field = self.options.sortBy;

            function comparator(a,b) {
                // TODO: works only with strings. Fix it?
                var aName = a[field].toLowerCase();
                var bName = b[field].toLowerCase();

                // ascending
                var sortDir = (self.options.sortDir === 'DESC') ? -1 : 1;
                if (aName < bName) {
                    return -1 * sortDir;
                } else if (aName > bName) {
                    return 1 * sortDir;
                } else {
                    return 0;
                }
            };

            self.data.sort(comparator);
        },
        search: function() {
            var self = this;

            var field = self.options.searchBy;
            var criteria = self.options.searchCriteria;

            self.data = $.grep(self.data, function(value, index) {
                return (value[field].indexOf(criteria) != -1)
            });
        },
        filter: function() {
            var self = this;

            if (self.options.filter.category != 'All') {
                self.data = $.grep(self.data, function(value, index) {
                    return (value['category'] == self.options.filter.category);
                });
            }
            console.log(self.options.filter['name']);
            console.log(self.options.filter['description']);
            console.log(self.options.filter['isactive']);
            console.log(self.options.filter['state'])
            if (self.options.filter.isactive != undefined) {
                self.data = $.grep(self.data, function(value, index) {
                    var boolName = true;
                    if (self.options.filter['name'] != undefined)
                        boolName = (value['name'].indexOf(self.options.filter['name']) != -1);

                    var boolDescr = true;
                    if (self.options.filter['description'] != undefined)
                        boolDescr = (value['description'].indexOf(self.options.filter['description']) != -1);

                    var boolActive = true;
                    if (self.options.filter['isactive']) {
                        boolActive = (value['isActive'] == true);
                    } else {
                        boolActive = (value['isActive'] == false);
                    }

                    var boolState = true;
                    if (self.options.filter['state']) {
                        boolActive = (value['state'] == self.options.filter['state']);
                    }
//                    console.log(boolActive);
                    return boolName && boolDescr && boolActive;
                });
            }
        }
    }

    /*
    * Data - is array of objects in JSON format.
    * Options - settings which should be used during the processing.
    */
    $.processData = function( data, options ) {
        var processor = Object.create( Processor );
        if (!processor.init( data, options )) {
            console.log("Initialization failed.");
            return false;
        }

        return processor.cycle();
    };

    $.processData.options = {
        sort: false,
        sortBy: 'name',
        sortDir: 'ASC', // ASC or DESC

        search: false,
        searchBy: 'name',
        searchCriteria: false,

        filter: {
            category: 'All'
        }
    };

})( jQuery, window, document );
