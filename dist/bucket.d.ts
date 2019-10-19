/// <reference types="node" />
import { IBucket } from "./types";
export declare class Bucket implements IBucket {
    contacts: Buffer[];
    canSplit: boolean;
    private k;
    private leftBound;
    private rightBound;
    constructor(leftBound: Buffer, rightBound: Buffer, k?: number, contacts?: Buffer[]);
    compare(token: Buffer): 0 | 1 | -1;
    match(token: Buffer): boolean;
    store(token: Buffer): boolean;
    split(token: Buffer): Bucket;
}
export declare function mid(leftBound: Buffer, rightBound: Buffer): Buffer;
