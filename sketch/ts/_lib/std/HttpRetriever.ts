import {Http} from "./Http.ts"

export class HttpRetriever {
    private static instance?: Http
    private static hasTransport = false

    static forActiveTransport = () => {
        if (HttpRetriever.instance) {
            return HttpRetriever.instance;
        }

        if (!HttpRetriever.hasTransport) {
            throw new Error(`There is no transport for HTTP.`)
        }

        HttpRetriever.instance = new Http();
        return HttpRetriever.instance
    }

    static setHasTransport = (v: boolean = true) => HttpRetriever.hasTransport = v
}