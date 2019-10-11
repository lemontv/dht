import { Bucket } from "../src";
import { IBucket } from "../src/types";
import { Buffer } from "buffer";

describe("Bucket class", () => {
    describe("match()", () => {
        const left = Buffer.alloc(20).fill(0x00);
        const right = Buffer.alloc(20).fill(0x80);
        const bucket: IBucket = new Bucket(left, right);

        it("should return truthy", () => {
            const token = Buffer.alloc(20).fill(0x00);

            token[0] = 0x0f;
            expect(bucket.match(token)).toBeTruthy();

            token[0] = 0x00;
            expect(bucket.match(token)).toBeTruthy();
        });

        it("should return falsy", () => {
            const token = Buffer.alloc(20).fill(0xff);

            expect(bucket.match(token)).toBeFalsy();

            token[0] = 0xf0;
            expect(bucket.match(token)).toBeFalsy();
        });
    });
});
