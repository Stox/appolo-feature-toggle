var FeatureToggleManager = require('./lib/featureToggleManager');

module.exports = function (options) {



    return function (env, logger, inject, callback) {

        var featureToggleManager = new FeatureToggleManager(options);

        if (options.url) {

            featureToggleManager.setFeaturesByUrl(options.url)
                .then(onFeaturesLoadSuccess)
                .fail(onFeaturesLoadFail)

        } else if (options.path) {

            featureToggleManager.setFeaturesByFile(options.path)
                .then(onFeaturesLoadSuccess)
                .fail(onFeaturesLoadFail)

        } else if (options.features) {

            featureToggleManager.setFeatures(options.features);

            onFeaturesLoadSuccess()
        }

        function onFeaturesLoadSuccess(){

            logger.info("feature toggles loaded");

            inject.addObject('featureToggleManager',featureToggleManager);

            callback();
        }

        function onFeaturesLoadFail(err){

            logger.error("feature toggles loaded",{err:err.stack||err.toString()});

            callback();
        }


    }

}