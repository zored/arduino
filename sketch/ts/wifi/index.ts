import {WiFi} from "../_lib/WiFi.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"

const http = require('http')

const myGet = (url: string) => new Promise((resolve) => {
    let response = ''
    http.get(url, (res: any) => {
        res.on('data', (d: string) => response += d)
        res.on('close', () => resolve(response))
    })
})

const main = async () => {
    console.log('connecting...')
    const myWifi = new WiFi('my', 'wifi')
    await myWifi.connect()
    addGlobals({myWifi, myGet})
    console.log('connected! see my* functions')
}

main().catch(e => console.log('App error.', e))
