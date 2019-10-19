/// <reference types="node" />
import { Socket } from "dgram";
import { Response as IResponse, Query as IQuery } from "./types";
declare type IpFamily = "IPv4" | "IPv6";
interface RemoteAddressInfo {
    address: string;
    family: IpFamily;
    port: number;
    size: number;
}
export declare const handleMessage: (server: Socket, msg: Buffer, rinfo: RemoteAddressInfo) => void;
export declare const handleQuery: (server: Socket, response: IQuery, rinfo: RemoteAddressInfo) => void;
export declare const handleResponse: (server: Socket, response: IResponse) => void;
export {};
