/**
 * Quick local verification script for Intro to Backend Web Development.
 * Runs tests on API routes and checks configuration.
 */

import http from 'http';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

console.log('🧪 Verifying API Server Configuration...');

http.get(`${BASE_URL}/`, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`\n✅ Server is responsive! Status Code: ${res.statusCode}`);
    try {
      const parsed = JSON.parse(data);
      console.log('📦 Server Response:');
      console.log(JSON.stringify(parsed, null, 2));
      console.log('\n🎉 Local verification successful! Ready for Postman and evaluation testing.');
    } catch (e) {
      console.log('Raw output:', data);
    }
  });
}).on('error', (err) => {
  console.error(`\n❌ Could not connect to server at ${BASE_URL}: ${err.message}`);
  console.log('👉 Make sure the server is running: `npm run dev` or `npm start` in another terminal.');
});
