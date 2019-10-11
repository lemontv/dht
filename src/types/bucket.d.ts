export interface IBucket {
    match(token: Buffer): boolean;
}
