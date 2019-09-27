import { Query } from "../src";

describe("Query class", () => {
    const token = "token-1";
    const query = new Query(token);

    it("should be able to genrate a ping query", () => {
        expect(query.ping()).toEqual({
            t: "11",
            y: "q",
            q: "ping",
            a: {
                id: token,
            },
        });
    });

    it("should be able to genrate a find_node query", () => {
        const target = "target-token";
        expect(query.find_node({ target })).toEqual({
            t: "12",
            y: "q",
            q: "find_node",
            a: {
                id: token,
                target,
            },
        });
    });

    it("should be able to genrate a get_peers query", () => {
        const infoHash = "info-hash";
        expect(query.get_peers({ info_hash: infoHash })).toEqual({
            t: "13",
            y: "q",
            q: "get_peers",
            a: {
                id: token,
                info_hash: infoHash,
            },
        });
    });

    it("should be able to genrate a announce_peer query", () => {
        const a = {
            implied_port: 1,
            info_hash: "info-hash",
            port: 6881,
            token: "token-1",
        };
        expect(query.announce_peer(a)).toEqual({
            t: "14",
            y: "q",
            q: "announce_peer",
            a: {
                id: token,
                ...a,
            },
        });
    });
});
