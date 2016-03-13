module.exports = mashupModuleDependencies;

function mashupModuleDependencies(module, moduleDependency, config) {
    var i= 0, l=moduleDependency.length;
    var preprocess = config.preprocess;
    var dependency;
    var condition;
    var conditionOK = false;
    var value;
    var dependencyHash = {};

    var stack = [];
    var stackLength = stack.length;
    var plate;

    for(; i<l; i++) {
        dependency = moduleDependency[i];

        if(Array.isArray(dependency)) {
            stack.push({
                i: i,
                l: l,
                moduleDependency: moduleDependency
            });
            ++stackLength;

            moduleDependency = dependency;
            i=-1;
            l=dependency.length;

            continue;
        }
        else if(typeof dependency === 'object') {
            condition = dependency.condition;
            conditionOK = checkCondition(condition, preprocess);

            if(conditionOK) {
                value = dependency.value;

                if(typeof value === 'string') {
                    dependencyHash[value] = true;
                }

                else if(Array.isArray(value)) {
                    stack.push({
                        i: i,
                        l: l,
                        moduleDependency: moduleDependency
                    });
                    ++stackLength;

                    moduleDependency = value;
                    i=-1;
                    l=value.length;

                    continue;
                }
            }
        }
        else if(typeof dependency === 'string') {
            dependencyHash[dependency] = true;
        }

        // make sure to pop stack back if end of current stack
        while(i === l-1 && stackLength) {
            plate = stack.pop();
            --stackLength;

            moduleDependency = plate.moduleDependency;
            i = plate.i;
            l = plate.l;
        }
    }

    return dependencyHash;
}

function checkCondition(condition, preprocess) {
    var isConditionOK = false;
    var i, l;

    if(Array.isArray(condition)) {
        for(i=0, l=condition.length; i<l; i++) {
            if((isConditionOK = checkSingleCondition(condition[i], preprocess))) {
                break;
            }
        }
    }
    else if(typeof condition === 'string') {
        isConditionOK = checkSingleCondition(condition, preprocess);
    }

    return isConditionOK;
}

function checkSingleCondition(propertyPath, config) {
    var properties = propertyPath.split('.');
    var property;
    var i= 0, l=properties.length;
    var checkConfig = config;

    for(; i<l; i++) {
        property = properties[i];

        if(!(property in checkConfig) || checkConfig[property] === false) {
            return false;
        }

        checkConfig = checkConfig[property];
    }

    return true;
}