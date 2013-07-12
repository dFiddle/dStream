/*!
* Copyright 2013 (C) Spirit-EDV-Beratung AG. All rights reserved.
*/
define(['./content','knockout'],function(Content, ko) {
    var ctor = function( options ) {
        var self = this;
        this.options = ( options || {} );
        this.contentModel = ko.observable();

        $.each(['title', 'description', 'content', 'url'], function( idx, prop ) {
            self[prop] = self.options[prop] || '';
        });
    };

    ctor.prototype.showDetail = function(model, element){
        var self = this;
        if (!self.contentModel()){
            self.contentModel(new Content(model.url));
        }
        else{
            self.contentModel().toggle();
        }
    };

    return ctor;
});