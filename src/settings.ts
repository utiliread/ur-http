import { Fetch } from "./http";

export interface Settings {
    fetch?: Fetch;
    corsMode?: RequestMode;
    baseUrl?: string;
}