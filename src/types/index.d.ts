import { Query as IQuery } from "./query";

export * from "./bucket";
export * from "./response";
export * from "./query";
export * from "./tree";

type IPFamily = "IPv4" | "IPv6";
export interface RemoteAddressInfo {
    address: string;
    family: IPFamily;
    port: number;
    size: number;
}

export interface Request {
    query: IQuery;
    host: string;
    port: number;
}

export interface Requests {
    [t: string]: Request;
}

export interface Contact {
    host: string;
    port: number;
    lastAt: number;
}
export interface Contacts {
    [t: string]: Contact;
}
