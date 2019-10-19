export interface IBucket {
    leftBound: Buffer;
    rightBound: Buffer;
    contacts: Buffer[];
    canSplit: boolean;

    compare(token: Buffer): 0 | -1 | 1;
    match(token: Buffer): boolean;
    store(token: Buffer): boolean;
    split(token: Buffer): IBucket;
}
