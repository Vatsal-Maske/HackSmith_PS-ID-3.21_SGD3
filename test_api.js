const axios = require('axios');

async function testBackend() {
    try {
        const res = await axios.get('http://localhost:5000/api/aqi?city=New%20Delhi');
        console.log(JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('Error:', err.message);
        if (err.response) {
            console.error('Status:', err.response.status);
            console.error('Data:', err.response.data);
        }
    }
}

testBackend();
