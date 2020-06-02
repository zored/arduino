const AmperkaButton = require('@amperka/button');
const AmperkaLedStrip = require('@amperka/led-strip');
const DHT11 = require("DHT11"); // - Humidity and Temperature.

const main = () => {
	// [B0, A7, A3, A2].forEach(p => new Button(p, () => console.log(p)).init());
	// new RandomLedShow().start();
	const th = new TemperatureHumidity();
	
	setInterval(
		() => th.read((t, h) => console.log(`Temperature: ${t}C. Humidity: ${h}%.`)),
		5000
	);
};

class TemperatureHumidity {
	constructor(pin) {
		this.pin = pin || P0;
	}

	get dht() {
		if (this._dht) {
			return this._dht
		}
		this._dht = DHT11.connect(this.pin)
		return this._dht;
	}

	read(then) {
		this.dht.read((d) => then(d.temp, d.rh));
	}
}

class RandomLedShow {
	start() {
		const leds = new LedSquare();
		leds.clear();
		setInterval(function () {
			leds.setColor(
				Point.random(leds.side, leds.side),
				Color.random()
			);
			leds.apply();
		}, 2000);
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

	static random() {
		const x = () => Math.random();
		return new Color(x(), x(), x());
	}
}

class LedSquare {
	constructor(side) {
		this.side = side || 4;
		this.spi = new IsrkaJsSpi();
	}
	setColor(point, color) {
		console.log([point, color]);
		this.strip.putColor(
			point.toIndex(this.side),
			color
		);
	}
	clear() {
		this.strip.clear();
	}
	apply() {
		this.strip.apply();
	}
	get strip() {
		if (this._strip) {
			return this._strip;
		}
		this._strip = AmperkaLedStrip.connect(
			this.spi.get(),
			Math.pow(this.side, 2),
			'GRB'
		);
		return this._strip;
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