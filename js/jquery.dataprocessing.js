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
        }
    }

    $.processData = function( data, options ) {
        var processor = Object.create( Processor );
        if (!processor.init( data, options )) {
            console.log("Initialization failed.");
            return false;
        }

        processor.cycle();

        // should return the data?
        return true;
    };

    $.processData.options = {
        sort: false,
        sortBy: 'name',
        sortDir: 'ASC'
    };
})( jQuery, window, document );

