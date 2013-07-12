/*!
* Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
define(['durandal/activator', 'knockout'],function(activator, ko) {
    var ctor = function( options ) {
        var self = this;
        this.isVisible = ko.observable(false);
        this.isExpanded = ko.observable(false);
        this.isNew = ko.observable(false);

        $.each(options, function( prop, val ) {
            if (ko.isObservable(self[prop])){
                self[prop](val);
                return;
            }
            self[prop] = val || '';
        });
    };

    ctor.prototype.toggle = function(){
        this.isExpanded(!this.isExpanded());
    };

    ctor.prototype.binding  = function(){
        if (this.atomSource[1] === 'github.com'){
           var fixRelLinks = this.summary.replace( /href="\//g, 'href="https://github.com/');
           this.summary = fixRelLinks;
        }
    };

    ctor.prototype.markAsRead = function(){
        this.isNew(false);
    };

    return ctor;

});