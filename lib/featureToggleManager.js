var Class = require('appolo-class'),
    _ = require('lodash'),
    Q = require('q'),
    fs = require('fs'),
    request = require('request');

module.exports = Class.define({

    constructor: function (options) {

        var _defaults = {

        }

        this._options =_.defaults(options,_defaults);

        this._features = {};

        this._activeFeatures = [];
    },


    isActive: function (key) {

        var feature = this._features[key];

        return feature && feature.isActive ? true : false;
    },

    setFeatures:function(data){
        this._features = _.indexBy(data,'name');

        this._activeFeatures = _.filter(data, 'isActive');

    },

    setActive:function(name,isActive){

        var feature = this._features[name];

        if(feature){
            feature.isActive = isActive;
        }
    },

    setFeature:function(feature){

        this._features[feature.name] = feature;
    },

    getFeature:function(name){

        return this._features[name];
    },

    isExist:function(name){
        return !!this._features[name];
    },

    setFeaturesByFile: function (path) {
        var deferred = Q.defer();

        fs.readFile(path, function (err, data) {
            if (err) {
                deferred.reject(new Error("failed to load remote features file " + path));
            } else {

                var data = JSON.parse(data);

                this.setFeatures(data);

                deferred.resolve();
            }
        }.bind(this));

        return deferred.promise;
    },

    setFeaturesByUrl: function (url) {

        var deferred = Q.defer();

        request({
            url: url,
            json: true

        }, function (err, response, body) {
            if (err || response.statusCode != 200 || !body) {
                deferred.reject(new Error("failed to load remote features url" + url));
            } else {

                this.setFeatures(body);

                deferred.resolve();
            }
        }.bind(this));

        return deferred.promise;
    },
    getActiveFeatures:function(){
        return  this._activeFeatures;
    }
});