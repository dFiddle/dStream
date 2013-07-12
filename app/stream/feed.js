/*!
 * Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
 */
define(['knockout'], function( ko ) {

    var iconMap = {
        '_path': 'css/images/',
        'default': 'default.ico',
        'github.com': 'github.com.ico',
        'groups.google.com': 'groups.google.com.ico',
        'stackoverflow.com': 'stackoverflow.com.ico'
    };

    var Feed = function( options ) {
        options = (options || {});
        this.title = ko.observable(options.title || '');
        this.url = ko.observable(options.url || '');

        this.ico = function(){
            var hostName = 'default';
            if (this.url() !== ''){
                hostName = this.url().match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)[1];
            }
            return (iconMap['_path'] + iconMap[hostName]) || '';
        };
    };

    return Feed;
});