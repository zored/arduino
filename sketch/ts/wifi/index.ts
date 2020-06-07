import {WiFi} from "../_lib/WiFi.ts"

(async () => {
    console.log('started')
    const wifi = new WiFi('my', 'wifi')
    console.log(wifi);
    await wifi.connect()
    console.log('connected')

    require('http').get('http://amperka.ru', (res: any) => {
        let response = ''
        res.on('data', (d: string) => response += d)
        res.on('close', () => console.log(response))
    })
})();