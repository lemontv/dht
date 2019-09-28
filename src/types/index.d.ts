type y = "q";
type q = "ping" | "find_node" | "get_peers" | "announce_peer";
declare enum impliedPort {
    Enabled = 0,
    Disabled = 1,
}

interface BaseParameters {
    id: string;
}
export interface PingParameters extends BaseParameters {}
export interface FindNodeParameters extends BaseParameters {
    target: string;
}
export interface GetPeersParameters extends BaseParameters {
    info_hash: string;
}
export interface AnnouncePeerParameters extends BaseParameters {
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

interface BaseBody {
    id: string;
}
export interface PingBody extends BaseBody {}
export interface FindNodeBody extends BaseBody {
    nodes: string;
}
export interface GetPeersNodesBody extends BaseBody {
    token: string;
    nodes: string;
}
export interface GetPeersValuesBody extends BaseBody {
    token: string;
    values: string[];
}
export type GetPeersBody = GetPeersValuesBody | GetPeersNodesBody;
export interface AnnouncePeerBody extends BaseBody {}
type ResponseBody = BaseBody | FindNodeBody | GetPeersBody | AnnouncePeerBody;

interface Response {
    t: string;
    y: "r";
    r: ResponseBody;
}
export interface PingResponse extends Response {
    r: PingBody;
}
export interface FindNodeResponse extends Response {
    r: FindNodeBody;
}
export interface GetPeersResponse extends Response {
    r: GetPeersBody;
}
export interface AnnouncePeerResponse extends Response {
    r: AnnouncePeerBody;
}
