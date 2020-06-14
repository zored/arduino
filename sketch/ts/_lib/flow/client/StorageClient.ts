import {HttpRetriever} from "../../std/HttpRetriever.ts"
import {Http} from "../../std/Http.ts"

export class StorageClient {
    getAny = (name: 'led16') =>
        this.json(h => h.getBody(this.path(name)))

    sendNumber = async (name: 'led16', v: number) =>
        this.json(h => h.postJson(this.path(`numbers/${name}`), v))

    private path = (name: string) => `${URL_STORAGE}/${name}`

    private http = () => HttpRetriever.forActiveTransport()

    private json = async (f: (http: Http) => Promise<string>) => {
        const body = await f(this.http())
        return JSON.parse(body)
    }
}