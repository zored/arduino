const http = require('http')

export class Http {
    getBody = (url: string) => new Promise<string>((resolve) =>
        http.get(url, this.handleResponse(resolve))
    )

    postJson = (requestUrl: string, data: any) => new Promise<string>((resolve, reject) => {
        const content = JSON.stringify(data)

        // Request options:
        const options = url.parse(requestUrl, true)
        options.method = 'POST'
        options.headers = {
            "Content-Type": "application/json",
            "Content-Length": content.length
        }

        const request = http.request(options, this.handleResponse(resolve))
        request.on('error', (e: Error) => {
            console.log(e)
            reject(e)
        })
        request.end(content)
    })

    private handleResponse(resolve: (response: string) => void) {
        return function (r: IHttpResponse) {
            let ss = ""
            r.on('data', s => ss += s)
            r.on('close', () => resolve(ss))
        }
    }
}