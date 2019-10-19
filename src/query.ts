import {
    BaseParameters,
    PingQuery,
    FindNodeParameters,
    FindNodeQuery,
    GetPeersParameters,
    GetPeersQuery,
    AnnouncePeerParameters,
    AnnouncePeerQuery,
} from "./types";

export class Query {
    public static transactionId: number = 16;
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    get t(): string {
        Query.transactionId++;
        return Query.transactionId.toString(16);
    }

    public ping(): PingQuery {
        return {
            t: this.t,
            y: "q",
            q: "ping",
            a: {
                id: this.token,
            },
        };
    }

    public find_node(a: FindNodeParameters): FindNodeQuery {
        return {
            t: this.t,
            y: "q",
            q: "find_node",
            a: {
                id: this.token,
                ...a,
            },
        };
    }

    public get_peers(a: GetPeersParameters): GetPeersQuery {
        return {
            t: this.t,
            y: "q",
            q: "get_peers",
            a: {
                id: this.token,
                ...a,
            },
        };
    }

    public announce_peer(a: AnnouncePeerParameters): AnnouncePeerQuery {
        return {
            t: this.t,
            y: "q",
            q: "announce_peer",
            a: {
                id: this.token,
                ...a,
            },
        };
    }
}
