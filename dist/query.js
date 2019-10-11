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
var Query = /** @class */ (function () {
    function Query(token) {
        this.token = token;
    }
    Object.defineProperty(Query.prototype, "t", {
        get: function () {
            Query.transactionId++;
            return Query.transactionId.toString(16);
        },
        enumerable: true,
        configurable: true
    });
    Query.prototype.ping = function () {
        return {
            t: this.t,
            y: "q",
            q: "ping",
            a: {
                id: this.token,
            },
        };
    };
    Query.prototype.find_node = function (a) {
        return {
            t: this.t,
            y: "q",
            q: "find_node",
            a: __assign({ id: this.token }, a),
        };
    };
    Query.prototype.get_peers = function (a) {
        return {
            t: this.t,
            y: "q",
            q: "get_peers",
            a: __assign({ id: this.token }, a),
        };
    };
    Query.prototype.announce_peer = function (a) {
        return {
            t: this.t,
            y: "q",
            q: "announce_peer",
            a: __assign({ id: this.token }, a),
        };
    };
    Query.transactionId = 16;
    return Query;
}());
exports.Query = Query;
