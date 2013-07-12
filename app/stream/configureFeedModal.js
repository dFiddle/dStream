/*!
 * Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(['./feed','plugins/dialog', 'plugins/serializer', 'knockout', 'store'], function( Feed, dialog, serializer, ko, store ) {


    var CustomModal = function(options) {
        this.options = options;
        this.hasStore = store.enabled;
        this.feeds = ko.observableArray([]);
        this.rememberSettings = ko.observable(false);
        this.cancel = false;
        this.getFeedsToStore = ko.computed(function(){
            var feeds = [];
            $.each(this.feeds(), function(idx, obj){
               feeds.push({title: obj.title(), url: obj.url()});
            });
            return feeds;
        }, this);
    };

    CustomModal.show = function(options) {
        return dialog.show(new CustomModal(options));
    };

    CustomModal.prototype.removeFeed = function(feed) {
            this.feeds.remove(feed);
        };

    CustomModal.prototype.addFeed = function() {
           this.feeds.push(new Feed());
        };


    CustomModal.prototype.ok = function() {
        dialog.close(this, this);
    };

    CustomModal.prototype.close = function() {
        this.cancel = true;
        dialog.close(this, {cancel: this.cancel});
    };

    CustomModal.prototype.activate = function() {
        var tempFeeds = [];
        $.each(this.options, function(idx, obj){
            tempFeeds.push(new Feed(obj));
        });
        this.feeds(tempFeeds);


    };

    CustomModal.prototype.canDeactivate = function() {
        if ( this.cancel ) {
            return true;
        }
        return dialog.showMessage(
          'Be warned, system blows up if not :)',
          'Are you sure that\'s this is a valid Atom feed?',
          ['Yes', 'No']);
    };


    return CustomModal;
});