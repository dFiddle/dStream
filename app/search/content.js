/*!
* Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
define(['config', 'knockout', 'jquery'], function(config, ko, $) {

    var ctor = function( url ) {
        this.url = url;
        this.remoteContent = ko.observable();
        this.isExpanded = ko.observable(false);
        this.isLoading = ko.observable(true);
    };

    ctor.prototype.activate = function(){
        var self = this;
        if (typeof this.url === 'undefined'){
            return;
        }
        var contentUrl =  config.baseContentUrl + encodeURIComponent(this.url);

        $.getJSON(contentUrl).then(function(data){
            var content = parseHtmlEnteties(data.value.items[0].content);
            self.remoteContent(content);
            self.isExpanded(true);
            self.isLoading(false);
        })
    };

    ctor.prototype.toggle = function(model, element){
        this.isExpanded(!this.isExpanded());
    };

    return ctor;

    function parseHtmlEnteties(str) {
        return str.replace(/&amp;#([0-9]{1,3});/gi, function(match, numStr) {
            var num = parseInt(numStr, 10);
            return String.fromCharCode(num);
        });
    }
});