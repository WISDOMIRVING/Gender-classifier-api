const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

/**
 * GET /api/classify
 * Classifies gender based on the provided name using Genderize API.
 */
app.get('/api/classify', async (req, res) => {
    const { name } = req.query;

    // 1. Input Validation
    if (name === undefined || name === '') {
        return res.status(400).json({
            status: 'error',
            message: 'Missing or empty name query parameter'
        });
    }

    if (typeof name !== 'string') {
        return res.status(422).json({
            status: 'error',
            message: 'Name parameter must be a string'
        });
    }

    try {
        // 2. Call Genderize API
        // Using a timeout to respect the 500ms requirement (though external API latency is excluded)
        const response = await axios.get(`https://api.genderize.io?name=${encodeURIComponent(name)}`, {
            timeout: 5000 // 5 seconds timeout for external API
        });

        const { gender, probability, count } = response.data;

        // 3. Genderize Edge Cases
        if (gender === null || count === 0) {
            return res.status(200).json({ // Usually 200 but user specified "return: { status: error }"
                status: 'error',
                message: 'No prediction available for the provided name'
            });
        }

        // 4. Process Data
        const sample_size = count;
        const is_confident = probability >= 0.7 && sample_size >= 100;
        const processed_at = new Date().toISOString();

        // 5. Success Response
        return res.status(200).json({
            status: 'success',
            data: {
                name: name,
                gender: gender,
                probability: probability,
                sample_size: sample_size,
                is_confident: is_confident,
                processed_at: processed_at
            }
        });

    } catch (error) {
        console.error('Error fetching from Genderize API:', error.message);
        
        const statusCode = error.response ? (error.response.status === 429 ? 429 : 502) : 500;
        const message = error.response ? `External API error: ${error.response.statusText}` : 'Internal server error';

        return res.status(statusCode).json({
            status: 'error',
            message: message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
