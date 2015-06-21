/**
 * Returns the HTML-Element with the given ID
 *
 * @param name
 * @param type
 * @returns {NodeList, HTMLElement}
 */
function get(name, type) {
    if (typeof type === 'undefined') {
        type = "id";
    }
    switch (type) {
        case "tag":
            return document.getElementsByTagName(name);
            break;

        case "class":
            return document.getElementsByClassName(name);
            break;

        case "id":
            return document.getElementById(name);
            break;
    }
}


/**
 * Create the <i>clone</i> function in the Object prototype
 *
 * @returns {Array}
 */
Object.prototype.clone = function() {
    var newObj = (this instanceof Array) ? [] : {};
    for (var i in this) {
        if (i == 'clone') continue;
        if (this[i] && typeof this[i] == "object") {
            newObj[i] = this[i].clone();
        } else newObj[i] = this[i]
    } return newObj;
};