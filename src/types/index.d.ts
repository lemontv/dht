import { Query as IQuery } from "./query";

export * from "./bucket";
export * from "./response";
export * from "./query";

type IPFamily = "IPv4" | "IPv6";
export interface RemoteAddressInfo {
    address: string;
    family: IPFamily;
    port: number;
    size: number;
}

export type Request = { query: IQuery; host: string; port: number };
export interface Requests {
    [t: string]: Request;
}

export type Contact = {
    host: string;
    port: number;
    lastAt: number;
};
export interface Contacts {
    [t: string]: Contact;
}
