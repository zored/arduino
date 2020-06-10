const http: IHttp = require('http')

export class Http {
    getBody = (url: string) => new Promise<string>((resolve) => {
        let body = ''
        http.get(url, (response: IHttpResponse) => {
            response.on('data', (d: string) => body += d)
            response.on('close', () => resolve(body))
        })
    })

}