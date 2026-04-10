# Gender Classifier API

A simple Node.js API that identifies the gender of a name using the [Genderize.io](https://genderize.io/) API.

## Features

- **Classify Gender**: Detect male or female based on a given name.
- **Confidence Scoring**: Computes an `is_confident` flag based on probability and sample size.
- **Validation**: Strict input validation for name parameters.
- **CORS Enabled**: Cross-Origin Resource Sharing enabled for all origins.

## API Endpoint

### `GET /api/classify`

Takes a `name` query parameter and returns gender data.

**Query Parameters:**
- `name` (required): The name to classify.

**Success Response (200 OK):**
```json
{
 "status": "success",
 "data": {
  "name": "Wisdom",
  "gender": "male",
  "probability": 0.93,
  "sample_size": 8461,
  "is_confident": true,
  "processed_at": "2026-04-10T12:00:00Z"
 }
}
```

**Confidence Rules:**
- `is_confident` is `true` if `probability >= 0.7` AND `sample_size >= 100`.

**Error Responses:**
- `400 Bad Request`: Missing or empty `name` parameter.
- `422 Unprocessable Entity`: `name` parameter is not a string.
- `200/404`: No prediction available for the provided name.

## Setup & Running

### Prerequisites
- Node.js installed on your system.

### Installation
1. Clone the repository or download the files.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the API
Start the server:
```bash
node index.js
```
The server will run on `http://localhost:3000` by default.

## Deployment

The API is ready for deployment on platforms like Vercel, Render, or Railway. Ensure that the environment supports Node.js.
