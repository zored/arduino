import {HttpRetriever} from "../../std/HttpRetriever.ts"
import {Http} from "../../std/Http.ts"
import {retryOnThrow} from "../../std/intervals.ts"

export class StorageClient {
    getAny = (name: 'led16') =>
        this.json(h => h.getBody(this.path(name)))

    sendNumber = async (name = 'led16', v: number) =>
        this.json(h => h.postJson(this.path(`numbers/${name}`), v))

    sendNumbers = async (numbers: Record<string, number>) => {
        for (const name in numbers) {
            if (!numbers.hasOwnProperty(name)) {
                continue
            }
            const v = numbers[name]
            await this.sendNumber(name, v)
        }
    }

    private path = (name: string) => `${URL_STORAGE}/${name}`

    private http = () => HttpRetriever.forActiveTransport()

    private json = (fetch: (http: Http) => Promise<string>) =>
        retryOnThrow(async () =>
            JSON.parse(
                await fetch(this.http())
            )
        )
}