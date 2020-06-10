import {WiFi} from "../_lib/device/WiFi.ts"
import {addGlobals} from "../_lib/std/addGlobals.ts"
import {HttpRetriever} from "../_lib/std/HttpRetriever.ts"
import {wrapLogs} from "../_lib/std/log.ts"

const main = async () => {
    const myWifi = new WiFi(WIFI_LOGIN, WIFI_PASSWORD)
    await wrapLogs(myWifi.connect(), 'connecting', 'connected')
    const myHttp = HttpRetriever.forActiveTransport()
    addGlobals({myWifi, myHttp})
    const body = await myHttp.getBody("https://dmitriy.tatar/")
    console.log(`response: "${body.substring(78, 118)}"`)
}

// noinspection JSIgnoredPromiseFromCall
main()
