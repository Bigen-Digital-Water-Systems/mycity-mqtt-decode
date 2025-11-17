# MQTT Decode Microservice

A Node.js microservice that decrypts AES-encrypted MQTT payloads and republishes them to an MQTT broker. This service is designed to work with MyCity devices, decoding encrypted telemetry data and forwarding it to a broker for further processing.

## Features

-   **AES Decryption**: Decrypts hex-encoded AES-CBC encrypted payloads
-   **MQTT Integration**: Publishes decoded data to MQTT broker
-   **Timestamp Conversion**: Converts custom timestamps to ISO 8601 format
-   **RESTful API**: Exposes endpoints for data decoding
-   **Docker Support**: Containerized deployment with optimized production build
-   **Error Handling**: Comprehensive error logging and exception handling

## Prerequisites

-   Node.js 24 or higher
-   npm or yarn
-   Access to an MQTT broker
-   Environment variables configured (see Configuration section)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd decode-mqtt-microservice
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory (see Configuration section)

4. Start the server:

```bash
node app.js
```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=4030
CONTEXT=/api
VERSION=1.0.0

# MQTT Broker Configuration
MYCITY_MQTT_BROKER_URL=mqtt://your-broker-url:1883
```

### AES Encryption Keys

The AES encryption keys are configured in `.env`:

-   **AES_KEY**
-   **AES_IV**

## API Endpoints

### GET `/`

Health check endpoint that returns service information.

**Response:**

```json
{
	"message": "MyCity Decode MQTT Microservice",
	"version": "1.0.0"
}
```

### POST `/mycity/decode`

Decodes encrypted MyCity device data and publishes to MQTT broker.

**Request Body:**

```json
{
	"payload": "hex-encoded-encrypted-data",
	"loggerId": "device-logger-id",
	"credentials": {
		"clientId": "mqtt-client-id",
		"userName": "mqtt-username"
	}
}
```

**Response:**

```json
{
	"message": "Data received successfully"
}
```

**Process:**

1. Receives hex-encoded AES-encrypted payload
2. Decrypts using AES-CBC with predefined keys
3. Parses JSON data from decrypted plaintext
4. Converts custom timestamp to Unix timestamp (milliseconds)
5. Adds `decoded: true` flag to values
6. Publishes to MQTT broker at topic `v1/devices/me/telemetry`

## Test

### Build Docker Image

```bash
docker build -t mqtt-decode-microservice .
```

### Run Docker Container

```bash
docker run -d \
  -p 4030:4030 \
  --env-file .env \
  --name mqtt-decoder \
  mqtt-decode-microservice
```

## Development

### Code Structure

```
.
├── app.js                          # Main application entry point
├── Dockerfile                       # Docker configuration
├── package.json                     # Dependencies and scripts
├── .env                            # Environment variables (not in repo)
└── source/
    ├── controllers/
    │   └── mycitycontroller.js     # MyCity data decoding logic
    └── setup/
        └── router.js               # Express route definitions
```

### Linting

The project uses ESLint for code quality:

## Dependencies

### Production

-   **express**: Web framework
-   **mqtt**: MQTT client for publishing messages
-   **crypto-js**: AES encryption/decryption
-   **axios**: HTTP client
-   **body-parser**: Request body parsing
-   **dotenv**: Environment variable management

### Development

-   **eslint**: Code linting
-   **@eslint/js**: ESLint JavaScript configuration
-   **globals**: Global variable definitions

## Error Handling

The service includes:

-   Uncaught exception handler that logs and exits gracefully
-   Try-catch blocks around decryption and MQTT operations
-   JSON parsing fallback for malformed data
-   Detailed error logging for debugging

## Security Considerations

1. **Encryption Keys**: Store AES keys in environment variables for production
2. **MQTT Credentials**: Use secure authentication for MQTT broker connections
3. **Non-root User**: Docker container runs as non-root user
4. **Input Validation**: Validate and sanitize incoming payloads
5. **HTTPS**: Use reverse proxy (nginx/Apache) with SSL in production

## Troubleshooting

### Connection Issues

-   Verify MQTT broker URL is correct and accessible
-   Check firewall rules for MQTT port (default 1883)
-   Ensure MQTT credentials are valid

### Decryption Errors

-   Verify AES keys match the encryption source
-   Check that payload is properly hex-encoded
-   Validate payload format and structure

### Server Not Starting

-   Check if port 4030 is already in use
-   Verify all environment variables are set
-   Review logs for uncaught exceptions

## Support

For issues or questions, please contact Hanno Vorster
