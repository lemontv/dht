export interface IBucket {
    contacts: Buffer[];
    canSplit: boolean;

    match(token: Buffer): boolean;
    store(token: Buffer): boolean;
    split(): IBucket;
}
