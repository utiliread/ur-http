import { HttpBuilder } from './http-builder';

export class Http {
    public static request(url: string) {
        return new HttpBuilder(url);
    }
}