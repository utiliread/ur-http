import { HttpBuilderOfT } from './http-builder-of-t';

export class HttpBuilder {
    message: {
        url: string;
        content?: any;
        contentType?: string;
        headers: Headers;
    };
    
    constructor(url: string) {
        this.message = {
            url: url,
            headers: new Headers()
        };
    }

    private sendContent(content: any, contentType?: string) {
        this.message.content = content;
        this.message.contentType = contentType;
        return this;
    }

    private withHandler<T>(handler: (response: Response) => Promise<T>) {
        return new HttpBuilderOfT<T>(this, handler);
    }

    // Send Extensions

    sendForm(content: FormData, contentType?: string) {
        return this.sendContent(content, contentType);
    }

    sendJson(content: any) {
        return this.sendContent(JSON.stringify(content), 'application/json');
    }

    // Modifier Extensions

    addHeader(name: string, value: string) {
        this.message.headers.append(name, value);
        return this;
    }

    // Expect Extensions

    expectJson<T>() {
        this.message.headers.set('Accept', 'application/json');
        return this.withHandler(response => response.json());
    }
}