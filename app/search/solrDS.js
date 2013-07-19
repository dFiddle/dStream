/*!
 * Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(['config', './result', 'durandal/system', 'knockout', 'jquery'],
    function( config, Result, system, ko, $ ) {

        var ctor = function(){
            this.results = ko.observableArray([]);
            this.isFetching = ko.observable(true);
            this.numFound =  ko.observable(0);
            this.query = ko.observable();
            this.start = ko.observable(0);
            this.rows = ko.observable(10);
            this.from = ko.computed(function(){
                return this.start() +1;
            }, this);

            this.to = ko.computed(function(){
                return Math.min(this.start() + this.rows(), this.numFound()) ;
            }, this);

            this.hasNext = ko.computed(function() {
                return ((this.start() + this.rows()) < this.numFound());
            }, this);

            this.hasPrevious = ko.computed(function() {
                return ((this.start() - this.rows()) >= 0);
            }, this);

           this.next = function() {
                if (this.hasNext()){
                    this.start ( (this.start() + this.rows()) );
                    this.search(this.query());
                }
           };

            this.previous = function() {
                if (this.hasPrevious() ){
                    this.start( ( this.start() - this.rows()) );
                    this.search(this.query());
                }
            };
        };

        ctor.prototype.init = function(options){

        };

        ctor.prototype.search = search;

        return ctor;


        function search ( ) {
            var self = this;
            var q = 'use "store://BvKtmwzyIxAgXKcswjsUG2" as dsearch;';
            q += ' SELECT * FROM dsearch WHERE q="' + encodeURIComponent(this.query()) + '"';
            //paging support
            if ( this.start() !== 0 ) {
                q += ' and start=' + this.start();
            }
            var params = {
                q: q,
                format: 'json'
            };
            this.isFetching(true);

            $.getJSON(config.yqlPublicUrl, params).then(function( data ) {
                    if ( data.query.count === 0 ) {
                        return;
                    }

                    var solr = data.query.results.json;
                    var queryResult = [];

                    self.numFound(parseInt(solr.response.numFound, 10));
                    self.start(parseInt(solr.response.start, 10));
                    self.rows(parseInt(solr.response.rows, 10) || 10);

                    $(solr.response.docs).each(function( idx, obj ) {
                        var encId = obj.id.replace(/\//g, '_');
                        var result = {
                            title: solr.highlighting[encId].title || obj.title,
                            content: solr.highlighting[encId].body,
                            url: obj.id
                        };
                        queryResult.push(new Result(result));
                    });

                    self.results(queryResult);
                },
                function( error ) {
                    system.log('Error', 'search/index:search', error);
                })
                .always(function() {
                    self.isFetching(false);
                });
        }

    });