import { BaseParameters, PingQuery, FindNodeParameters, FindNodeQuery, GetPeersParameters, GetPeersQuery, AnnouncePeerParameters, AnnouncePeerQuery } from "./types";
export declare class Query {
    static transactionId: number;
    private token;
    constructor(token: string);
    readonly t: string;
    ping(): PingQuery;
    find_node(a: Omit<FindNodeParameters, keyof BaseParameters>): FindNodeQuery;
    get_peers(a: Omit<GetPeersParameters, keyof BaseParameters>): GetPeersQuery;
    announce_peer(a: Omit<AnnouncePeerParameters, keyof BaseParameters>): AnnouncePeerQuery;
}
