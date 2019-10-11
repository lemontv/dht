import { Response } from "../src";

describe("Response class", () => {
    const token = "token-2";
    const response = new Response(token);
    const t = "aa";

    it("should be able to genrate a ping response", () => {
        expect(response.ping(t)).toEqual({
            t,
            y: "r",
            r: {
                id: token,
            },
        });
    });

    it("should be able to genrate a find_node response", () => {
        const body = {
            nodes: "compact-node-info",
        };
        expect(response.find_node(t, body)).toEqual({
            t,
            y: "r",
            r: {
                id: token,
                nodes: "compact-node-info",
            },
        });
    });

    it("should be able to genrate a get_peers query", () => {
        const opaqueWriteToken = "token-3";

        const nodesResponse = {
            token: opaqueWriteToken,
            nodes: "compact-node-info",
        };
        expect(response.get_peers(t, nodesResponse)).toEqual({
            t,
            y: "r",
            r: {
                id: token,
                token: opaqueWriteToken,
                nodes: "compact-node-info",
            },
        });

        const valuesResponse = {
            token: opaqueWriteToken,
            values: ["peer-1-info-string", "peer-2-info-string"],
        };
        expect(response.get_peers(t, valuesResponse)).toEqual({
            t,
            y: "r",
            r: {
                id: token,
                token: opaqueWriteToken,
                values: ["peer-1-info-string", "peer-2-info-string"],
            },
        });
    });

    it("should be able to genrate a announce_peer response", () => {
        expect(response.announce_peer(t)).toEqual({
            t,
            y: "r",
            r: {
                id: token,
            },
        });
    });
});
