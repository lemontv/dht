"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Response = /** @class */ (function () {
    function Response(token) {
        this.token = token;
    }
    Response.prototype.ping = function (t) {
        return {
            t: t,
            y: "r",
            r: {
                id: this.token,
            },
        };
    };
    Response.prototype.find_node = function (t, body) {
        return {
            t: t,
            y: "r",
            r: __assign({ id: this.token }, body),
        };
    };
    Response.prototype.get_peers = function (t, body) {
        return {
            t: t,
            y: "r",
            r: __assign({ id: this.token }, body),
        };
    };
    Response.prototype.announce_peer = function (t) {
        return {
            t: t,
            y: "r",
            r: {
                id: this.token,
            },
        };
    };
    return Response;
}());
exports.Response = Response;
