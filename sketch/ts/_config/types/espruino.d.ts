declare var OptErr: Error | null

declare function require(name: string): any;

declare interface IDHT11 {
    read(f: (r: { temp: number, rh: number }) => void): void
}

declare interface IHttpResponse {
    on(event: 'data', callback: (data: string) => void): void

    on(event: 'close', callback: () => void): void
}
