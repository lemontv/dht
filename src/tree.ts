import { Bucket } from "./bucket";
import { Contacts, Contact } from "./types";

export class Tree {
    private TOKEN: Buffer;
    private buckets: Bucket[] = [];
    private contacts: Contacts = {};

    constructor(token: Buffer) {
        /**
         * Initial k-buckets
         */
        const leftBound = Buffer.alloc(20).fill(0x00);
        const rightBound = Buffer.alloc(20).fill(0xff);
        const root = new Bucket(leftBound, rightBound);
        this.buckets.push(root);

        this.TOKEN = token;
    }

    public findBucket(token: Buffer) {
        let i = Math.floor(this.buckets.length / 2);
        let c = this.buckets[i].compare(token);

        while (c !== 0) {
            if (c > 0) {
                i += 1;
                i = Math.floor(this.buckets.length + i / 2);
            } else {
                i -= 1;
                i = Math.floor(i / 2);
            }
            c = this.buckets[i].compare(token);
        }

        return i;
    }

    public store(token: Buffer, contact: Omit<Contact, "lastAt">) {
        const t = token.toString("ascii");
        if (this.contacts[t]) {
            this.contacts[t] = {
                ...contact,
                lastAt: new Date().getTime(),
            };
        } else {
            const i = this.findBucket(token);
            const status = this.buckets[i].store(token);
            this.contacts[t] = {
                ...contact,
                lastAt: new Date().getTime(),
            };
            if (!status && this.buckets[i].canSplit) {
                const bucket = this.buckets[i].split(this.TOKEN);
                const pos = bucket.match(this.buckets[i].leftBound) ? i + 1 : i;
                this.buckets.splice(pos, 0, bucket);
            }
        }
    }

    public remove(token: Buffer) {
        delete this.contacts[token.toString("ascii")];
        const i = this.findBucket(token);
        this.buckets[i].remove(token);
    }

    public clean() {
        const n = new Date().getTime();
        Object.entries(this.contacts)
            .filter(([, v]) => n - v.lastAt > 15 * 60)
            .forEach(([k]) => this.remove(Buffer.from(k)));
    }
}
