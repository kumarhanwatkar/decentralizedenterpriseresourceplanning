import https from 'https';

const testSeedEndpoint = async () => {
  console.log('🌱 Testing Seed Endpoint...\n');
  
  const url = 'https://erp-api-pr9p.onrender.com/api/admin/seed';
  const seedKey = 'seed_secret_key_12345';

  return new Promise((resolve) => {
    const options = {
      method: 'POST',
      headers: {
        'x-seed-key': seedKey,
        'Content-Type': 'application/json',
        'Content-Length': 2,
      },
      timeout: 30000,
    };

    const req = https.request(url, options, (res) => {
      console.log(`Status: ${res.statusCode}\n`);
      console.log('Headers:', res.headers);
      
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log('\n✅ Response Body:');
          console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log('\n❌ Response (raw):');
          console.log(data);
        }
        resolve();
      });
    });

    req.on('error', (err) => {
      console.error('❌ Request Error:', err.message);
      resolve();
    });

    req.on('timeout', () => {
      console.error('❌ Request Timeout');
      req.destroy();
      resolve();
    });

    req.write('{}');
    req.end();
  });
};

testSeedEndpoint();
