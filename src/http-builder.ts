import { HttpBuilderOfT } from './http-builder-of-t';
import { HttpResponse } from './http-response';

export class HttpBuilder {
    static fetch = fetch;
    
    message: {
        method: string;
        url: string;
        content?: any;
        contentType?: string;
        headers: Headers;
    };

    fetch = HttpBuilder.fetch; // Default fetch
    
    constructor(method: string, url: string) {
        this.message = {
            method: method,
            url: url,
            headers: new Headers()
        };
    }

    private withContent(content: any, contentType?: string) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    }

    private useHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    using(fetch: (input: RequestInfo) => Promise<Response>) {
        this.fetch = fetch;
        return this;
    }

    async send(abortSignal?: any) {
        if (this.message.contentType) {
            this.message.headers.set('Content-Type', this.message.contentType);
        }

        // Cast to any to allow for the signal property
        let response = await this.fetch(this.message.url, <any>{
            method: this.message.method,
            body: this.message.content,
            headers: this.message.headers,
            signal: abortSignal
        });

        return new HttpResponse(response);
    }

    // Content Extensions

    withForm(content: FormData, contentType?: string) {
        return this.withContent(content, contentType);
    }

    withJson(content: any) {
        return this.withContent(JSON.stringify(content), 'application/json');
    }

    // Modifier Extensions

    addHeader(name: string, value: string) {
        this.message.headers.append(name, value);
        return this;
    }

    // Expect Extensions

    expectJson<T>(factory?: (object: any) => T) {
        this.message.headers.set('Accept', 'application/json');
        return this.useHandler(response => {
            if (response.status === 204) {
                return Promise.resolve(null);
            }
            return response.json().then(x => factory ? factory(x) : <T>x);
        });
    }
}