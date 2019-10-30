import { Bucket } from "./bucket";
import { Contacts, Contact, ITree } from "./types";

const encoding = "ascii";

export class Tree implements ITree {
    public TOKEN: Buffer;
    public buckets: Bucket[] = [];
    public contacts: Contacts = {};

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
        let i = 0;
        let j = this.buckets.length - 1;

        while (i <= j) {
            const k = Math.floor((i + j) / 2);
            const c = this.buckets[k].compare(token);

            if (c === 0) {
                return k;
            } else if (c > 0) {
                i = k + 1;
            } else {
                j = k - 1;
            }
        }

        return -1;
    }

    public store(token: Buffer, contact: Pick<Contact, "port" | "host">) {
        const t = token.toString(encoding);
        if (this.contacts[t]) {
            this.contacts[t] = {
                ...contact,
                token,
                lastAt: new Date().getTime(),
            };
        } else {
            const i = this.findBucket(token);
            if (i < 0) {
                return null;
            }
            const status = this.buckets[i].store(token);
            if (status) {
                this.contacts[t] = {
                    ...contact,
                    token,
                    lastAt: new Date().getTime(),
                };
                if (
                    this.buckets[i].contacts.length >= 20 &&
                    this.buckets[i].canSplit
                ) {
                    const bucket = this.buckets[i].split(this.TOKEN);
                    const pos = i + 1;
                    this.buckets.splice(pos, 0, bucket);
                }
            }
        }
    }

    public remove(token: Buffer) {
        delete this.contacts[token.toString(encoding)];
        const i = this.findBucket(token);
        this.buckets[i].remove(token);
    }

    public clean() {
        const now = new Date().getTime();
        Object.values(this.contacts)
            .filter((contact) => now - contact.lastAt > 15 * 60)
            .forEach((contact) => {
                this.remove(contact.token);
            });
    }
}
