import { IBucket } from "./types";
import { Buffer } from "buffer";

export class Bucket implements IBucket {
    public contacts: Buffer[];
    public canSplit: boolean = true;

    private k: number;
    private leftBound: Buffer;
    private rightBound: Buffer;

    constructor(
        leftBound: Buffer,
        rightBound: Buffer,
        k: number = 20,
        contacts: Buffer[] = []
    ) {
        this.leftBound = leftBound;
        this.rightBound = rightBound;
        this.k = k;
        this.contacts = [...contacts];
    }

    public compare(token: Buffer) {
        if (Buffer.compare(token, this.leftBound) < 0) {
            return -1;
        }

        if (Buffer.compare(token, this.rightBound) >= 0) {
            return 1;
        }

        return 0;
    }

    public match(token: Buffer) {
        return (
            Buffer.compare(token, this.leftBound) >= 0 &&
            Buffer.compare(this.rightBound, token) > 0
        );
    }

    public store(token: Buffer): boolean {
        if (this.contacts.length < this.k && this.match(token)) {
            this.contacts.push(token);
            return true;
        } else {
            return false;
        }
    }

    public split() {
        if (
            !this.canSplit ||
            Buffer.compare(this.leftBound, this.rightBound) >= 0
        ) {
            throw new Error("Can not split this bucket");
        }

        this.canSplit = false;

        const midBound = mid(this.leftBound, this.rightBound);
        const bucket = new Bucket(midBound, this.rightBound);
        this.rightBound = midBound;

        this.contacts = this.contacts.filter(
            (contact) => !bucket.store(contact)
        );

        return bucket;
    }
}

export function mid(leftBound: Buffer, rightBound: Buffer) {
    if (leftBound.length !== rightBound.length) {
        throw new Error("Not the same length of two buffer");
    }

    if (Buffer.compare(leftBound, rightBound) === 0) {
        return leftBound;
    }

    const length = leftBound.length;
    const midBound = Buffer.alloc(length);
    let carry = 0;

    for (let i = length; i >= 0; i--) {
        const sum = leftBound[i] + rightBound[i] + carry;
        midBound[i] = sum;
        carry = sum > 0xff ? 1 : 0;
    }

    for (let i = 0; i < length; i++) {
        const b = (midBound[i] & 0x01) > 0 ? 1 : 0;
        midBound[i] = (midBound[i] >> 1) | (carry << 7);
        carry = b;
    }

    for (let i = length; i >= 0; i--) {
        const sum = midBound[i] + 1;
        midBound[i] = sum;
        if (sum <= 0xff) {
            break;
        }
    }

    return midBound;
}
