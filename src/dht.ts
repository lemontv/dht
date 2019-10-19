import * as crypto from "crypto";
import * as dgram from "dgram";
import { EventEmitter } from "events";
import { Buffer } from "buffer";
import { encode, decode } from "@lemontv/bencode";
import { Query } from "./query";
import { Response } from "./response";
import {
    Response as IResponse,
    Query as IQuery,
    Request,
    Requests,
    RemoteAddressInfo,
    PingQuery,
    FindNodeQuery,
    GetPeersQuery,
    AnnouncePeerResponse,
    PingResponse,
    FindNodeResponse,
    GetPeersResponse,
    AnnouncePeerQuery,
    AnnouncePeerParameters,
    GetPeersParameters,
    FindNodeParameters,
} from "./types";

const BOOTSTRAP_HOST = "router.bittorrent.com";
const BOOTSTRAP_PORT = 6881;

export enum DHT_EVENT {
    PingQuery = "ping_query",
    FindNodeQuery = "find_node_query",
    GetPeersQuery = "get_peers_query",
    AnnouncePeerQuery = "announce_peer_query",
    PingResponse = "ping_response",
    FindNodeResponse = "find_node_response",
    GetPeersResponse = "get_peers_response",
    AnnouncePeerResponse = "announce_peer_response",
    Error = "error",
}

export class DHT {
    public dhtEmitter: EventEmitter;

    private TOKEN: Buffer;
    private server: dgram.Socket;
    private query: Query;
    private response: Response;
    private requests: Requests = {};

    constructor() {
        this.TOKEN = this.genToken();
        this.server = this.createServer();
        this.query = new Query(this.token);
        this.response = new Response(this.token);
        this.dhtEmitter = new EventEmitter();

        this.server.on("message", this.handleMessage);

        /**
         * Listen on all query & response event
         */
        this.dhtEmitter.on(DHT_EVENT.PingQuery, this.handlePingQuery);
        this.dhtEmitter.on(DHT_EVENT.PingResponse, this.handlePingResponse);

        this.dhtEmitter.on(DHT_EVENT.FindNodeQuery, this.handleFindNodeQuery);
        this.dhtEmitter.on(
            DHT_EVENT.FindNodeResponse,
            this.handleFindNodeResponse
        );

        this.dhtEmitter.on(DHT_EVENT.GetPeersQuery, this.handleGetPeersQuery);
        this.dhtEmitter.on(
            DHT_EVENT.GetPeersResponse,
            this.handleGetPeersResponse
        );

        this.dhtEmitter.on(
            DHT_EVENT.AnnouncePeerQuery,
            this.handleAnnouncePeerQuery
        );
        this.dhtEmitter.on(
            DHT_EVENT.AnnouncePeerResponse,
            this.handleAnnouncePeerResponse
        );

        this.dhtEmitter.on(DHT_EVENT.Error, this.handleError);
    }

    public get token() {
        return this.TOKEN.toString("ascii");
    }

    public bootstrap() {
        const { token } = this;

        /**
         * Bootstrap with find self token
         */
        this.pingRequest(BOOTSTRAP_PORT, BOOTSTRAP_HOST);
        this.findNodeRequest(BOOTSTRAP_PORT, BOOTSTRAP_HOST, { target: token });
    }

    public pingRequest(port: number, host: string) {
        const { server, query, requests } = this;
        const ping = query.ping();
        server.send(Buffer.from(encode(ping)), port, host);
        requests[ping.t] = { query: ping, host, port };
    }

    public findNodeRequest(
        port: number,
        host: string,
        payload: FindNodeParameters
    ) {
        const { server, query, requests } = this;
        const findNode = query.find_node(payload);
        server.send(Buffer.from(encode(findNode)), port, host);
        requests[findNode.t] = { query: findNode, host, port };
    }

    public getPeersRequest(
        port: number,
        host: string,
        payload: GetPeersParameters
    ) {
        const { server, query, requests } = this;
        const getPeers = query.get_peers(payload);
        server.send(Buffer.from(encode(getPeers)), port, host);
        requests[getPeers.t] = { query: getPeers, host, port };
    }

    public announcePeerRequest(
        port: number,
        host: string,
        payload: AnnouncePeerParameters
    ) {
        const { server, query, requests } = this;
        const announcePeer = query.announce_peer(payload);
        server.send(Buffer.from(encode(announcePeer)), port, host);
        requests[announcePeer.t] = { query: announcePeer, host, port };
    }

    private createServer(): dgram.Socket {
        return dgram.createSocket("udp4");
    }

    private genToken(): Buffer {
        const buf = crypto.randomBytes(2048);
        const sha1 = crypto.createHash("sha1");
        sha1.update(buf);
        return sha1.digest();
    }

    private handleMessage(msg: Buffer, rinfo: RemoteAddressInfo) {
        const message = decode(msg) as (IResponse | IQuery);

        switch (message.y) {
            case "r":
                return this.handleResponse(message);
            case "q":
                return this.handleQuery(message, rinfo);
            default:
                return this.dhtEmitter.emit(
                    DHT_EVENT.Error,
                    new Error("Message type unknown")
                );
        }
    }

    private handleError(e: Error) {
        // tslint:disable-next-line: no-console
        console.error(e.message);
    }

    private handleQuery(query: IQuery, rinfo: RemoteAddressInfo) {
        const { dhtEmitter } = this;
        let event = DHT_EVENT.Error;

        switch (query.q) {
            case "ping":
                event = DHT_EVENT.PingQuery;
                break;
            case "find_node":
                event = DHT_EVENT.FindNodeQuery;
                break;
            case "get_peers":
                event = DHT_EVENT.GetPeersQuery;
                break;
            case "announce_peer":
                event = DHT_EVENT.AnnouncePeerQuery;
                break;
            default:
                event = DHT_EVENT.Error;
                break;
        }

        dhtEmitter.emit(event, query, rinfo);
    }

    private handleResponse(response: IResponse) {
        const { dhtEmitter, requests } = this;
        const request = requests[response.t];
        let event = DHT_EVENT.Error;

        if (request.query) {
            delete requests[response.t];

            switch (request.query.q) {
                case "ping":
                    event = DHT_EVENT.PingResponse;
                    break;
                case "find_node":
                    event = DHT_EVENT.FindNodeResponse;
                    break;
                case "get_peers":
                    event = DHT_EVENT.GetPeersResponse;
                    break;
                case "announce_peer":
                    event = DHT_EVENT.AnnouncePeerResponse;
                    break;
                default:
                    event = DHT_EVENT.Error;
                    break;
            }
        }

        dhtEmitter.emit(event, response, request);
    }

    private handlePingQuery(query: PingQuery, rinfo: RemoteAddressInfo) {}
    private handlePingResponse(response: PingResponse, request: Request) {}

    private handleFindNodeQuery(
        query: FindNodeQuery,
        rinfo: RemoteAddressInfo
    ) {}
    private handleFindNodeResponse(
        response: FindNodeResponse,
        request: Request
    ) {}

    private handleGetPeersQuery(
        query: GetPeersQuery,
        rinfo: RemoteAddressInfo
    ) {}
    private handleGetPeersResponse(
        response: GetPeersResponse,
        request: Request
    ) {}

    private handleAnnouncePeerQuery(
        query: AnnouncePeerQuery,
        rinfo: RemoteAddressInfo
    ) {}
    private handleAnnouncePeerResponse(
        response: AnnouncePeerResponse,
        request: Request
    ) {}
}
