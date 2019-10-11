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
