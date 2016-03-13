module.exports = hashToLiteral;

function hashToLiteral(hash) {
    var keys = Object.keys(hash);
    var key;
    var i=0, l=keys.length;
    var properties;
    var property;
    var j, k;
    var literal = {};
    var tmpLiteral;

    for(; i<l; i++) {
        key = keys[i];

        properties = key.split('.');
        tmpLiteral = literal;

        for(j=0, k=properties.length; j<k; j++) {
            property = properties[j];

            if(j === k-1) {
                tmpLiteral[property] = hash[key];
            }
            else {
                if(!(property in tmpLiteral))
                    tmpLiteral[property] = {};

                tmpLiteral = tmpLiteral[property];
            }
        }
    }

    console.log(literal);

    return literal;
}