/*!
 * Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(['config', './feed', './configureFeedModal', './result', 'durandal/system', 'durandal/app', 'plugins/router', 'knockout', 'jquery', 'store'],
    function( config, Feed, configureFeedModal, Result, system, app, router, ko, $, store ) {
        var timeout;
        var runInit = true;
        var defaultFeed = config.defaultFeed;
        var hasStore = store.enabled;

        var results = ko.observableArray([]);
        var showSummary = ko.observable(false);
        var numberOfEntries = ko.observable(15);
        var showMore = ko.observable(true);
        var atomUrls = ko.observableArray([]);
        var feeds = ko.observableArray([]);
        var selectedLi = ko.observable('');

        var getAtomUrlsForYQL = ko.computed(function() {
            var yqlAtomUrls = [];
            $.each(feeds(), function( idx, obj ) {
                yqlAtomUrls.push("'" + obj.url() + "'");
            });

            return yqlAtomUrls.join(', ')
        });
        var getLastUpdated = ko.computed(function() {
            var lastUpdated = null;
            if ( results().length > 0 ) {
                lastUpdated = results()[0].updated;
            }
            return lastUpdated;
        });

        return {
            activate: activate,
            binding: binding,
            bindingComplete: bindingComplete,
            attached: attached,
            compositionComplete: compositionComplete,
            numberOfEntries: numberOfEntries,
            feeds: feeds,
            results: results,
            showSummary: showSummary,
            toggleSummary: toggleSummary,
            markAllAsRead: markAllAsRead,
            showAll: showAll,
            showMore: showMore,
            configureFeeds: configureFeeds,
            getLastUpdated: getLastUpdated
        };
        function activate () {
            var tempFeeds = [];
            system.log('Lifecycle : activate : stream/index');

            if ( runInit ) {
                runInit = false;

                if ( hasStore && store.get('showSummary') !== undefined ) {
                    this.showSummary(store.get('showSummary'));
                }

                if ( hasStore && store.get('feeds') !== undefined && $.isArray(store.get('feeds')) ) {
                    $.each(store.get('feeds'), function( idx, obj ) {
                        tempFeeds.push(new Feed(obj));
                    });

                }
                else {
                    $.each(defaultFeeds, function( idx, obj ) {
                        tempFeeds.push(new Feed(obj));
                    });

                }
                feeds(tempFeeds);
                return getStream();
            }
            return true;
        }

        function binding () {
            system.log('Lifecycle : binding : stream/index');
            return { cacheViews: false }; //cancels view caching for this module, allowing the triggering of the detached callback
        }

        function bindingComplete () {
            system.log('Lifecycle : bindingComplete : stream/index');
        }

        function attached ( view, parent ) {
            system.log('Lifecycle : attached : stream/index');
        }

        function compositionComplete ( view ) {
            system.log('Lifecycle : compositionComplete : stream/index');

            if ( selectedLi() !== '' ) {
                document.getElementById(selectedLi()).scrollIntoView();
            }

            $('.results', view).on('dblclick', 'li', function( element ) {
                if ( getSelectedText() !== '' ) {
                    var vm = ko.dataFor(element.currentTarget);
                    system.log('compositionComplete : stream/index : dblclick', element, vm);

                    if ( vm.id ) {
                        selectedLi(vm.id)
                    }
                    router.navigate('#search/' + encodeURIComponent(getSelectedText()), true);
                }
            })
        }

        function detached ( view ) {
            system.log('Lifecycle : detached : stream/index');
        }

        function configureFeeds () {
            var tempFeeds = [];
            configureFeedModal.show(ko.toJS(feeds)).then(function( response ) {
                if ( response.cancel ) {
                    return;
                }

                $.each(response.getFeedsToStore(), function(idx, obj){
                   tempFeeds.push(new Feed(obj));
                });

                feeds(tempFeeds);

                if ( response.rememberSettings() ) {
                    store.set('feeds', response.getFeedsToStore());
                }

                results([]);
                getStream();
            });
        }

        function toggleSummary () {
            showSummary(!showSummary());
            if (hasStore){
                store.set('showSummary', showSummary());
            }

            $.each(results(), function( idx, obj ) {
                obj.isExpanded(showSummary());
            });
        }

        function markAllAsRead () {
            $.each(results(), function( idx, obj ) {
                obj.isNew(false);
            });
        }

        function showAll () {
            showMore(false);
            $.each(results(), function( idx, obj ) {
                obj.isVisible(true);
            });
        }

        function getStream ( since ) {
            var q = 'select entry from xml where url in (';
            q += getAtomUrlsForYQL();
            q += ')';
            if ( since ) {
                q += ' and entry.updated >"' + since + '"';
            }
            q += '| sort(field="entry.updated", descending="true")';

            var params = {
                q: q,
                format: 'json',
                diagnostics: false
            };

            return $.getJSON(config.yqlPublicUrl, params).then(function( data ) {
                    var jsonResults = data.query.results;
                    var queryResult = [];

                    if ( data.query.count === 0 ) {
                        poll();
                        return;
                    }

                    processResults();

                    // Internal

                    // Todo: Check if there's an YQL CometD JavaScript example
                    // http://www.yqlblog.net/blog/2011/06/14/yql-and-comet-based-streaming/

                    function poll ( delay ) {
                        var lastRecordUpdated = getLastUpdated();
                        delay = delay || config.delay;

                        window.clearTimeout(timeout);
                        timeout = window.setTimeout(function() {
                            getStream(lastRecordUpdated);
                        }, delay);
                    }

                    function processResults () {

                        $(jsonResults.feed).each(function( idx, obj ) {
                            obj = obj.entry;
                            var result = {
                                id: obj.id.replace(/\//g, '_'),
                                author: obj.author.name,
                                updated: obj.updated,
                                title: obj.title.content,
                                summary: obj.summary ? obj.summary.content : obj.content.content,
                                link: obj.link.href,
                                isVisible: idx < numberOfEntries(),
                                isExpanded: showSummary(),
                                atomSource: obj.link.href.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
                            };
                            queryResult.push(new Result(result));
                        });

                        if ( !since ) {
                            results(queryResult);
                        }
                        else {
                            // consider adding en block instead
                            queryResult.reverse();
                            $.each(queryResult, function( idx, obj ) {
                                obj.isNew(true);
                                // remove last item before adding a new one
                                results.pop();
                                results.unshift(obj);
                            });
                        }
                        poll();
                    }
                },
                function( error ) {
                    system.log('Error', 'stream/index:getStream', error);
                });
        }

        function getSelectedText () {
            var txt = '';
            if ( window.getSelection ) {
                txt = window.getSelection();
            }
            else if ( document.getSelection ) {
                txt = document.getSelection();
            }
            else if ( document.selection ) {
                txt = document.selection.createRange().text;
            }
            else {
                return;
            }

            system.log('stream/index : getSelectedText', txt, txt.anchorOffset, txt.focusOffset);
            return txt + '';
        }

    });