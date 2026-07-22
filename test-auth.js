const fetch = require('node-fetch');

async function testAuth() {
  try {
    const res = await fetch('https://university-dashboard-backend-9t0x.onrender.com/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@university.edu', password: 'password123' })
    });
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data:", data);
  } catch (e) {
    console.error(e);
  }
}
testAuth();
