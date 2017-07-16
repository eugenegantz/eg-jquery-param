/*!
 * jQuery JavaScript Library v3.2.1
 * https://jquery.com/
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2017-03-20T18:59Z
 */

var rbracket = /\[\]$/;

function buildParams(prefix, obj, traditional, add) {
    var name;

    if (Array.isArray(obj)) {

        // Serialize array item.
        obj.forEach(function(v, i) {
            if (traditional || rbracket.test(prefix)) {

                // Treat each array item as a scalar.
                add(prefix, v);

            } else {

                // Item is non-scalar (array or object), encode its numeric index.
                buildParams(
                    prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
                    v,
                    traditional,
                    add
                );
            }
        });

    } else if (!traditional && String(obj) === "[object Object]") {

        // Serialize object item.
        for (name in obj) {
            buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
        }

    } else {

        // Serialize scalar item.
        add(prefix, obj);
    }
}

// Serialize an array of form elements or a set of
// key/values into a query string
module.exports = function(a, traditional) {
    var prefix,
        s = [],
        add = function(key, valueOrFunction) {

            // If value is a function, invoke it and use its return value
            var value = typeof valueOrFunction == 'function' ?
                valueOrFunction() :
                valueOrFunction;

            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value == null ? "" : value);
        };

    // If an array was passed in, assume that it is an array of form elements.
    if (Array.isArray(a) || (a.jquery && String(a) != "[object Object]")) {

        // Serialize the form elements
        a.forEach(function(row) {
            add(row.name, row.value);
        });

    } else {

        // If traditional, encode the "old" way (the way 1.3.2 or older
        // did it), otherwise encode params recursively.
        for (prefix in a) {
            buildParams(prefix, a[prefix], traditional, add);
        }
    }

    // Return the resulting serialization
    return s.join("&");
};