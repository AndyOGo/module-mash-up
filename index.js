var mashupModuleDependencies = require('./lib/moduleMashUp');
var hashToLiteral = require('./lib/hashToLiteral');

module.exports = {
    mashMultiple: mashMultiple,
    mash: mashupModuleConfig
};

function mashMultiple(configs) {
    var configKeys = Object.keys(configs);
    var i= 0, l=configKeys.length;
    var name;
    var config;
    var moduleMashes = {};

    for(; i<l; i++) {
        name = configKeys[i];
        config = configs[name];

        moduleMashes[name] = mashupModuleConfig(config, name);
    }

    return moduleMashes;
}

function mashupModuleConfig(config, name) {
    if(!config.moduleDependencies)
        return;

    var moduleDependencies = config.moduleDependencies;
    var moduleDependency;
    var moduleDependenciesKeys = Object.keys(moduleDependencies);
    var i= 0, l=moduleDependenciesKeys.length;
    var module;
    var dependencyHash;
    var dependencyLiteral;

    // loop through all modules
    for(; i<l; i++) {
        module = moduleDependenciesKeys[i];

        moduleDependency = moduleDependencies[module];

        dependencyHash = mashupModuleDependencies(module, moduleDependency, config);

        dependencyLiteral = hashToLiteral(dependencyHash);
    }

    return dependencyLiteral;
}



