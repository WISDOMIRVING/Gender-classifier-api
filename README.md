# Gender Classifier API

A simple Node.js + Express API that predicts the gender of a given name using the [Genderize.io](https://genderize.io/) API.

## Features

- **Gender Classification**: Predicts male or female based on a given name.
- **Confidence Scoring**: Computes an `is_confident` flag based on probability and sample size.
- **Input Validation**: Returns proper HTTP status codes for missing or invalid parameters.
- **CORS Enabled**: Cross-Origin Resource Sharing enabled for all origins.

## API Endpoint

### `GET /api/classify`

Classifies the gender of the provided name.

**Query Parameters:**

| Parameter | Type   | Required | Description            |
|-----------|--------|----------|------------------------|
| `name`    | string | Yes      | The name to classify   |

**Example Request:**

```
GET /api/classify?name=wisdom
```

**Success Response (200 OK):**

```json
{
  "status": "success",
  "data": {
    "name": "wisdom",
    "gender": "male",
    "probability": 0.93,
    "sample_size": 8461,
    "is_confident": true,
    "processed_at": "2026-04-15T00:25:44.325Z"
  }
}
```

**Confidence Rules:**

- `is_confident` is `true` only if `probability >= 0.7` **AND** `sample_size >= 100`.

**Error Responses:**

| Status Code | Condition                                | Message                                          |
|-------------|------------------------------------------|--------------------------------------------------|
| `400`       | Missing or empty `name` parameter        | `"Name query parameter is required"`             |
| `422`       | `name` is not a string                   | `"Name must be a string"`                        |
| `422`       | Genderize returns `null` gender or `0` count | `"No prediction available for the provided name"` |
| `502`       | External API request fails               | `"External API request failed"`                  |

## Setup & Running

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/WISDOMIRVING/Gender-classifier-api.git
   cd Gender-classifier-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

```bash
node server.js
```

The server will start on `http://localhost:3000`.

Test it in your browser:

```
http://localhost:3000/api/classify?name=wisdom
```

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **HTTP Client**: Axios
- **External API**: [Genderize.io](https://genderize.io/)

## Deployment

This API is deployed on **Render** and auto-deploys from the `main` branch on GitHub.
