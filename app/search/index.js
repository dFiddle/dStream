/*!
 * Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(['config', './solrDS', 'durandal/system', 'plugins/router', 'knockout', 'jquery'],
    function( config,SolrDS, system, router, ko, $ ) {
        var dataContext = new SolrDS();
        var results = dataContext.results;
        var query = dataContext.query;
        var canQuery = ko.computed(function() {
            return query() ? true : false;
        });

        return {
            dataContext: dataContext,
            query: query,
            results: results,
            canQuery: canQuery,
            submitQuery: submitQuery,
            activate: activate
        };

        function activate ( route ) {
            results([]);
            query('');
            if ( route && route !== '' ) {
                query($.trim(route.replace(/^\//, '')));
                dataContext.search()
            }
        }

        function submitQuery () {
            //Update history without triggering router callback
            router.navigate('#search/' + encodeURIComponent(query()));
            dataContext.search()
        }

    });