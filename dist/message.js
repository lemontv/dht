"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bencode_1 = require("@lemontv/bencode");
exports.handleMessage = function (server, msg, rinfo) {
    var message = bencode_1.decode(msg);
    if (message.y === "r") {
        exports.handleResponse(server, message);
    }
    if (message.y === "q") {
        exports.handleQuery(server, message, rinfo);
    }
};
exports.handleQuery = function (server, response, rinfo) { };
exports.handleResponse = function (server, response) { };
