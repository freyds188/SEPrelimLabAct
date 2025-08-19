// Simple API test script
const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

async function testAPI() {
  console.log('Testing API endpoints...\n');

  // Test 1: Register endpoint
  console.log('1. Testing /auth/register...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error('❌ Invalid JSON response:', err.message);
      console.log('Response status:', response.status);
      console.log('Response text:', await response.text());
      return;
    }

    console.log('✅ Response:', data);
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }

  console.log('\n2. Testing /auth/login...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    let data;
    try {
      data = await response.json();
    } catch (err) {
      console.error('❌ Invalid JSON response:', err.message);
      console.log('Response status:', response.status);
      console.log('Response text:', await response.text());
      return;
    }

    console.log('✅ Response:', data);
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testAPI();



