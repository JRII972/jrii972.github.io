// "use strict";
// Object.defineProperty(exports, "__esModule", {
//     value: true
// });
// exports.localeIncludes = void 0;
var _excluded = ["position", "locales"];

function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for (i = 0; i < sourceSymbolKeys.length; i++) {
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key]
        }
    }
    return target
}

function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key]
    }
    return target
}
export var localeIncludes = function localeIncludes(string, searchString) {
    var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref$position = _ref.position,
        position = _ref$position === void 0 ? 0 : _ref$position,
        locales = _ref.locales,
        options = _objectWithoutProperties(_ref, _excluded);
    if (string === undefined || string === null || searchString === undefined || searchString === null) {
        throw new Error("localeIncludes requires at least 2 parameters")
    }
    var stringLength = string.length;
    var searchStringLength = searchString.length;
    var lengthDiff = stringLength - searchStringLength;
    for (var i = position; i <= lengthDiff; i++) {
        if (string.substring(i, i + searchStringLength).localeCompare(searchString, locales, options) === 0) {
            return true
        }
    }
    return false
};
