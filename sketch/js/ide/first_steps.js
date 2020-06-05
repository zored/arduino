const AmperkaButton = require('@amperka/button');
const AmperkaLedStrip = require('@amperka/led-strip');
const DHT11 = require("DHT11"); // - Humidity and Temperature.
const NeoPixel = require("neopixel");

const pins = {
	humidity: P6,
	led16: P4,
}

const main = () => {
	[
		new RandomLedFlow(),
		new HumidityFlow(),
	].forEach(f => f.start())
};

class HumidityFlow {
	start() {
		const th = new Humidity();
		const update = () => th.read((t, h) => console.log(`Temperature: ${t}C. Humidity: ${h}%.`))
		update()
		setInterval(update, 5000);
	}
}

class ButtonFlow {
	start() {
		[B0, A7, A3, A2].forEach(p => new Button(p, () => console.log(p)).init());
	}
}

class Humidity {
	constructor(pin) {
		this.pin = pin || pins.humidity;
	}

	get dht() {
		if (this._dht) {
			return this._dht;
		}
		this._dht = DHT11.connect(P7);
		return this._dht;
	}

	read(then) {
		this.dht.read((d) => then(d.temp, d.rh));
	}
}

class RandomLedFlow {
	start() {
		const leds = new Led16();
		leds.clear();
		const points = new RandomPointGenerator(leds.side, leds.side);
		setInterval(function () {
			leds.setColor(points.next(), Color.randomHue());
			leds.flush();
		}, 1000);
	}
}

class RandomPointGenerator {
	constructor(width, height, uniqueSequence) {
		this.width = width;
		this.height = height;
		this.stack = [];
		this.uniqueSequence = uniqueSequence || 4;
	}

	next() {
		// Clean stack:
		while (this.stack.length > this.uniqueSequence) {
			this.stack.pop();
		}

		// Get next unique:
		while (true) {
			const point = Point.random(this.width, this.height);
			if (this.stack.find(p => p.equals(point))) {
				continue;
			}
			this.stack.unshift(point);
			break;
		}

		// Return new value:
        return this.stack[0];
	}

}

class Button {
	constructor(port, action) {
		this.port = port;
		this.action = action;
	}

	init() {
		AmperkaButton.connect(this.port, {
			holdTime: 0.5
		}).on('press', this.action);
		return this;
	}
}

class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toIndex(width) {
		return this.y * width + this.x;
	}

	equals(that) {
		return this.x === that.x && this.y === that.y
	}

	static random(width, heigth) {
		const r = s => parseInt(Math.random() * s);
		return new Point(r(width), r(heigth));
	}
}

class Color {
	constructor(red, green, blue) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	static randomHue() {
		return Color.fromHSL(Math.random(), 1, 0.4)
	}

	static fromHSL(h, s, l) { // [0,1]
	    var r, g, b;

	    if (s == 0) {
    		return new Color(l, l, l);
	    }

        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 
        	? l * (1 + s) 	
            : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);

    	return new Color(r, g, b);
	}

	toGBR255() {
		return [this.green, this.blue, this.red].map(v => v * 255)
	}
}

class Led16 {
	constructor(brightness, pin, side) {
		this.brightness = brightness || 0.01;
		this.pin = pin || pins.led16;
		this.side = side || 4;
		this.clear(true);
	}

	setColor(point, color) {
		const offset = point.toIndex(this.side)*3;
		color.toGBR255().forEach((v, i) => this.pixels[offset + i] = v * this.brightness)
	}

	clear(noApply) {
		this.pixels = new Uint8ClampedArray(Math.pow(this.side, 2)*3);
		if (noApply) {
			return;
		}
		this.flush();
	}
	flush() {
		NeoPixel.write(this.pin, this.pixels);
	}
}

class IsrkaJsSpi {
	get() {
		if (this._spi) {
			return this._spi;
		}
		digitalWrite(SDA, 0);
		digitalWrite(SCL, 1);
		SPI1.setup({
			baud: 3200000,
			mosi: P3,
			sck: A5,
			miso: P2
		});
		this._spi = SPI1;
		console.log(this._spi);
		return this._spi;
	}
}

main();