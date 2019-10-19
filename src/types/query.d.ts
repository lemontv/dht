type y = "q";
type q = "ping" | "find_node" | "get_peers" | "announce_peer";
declare enum impliedPort {
    Enabled = 0,
    Disabled = 1,
}

export interface PingParameters {}
export interface FindNodeParameters {
    target: string;
}
export interface GetPeersParameters {
    info_hash: string;
}
export interface AnnouncePeerParameters {
    implied_port: impliedPort;
    info_hash: string;
    port: number;
    token: string;
}
type QueryParameters =
    | PingParameters
    | FindNodeParameters
    | GetPeersParameters
    | AnnouncePeerParameters;

interface Query {
    t: string;
    y: "q";
    q: q;
    a: QueryParameters;
}
export interface PingQuery extends Query {
    q: "ping";
    a: PingParameters;
}
export interface FindNodeQuery extends Query {
    q: "find_node";
    a: FindNodeParameters;
}
export interface GetPeersQuery extends Query {
    q: "get_peers";
    a: GetPeersParameters;
}
export interface AnnouncePeerQuery extends Query {
    q: "announce_peer";
    a: AnnouncePeerParameters;
}
