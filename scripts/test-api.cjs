
const http = require('http');

const data = JSON.stringify({
    name: 'Test User',
    email: 'jeswinalbert15@gmail.com',
    message: 'Test message from Node script'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/contact',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending request to http://localhost:5000/api/contact...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
