import { Buffer } from "buffer";
import * as crypto from "crypto";
import { Tree, Bucket } from "../src";
import { ITree } from "../src/types";

describe("Tree class", () => {
    let tree: ITree;
    const token = Buffer.alloc(20).fill(0xff);
    token[0] = 0xc0;

    beforeEach(() => {
        tree = new Tree(token);
    });

    it("constractor()", () => {
        expect(tree.TOKEN).toEqual(token);
        expect(tree.buckets).toHaveLength(1);
        expect(tree.contacts).toEqual({});
    });

    it("store() ignore duplicated item", () => {
        const tk = Buffer.alloc(20);
        crypto.randomFillSync(tk);
        tree.store(tk, { host: "127.0.0.1", port: 1886 });

        expect(tree.buckets).toHaveLength(1);
        expect(tree.buckets[0].contacts).toHaveLength(1);
        expect(Object.keys(tree.contacts)).toHaveLength(1);

        const lastAt = tree.contacts[tk.toString("ascii")].lastAt;
        tree.store(tk, { host: "127.0.0.1", port: 1886 });
        expect(tree.buckets).toHaveLength(1);
        expect(tree.buckets[0].contacts).toHaveLength(1);
        expect(Object.keys(tree.contacts)).toHaveLength(1);
        expect(
            tree.contacts[tk.toString("ascii")].lastAt
        ).toBeGreaterThanOrEqual(lastAt);

        const wrongToken = Buffer.alloc(20).fill(0xff);
        tree.store(wrongToken, { host: "127.0.0.1", port: 1886 });
        expect(tree.buckets[0].contacts).toHaveLength(1);
        expect(Object.keys(tree.contacts)).toHaveLength(1);
    });

    it("store()", () => {
        const contacts = 20;
        const n = 4;

        for (let i = 0; i < contacts; i++) {
            const tk = Buffer.alloc(20);
            crypto.randomFillSync(tk);
            tk[0] = 0x00;
            tree.store(tk, { host: "127.0.0.1", port: 1886 });
        }

        for (let i = 0; i < contacts; i++) {
            const tk = Buffer.alloc(20);
            crypto.randomFillSync(tk);
            tk[0] = 0x80;
            tree.store(tk, { host: "127.0.0.1", port: 1886 });
        }

        for (let i = 0; i < contacts; i++) {
            const tk = Buffer.alloc(20);
            crypto.randomFillSync(tk);
            tk[0] = 0xc0;
            tree.store(tk, { host: "127.0.0.1", port: 1886 });
        }

        for (let i = 0; i < contacts; i++) {
            const tk = Buffer.alloc(20);
            crypto.randomFillSync(tk);
            tk[0] = 0xe0;
            tree.store(tk, { host: "127.0.0.1", port: 1886 });
        }

        expect(tree.buckets).toHaveLength(n);
        expect(Object.keys(tree.contacts)).toHaveLength(n * contacts);

        let removedToken = tree.buckets[0].contacts[0];
        tree.remove(removedToken);
        expect(tree.buckets).toHaveLength(n);
        expect(Object.keys(tree.contacts)).toHaveLength(n * contacts - 1);

        let newToken = Buffer.alloc(20);
        crypto.randomFillSync(newToken);
        newToken[0] = 0x00;
        tree.store(newToken, { host: "127.0.0.1", port: 1886 });
        expect(tree.buckets).toHaveLength(n);
        expect(Object.keys(tree.contacts)).toHaveLength(n * contacts);

        removedToken = tree.buckets[3].contacts[0];
        tree.remove(removedToken);
        expect(tree.buckets).toHaveLength(n);
        expect(Object.keys(tree.contacts)).toHaveLength(n * contacts - 1);

        newToken = Buffer.alloc(20);
        crypto.randomFillSync(newToken);
        newToken[0] = 0xe0;
        tree.store(newToken, { host: "127.0.0.1", port: 1886 });
        expect(tree.buckets).toHaveLength(n);
        expect(Object.keys(tree.contacts)).toHaveLength(n * contacts);

        for (let i = 0; i < contacts - 1; i++) {
            const tk = Buffer.alloc(20);
            crypto.randomFillSync(tk);
            tk[0] = 0xe0;
            tree.store(tk, { host: "127.0.0.1", port: 1886 });
        }
        expect(tree.buckets).toHaveLength(n);
        expect(Object.keys(tree.contacts)).toHaveLength(n * contacts);
    });

    it("remove()", () => {
        const contacts = 12;

        for (let i = 0; i < contacts; i++) {
            const tk = Buffer.alloc(20);
            crypto.randomFillSync(tk);
            tree.store(tk, { host: "127.0.0.1", port: 1886 });
        }

        const t = Buffer.alloc(20);
        crypto.randomFillSync(t);

        tree.store(t, { host: "127.0.0.1", port: 1886 });
        expect(Object.keys(tree.contacts)).toHaveLength(contacts + 1);
        expect(tree.buckets[0].contacts).toHaveLength(contacts + 1);

        tree.remove(t);
        expect(tree.contacts[t.toString("ascii")]).toBeUndefined();
        expect(Object.keys(tree.contacts)).toHaveLength(contacts);
        expect(tree.buckets[0].contacts).toHaveLength(contacts);
    });

    it("clean()", () => {
        const contacts = 10;

        for (let i = 0; i < contacts; i++) {
            const tk = Buffer.alloc(20);
            crypto.randomFillSync(tk);
            tree.store(tk, { host: "127.0.0.1", port: 1886 });
        }

        const t = Buffer.alloc(20);
        crypto.randomFillSync(t);

        tree.store(t, { host: "127.0.0.1", port: 1886 });
        expect(Object.keys(tree.contacts)).toHaveLength(contacts + 1);
        expect(tree.buckets[0].contacts).toHaveLength(contacts + 1);

        const lastAt = new Date().getTime() - 20 * 60;
        tree.contacts[t.toString("ascii")].lastAt = lastAt;
        tree.clean();

        expect(tree.contacts[t.toString("ascii")]).toBeUndefined();
        expect(Object.keys(tree.contacts)).toHaveLength(contacts);
        expect(tree.buckets[0].contacts).toHaveLength(contacts);
    });
});
