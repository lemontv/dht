import * as crypto from "crypto";
import * as dgram from "dgram";
import { Buffer } from "buffer";
import { encode, decode } from "@lemontv/bencode";
import { Query } from "./query";
import { Response } from "./response";

const BOOTSTRAP_HOST = "router.bittorrent.com";
const BOOTSTRAP_PORT = 6881;

const buf = crypto.randomBytes(2048);
const sha1 = crypto.createHash("sha1");
sha1.update(buf);
const token = sha1.digest().toString("ascii");

const query = new Query(token);
const server = dgram.createSocket("udp4");

server.on("message", (message) => {
    console.log(decode(message));
});

const ping = Buffer.from(encode(query.ping()));
server.send(ping, BOOTSTRAP_PORT, BOOTSTRAP_HOST);
