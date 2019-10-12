export interface IBucket {
    contacts: Buffer[];
    canSplit: boolean;

    compare(token: Buffer): 0 | -1 | 1;
    match(token: Buffer): boolean;
    store(token: Buffer): boolean;
    split(): IBucket;
}
