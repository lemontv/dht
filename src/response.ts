import {
    BaseBody,
    PingResponse,
    FindNodeBody,
    FindNodeResponse,
    GetPeersNodesBody,
    GetPeersValuesBody,
    GetPeersResponse,
    AnnouncePeerResponse,
} from "./types";

export class Response {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    public ping(t: string): PingResponse {
        return {
            t,
            y: "r",
            r: {
                id: this.token,
            },
        };
    }

    public find_node(
        t: string,
        body: Omit<FindNodeBody, keyof BaseBody>
    ): FindNodeResponse {
        return {
            t,
            y: "r",
            r: {
                id: this.token,
                ...body,
            },
        };
    }

    public get_peers(
        t: string,
        body:
            | Omit<GetPeersNodesBody, keyof BaseBody>
            | Omit<GetPeersValuesBody, keyof BaseBody>
    ): GetPeersResponse {
        return {
            t,
            y: "r",
            r: {
                id: this.token,
                ...body,
            },
        };
    }

    public announce_peer(t: string): AnnouncePeerResponse {
        return {
            t,
            y: "r",
            r: {
                id: this.token,
            },
        };
    }
}
