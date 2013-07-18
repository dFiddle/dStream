/*!
 * Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(['config', './result', 'durandal/system', 'plugins/router', 'knockout', 'jquery'],
  function( config, Result, system, router, ko, $ ) {
      var query = ko.observable('');
      var results = ko.observableArray([]);
      var canQuery = ko.computed(function() {
          return query() ? true : false;
      });
      var resultCount = ko.observable();

      return {
          query: query,
          results: results,
          canQuery: canQuery,
          submitQuery: submitQuery,
          search: search,
          activate: activate,
          resultCount: resultCount
      };

      function activate (route) {
          results([]);
          query('');
          if (route && route !== ''){
              query($.trim(route.replace(/^\//,'')));
              search();
          }
      }

      function submitQuery(){
          //Update history without triggering router callback
          router.navigate('#search/' + encodeURIComponent(query()));
          search();
      }

      function search () {
          var q = 'use "store://BvKtmwzyIxAgXKcswjsUG2" as dsearch;';
          q += ' SELECT * FROM dsearch WHERE q="' + encodeURIComponent(query()) + '"';
          var params = {
              q: q,
              format: 'json'
          };

          $.getJSON(config.yqlPublicUrl, params).then(function( data ) {
                if (data.query.count === 0){
                    return;
                }

                var solr = data.query.results.json;
                var queryResult = [];
                resultCount(parseInt(solr.response.numFound, 10));

                $(solr.response.docs).each(function( idx, obj ) {
                    var encId = obj.id.replace(/\//g, '_');
                    var result = {
                        title: solr.highlighting[encId].title || obj.title,
                        content: solr.highlighting[encId].body,
                        url: obj.id
                    };
                    queryResult.push(new Result(result));
                });

                results(queryResult);

            },
            function( error ) {
                system.log('Error', 'search/index:search', error);
            });
      }

  });