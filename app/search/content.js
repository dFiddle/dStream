/*!
* Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
define(['knockout', 'jquery'], function(ko, $) {
    var baseContentUrl = 'http://pipes.yahoo.com/pipes/pipe.run';
    baseContentUrl += '?_id=b661dd58aed9c23ade7bae0d7bc148cd&_render=json';
    baseContentUrl +='&xpath=%2F%2Fsection%5Bcontains%28%40class%2C+%27content%27%29%5D&url=';

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
        var contentUrl = baseContentUrl + encodeURIComponent(this.url);

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