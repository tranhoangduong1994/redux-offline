"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NetworkError = NetworkError;
exports.default = exports.getHeaders = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _objectWithoutProperties2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutProperties"));

/* global fetch */
function NetworkError(response, status) {
  this.name = 'NetworkError';
  this.status = status;
  this.response = response;
} // $FlowFixMe


NetworkError.prototype = Error.prototype;

var tryParseJSON = function tryParseJSON(json) {
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error("Failed to parse unexpected JSON response: ".concat(json));
  }
};

var getResponseBody = function getResponseBody(res) {
  var contentType = res.headers.get('content-type') || false;

  if (contentType && contentType.indexOf('json') >= 0) {
    return res.text().then(tryParseJSON);
  }

  return res.text();
};

var getHeaders = function getHeaders(headers) {
  var _ref = headers || {},
      contentTypeCapitalized = _ref['Content-Type'],
      contentTypeLowerCase = _ref['content-type'],
      restOfHeaders = (0, _objectWithoutProperties2.default)(_ref, ["Content-Type", "content-type"]);

  var contentType = contentTypeCapitalized || contentTypeLowerCase || 'application/json';
  return (0, _objectSpread2.default)({}, restOfHeaders, {
    'content-type': contentType
  });
}; // eslint-disable-next-line no-unused-vars


exports.getHeaders = getHeaders;

var _default = function _default(effect, _action) {
  var url = effect.url,
      json = effect.json,
      options = (0, _objectWithoutProperties2.default)(effect, ["url", "json"]);
  var headers = getHeaders(options.headers);

  if (json !== null && json !== undefined) {
    try {
      options.body = JSON.stringify(json);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  return fetch(url, (0, _objectSpread2.default)({}, options, {
    headers: headers
  })).then(function (res) {
    if (res.ok) {
      return getResponseBody(res);
    }

    return getResponseBody(res).then(function (body) {
      throw new NetworkError(body || '', res.status);
    });
  });
};

exports.default = _default;