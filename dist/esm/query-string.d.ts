export declare class QueryString {
    static serialize(params: any): string;
    static append(url: string, params: any): string;
    static getParameter(name: string): string | null | undefined;
    private static _serializeQueryString(source, prefix?);
}
