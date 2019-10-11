import { BaseBody, PingResponse, FindNodeBody, FindNodeResponse, GetPeersNodesBody, GetPeersValuesBody, GetPeersResponse, AnnouncePeerResponse } from "./types";
export declare class Response {
    private token;
    constructor(token: string);
    ping(t: string): PingResponse;
    find_node(t: string, body: Omit<FindNodeBody, keyof BaseBody>): FindNodeResponse;
    get_peers(t: string, body: Omit<GetPeersNodesBody, keyof BaseBody> | Omit<GetPeersValuesBody, keyof BaseBody>): GetPeersResponse;
    announce_peer(t: string): AnnouncePeerResponse;
}
