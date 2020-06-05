import { PinContainer } from "../_lib/PinContainer.ts";
import { Led } from "../_lib/Led.ts";

const led = new Led(new PinContainer().output(B6));
setInterval(() => led.toggle(), 2000);