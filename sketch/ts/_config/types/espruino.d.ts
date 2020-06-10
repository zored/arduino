declare var OptErr: Error | null
declare function require(name: string): any;
declare interface IHttpResponse {
    on(event: 'data', callback: (data: string) => void): void
    on(event: 'close', callback: () => void): void

}
declare interface IHttp {
    get(url: string, callback: (r: IHttpResponse) => void): void
}