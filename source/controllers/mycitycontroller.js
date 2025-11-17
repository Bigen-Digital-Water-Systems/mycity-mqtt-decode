// Node Modules
const mqtt = require("mqtt");
const CryptoJS = require("crypto-js");

// AES config
const AES_KEY = CryptoJS.enc.Hex.parse(process.env.MYCITY_AES_KEY);
const AES_IV = CryptoJS.enc.Hex.parse(process.env.MYCITY_AES_IV);

const mycityController = (function () {
	// Example method to log received data, chanege and add as needed
	const decodeData = (req, res) => {
		try {
			const hex = req.body.payload;

			const decrypted = CryptoJS.AES.decrypt(
				{
					ciphertext: CryptoJS.enc.Hex.parse(hex),
				},
				AES_KEY,
				{
					iv: AES_IV,
					mode: CryptoJS.mode.CBC,
					padding: CryptoJS.pad.Pkcs7,
				}
			);

			const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

			let data;
			try {
				data = JSON.parse(plaintext);
			} catch (error) {
				console.error("Error parsing JSON:", error);
				data = { raw: plaintext };
			}

			// Convert custom TimeStamp to ISO 8601
			try {
				data.ts = parseInt(data.ts) + 946591200;
				data.ts = data.ts * 1000;
				data.values.decoded = true;
			} catch (error) {
				console.error("Error processing timestamp or values:", error);
				return res.status(400).json({ message: "Invalid data format" });
			}

			// Output decrypted data to console for debugging
			console.log("Decrypted Data:", data);
			console.log("LoggerId:", req.body.loggerId);
			console.log("Credentials:", req.body.credentials);
			console.log("------------------------------");

			// Connect to MQTT Broker
			try {
				const client = mqtt.connect(process.env.MYCITY_MQTT_BROKER_URL, {
					clientId: req.body.credentials.clientId,
					username: req.body.credentials.userName,
					clean: true,
					reconnectPeriod: 1000,
				});

				client.on("connect", () => {
					console.log("Connected to MyCity!");

					const topic = "v1/devices/me/telemetry";
					const payload = JSON.stringify(data);

					client.publish(topic, payload, { qos: 1 }, (err) => {
						if (err) {
							console.error("Publish error:", err);
						} else {
							console.log(`Device with LoggerId ${req.body.loggerId} decoded & message sent!`);
						}
						client.end();
					});
				});

				client.on("error", (err) => {
					console.error("Connection error:", err);
				});
			} catch (error) {
				console.error("Error connecting to MQTT broker:", error);
				return res.status(500).json({ message: "MQTT connection error" });
			}

			// Send a success response
			return res.status(200).json({ message: "Data received successfully" });
		} catch (error) {
			console.error("Error processing MyCity data:", error);
			return res.status(500).json({ message: "Internal Server Error" });
		}
	};

	return {
		decodeData,
	};
})();

module.exports = mycityController;
