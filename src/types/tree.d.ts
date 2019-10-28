import { Contacts, Contact } from "./index";
import { Bucket } from "../bucket";

export interface ITree {
    TOKEN: Buffer;
    buckets: Bucket[];
    contacts: Contacts;

    findBucket: (token: Buffer) => number;
    store: (token: Buffer, contact: Omit<Contact, "lastAt">) => void;
    remove: (token: Buffer) => void;
    clean: () => void;
}
