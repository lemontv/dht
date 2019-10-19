"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var Bucket = /** @class */ (function () {
    function Bucket(leftBound, rightBound, k, contacts) {
        if (k === void 0) { k = 20; }
        if (contacts === void 0) { contacts = []; }
        this.canSplit = true;
        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.k = k;
        this.contacts = __spreadArrays(contacts);
    }
    Bucket.prototype.compare = function (token) {
        if (buffer_1.Buffer.compare(token, this.leftBound) < 0) {
            return -1;
        }
        if (buffer_1.Buffer.compare(token, this.rightBound) >= 0) {
            return 1;
        }
        return 0;
    };
    Bucket.prototype.match = function (token) {
        return (buffer_1.Buffer.compare(token, this.leftBound) >= 0 &&
            buffer_1.Buffer.compare(this.rightBound, token) > 0);
    };
    Bucket.prototype.store = function (token) {
        if (this.contacts.length < this.k && this.match(token)) {
            this.contacts.push(token);
            return true;
        }
        else {
            return false;
        }
    };
    Bucket.prototype.split = function (token) {
        if (!this.canSplit ||
            buffer_1.Buffer.compare(this.leftBound, this.rightBound) >= 0) {
            throw new Error("Can not split this bucket");
        }
        var midBound = mid(this.leftBound, this.rightBound);
        var bucket = new Bucket(midBound, this.rightBound);
        if (bucket.match(token)) {
            this.canSplit = false;
        }
        else {
            bucket.canSplit = false;
        }
        this.rightBound = midBound;
        this.contacts = this.contacts.filter(function (contact) { return !bucket.store(contact); });
        return bucket;
    };
    return Bucket;
}());
exports.Bucket = Bucket;
function mid(leftBound, rightBound) {
    if (leftBound.length !== rightBound.length) {
        throw new Error("Not the same length of two buffer");
    }
    if (buffer_1.Buffer.compare(leftBound, rightBound) === 0) {
        return leftBound;
    }
    var length = leftBound.length;
    var midBound = buffer_1.Buffer.alloc(length);
    var carry = 0;
    for (var i = length; i >= 0; i--) {
        var sum = leftBound[i] + rightBound[i] + carry;
        midBound[i] = sum;
        carry = sum > 0xff ? 1 : 0;
    }
    for (var i = 0; i < length; i++) {
        var b = (midBound[i] & 0x01) > 0 ? 1 : 0;
        midBound[i] = (midBound[i] >> 1) | (carry << 7);
        carry = b;
    }
    for (var i = length; i >= 0; i--) {
        var sum = midBound[i] + 1;
        midBound[i] = sum;
        if (sum <= 0xff) {
            break;
        }
    }
    return midBound;
}
exports.mid = mid;
