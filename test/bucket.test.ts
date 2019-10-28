import { Buffer } from "buffer";
import { Bucket } from "../src";
import { mid } from "../src/bucket";

describe("Bucket class", () => {
    let leftBound: Buffer = Buffer.alloc(20);
    let rightBound: Buffer = Buffer.alloc(20);
    beforeEach(() => {
        leftBound = Buffer.alloc(20).fill(0x00);
        rightBound = Buffer.alloc(20).fill(0xff);
    });

    describe("compare()", () => {
        it("should return 0", () => {
            leftBound[0] = 0x80;
            const b1 = new Bucket(leftBound, rightBound);
            const token = Buffer.alloc(20).fill(0x00);

            token[0] = 0xff;
            expect(b1.compare(token)).toEqual(0);

            token[0] = 0x80;
            expect(b1.compare(token)).toEqual(0);

            token[0] = 0x8f;
            expect(b1.compare(token)).toEqual(0);
        });

        it("should return -1", () => {
            leftBound[0] = 0x80;
            const b1 = new Bucket(leftBound, rightBound);
            const token = Buffer.alloc(20).fill(0x00);

            token[0] = 0x0f;
            expect(b1.compare(token)).toEqual(-1);
        });

        it("should return 1", () => {
            rightBound.fill(0x00);
            rightBound[0] = 0x80;
            const b1 = new Bucket(leftBound, rightBound);
            const token = Buffer.alloc(20).fill(0x00);

            token[0] = 0xff;
            expect(b1.compare(token)).toEqual(1);

            token[0] = 0x80;
            expect(b1.compare(token)).toEqual(1);
        });
    });

    describe("match()", () => {
        it("should return truthy", () => {
            rightBound[0] = 0x80;
            const b1 = new Bucket(leftBound, rightBound);
            const token = Buffer.alloc(20).fill(0x00);

            token[0] = 0x0f;
            expect(b1.match(token)).toBeTruthy();

            token[0] = 0x00;
            expect(b1.match(token)).toBeTruthy();

            leftBound[0] = 0x80;
            rightBound.fill(0xff);
            const b2 = new Bucket(leftBound, rightBound);
            token.fill(0xf0);
            expect(b2.match(token)).toBeTruthy();
        });

        it("should return falsy", () => {
            const b1 = new Bucket(leftBound, rightBound);
            let token = Buffer.alloc(20).fill(0xff);

            expect(b1.match(token)).toBeFalsy();

            rightBound[0] = 0x80;
            const b2 = new Bucket(leftBound, rightBound);
            token = Buffer.alloc(20).fill(0xff);
            token[0] = 0xf0;
            expect(b2.match(token)).toBeFalsy();
        });
    });

    describe("store()", () => {
        it("should be empty contacts by default", () => {
            const bucket = new Bucket(leftBound, rightBound);
            expect(bucket.contacts).toHaveLength(0);
        });

        it("should be able store a token", () => {
            const bucket = new Bucket(leftBound, rightBound);

            const t1 = Buffer.alloc(20).fill(0x0f);
            bucket.store(t1);
            expect(bucket.contacts).toHaveLength(1);
            expect(bucket.contacts[0]).toEqual(t1);
        });

        it("should not be able to store a token when it was full", () => {
            const t1 = Buffer.alloc(20).fill(0x01);
            const t2 = Buffer.alloc(20).fill(0x02);
            const t3 = Buffer.alloc(20).fill(0xf0);
            rightBound[0] = 0x80;
            const bucket = new Bucket(leftBound, rightBound, 2, [t1]);

            expect(bucket.contacts).toHaveLength(1);
            bucket.store(t3);
            expect(bucket.contacts).toHaveLength(1);
            bucket.store(t2);
            expect(bucket.contacts).toHaveLength(2);
        });
    });

    describe("split()", () => {
        it("should be able to throw a error", () => {
            const token = Buffer.alloc(20).fill(0x00);
            const b1 = new Bucket(leftBound, rightBound);
            b1.canSplit = false;
            expect(() => b1.split(token)).toThrow();

            const b2 = new Bucket(leftBound, leftBound);
            expect(() => b2.split(token)).toThrow();
        });

        it("should be return new bucket", () => {
            const token = Buffer.alloc(20).fill(0x88);
            const t1 = Buffer.alloc(20).fill(0x01);
            const t2 = Buffer.alloc(20).fill(0x02);
            const t3 = Buffer.alloc(20).fill(0xf0);

            const b1 = new Bucket(leftBound, rightBound, 20, [t1, t2, t3]);
            const b2 = b1.split(token);

            expect(b2.match(t3)).toBeTruthy();
            expect(b1.contacts).toHaveLength(2);
            expect(b1.contacts).toEqual([t1, t2]);
            expect(b2.contacts).toHaveLength(1);
            expect(b2.contacts).toEqual([t3]);
            expect(b1.canSplit).toBeFalsy();
            expect(b2.canSplit).toBeTruthy();

            const b3 = b2.split(token);
            expect(b2.canSplit).toBeTruthy();
            expect(b3.canSplit).toBeFalsy();
        });
    });

    describe("remove()", () => {
        it("should be able to remove a token", () => {
            const t1 = Buffer.alloc(20).fill(0x01);
            const t2 = Buffer.alloc(20).fill(0x02);
            const t3 = Buffer.alloc(20).fill(0xf0);
            const b1 = new Bucket(leftBound, rightBound, 20, [t1, t2]);

            expect(b1.contacts).toHaveLength(2);
            b1.remove(t3);
            expect(b1.contacts).toHaveLength(2);
            expect(b1.contacts).toEqual([t1, t2]);
            b1.remove(t1);
            expect(b1.contacts).toHaveLength(1);
            expect(b1.contacts).toEqual([t2]);
        });
    });
});

describe("mid function", () => {
    it("should throw error", () => {
        const left = Buffer.alloc(10).fill(0x00);
        const right = Buffer.alloc(20).fill(0x00);
        expect(() => mid(left, right)).toThrow();
    });

    it("should return same", () => {
        const left = Buffer.alloc(20).fill(0x00);
        const right = Buffer.alloc(20).fill(0x00);
        const midBound = Buffer.alloc(20).fill(0x00);
        expect(mid(left, right)).toEqual(midBound);
    });

    it("should return mid bound", () => {
        const left = Buffer.alloc(20).fill(0x00);
        const right = Buffer.alloc(20).fill(0xff);
        const midBound = Buffer.alloc(20).fill(0x00);
        midBound[0] = 0x80;
        expect(mid(left, right)).toEqual(midBound);

        left[0] = 0x80;
        midBound[0] = 0xc0;
        expect(mid(left, right)).toEqual(midBound);

        left[0] = 0xc0;
        midBound[0] = 0xe0;
        expect(mid(left, right)).toEqual(midBound);

        left.fill(0xff);
        right.fill(0xff);
        midBound.fill(0xff);
        expect(mid(left, right)).toEqual(midBound);

        left.fill(0x00);
        right.fill(0x00);
        right[0] = 0x80;
        midBound.fill(0x00);
        midBound[0] = 0x40;
        midBound[19] = 0x01;
        expect(mid(left, right)).toEqual(midBound);
    });
});
