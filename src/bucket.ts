import { IBucket } from "./types";

export class Bucket implements IBucket {
    private k: number;
    private left: Buffer;
    private right: Buffer;
    private contacts: Buffer[] = [];

    constructor(left: Buffer, right: Buffer, k: number = 20) {
        this.left = left;
        this.right = right;
        this.k = k;
    }

    public match(token: Buffer) {
        return (
            Buffer.compare(token, this.left) >= 0 &&
            Buffer.compare(this.right, token) > 0
        );
    }
}
