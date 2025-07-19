#!/usr/bin/env node

/**
 * Script Node.js để test API ChatStoryAI
 * Chạy: node test_api.js
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

// Cấu hình
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  email: process.env.TEST_EMAIL || 'test@example.com',
  password: process.env.TEST_PASSWORD || 'password123',
  timeout: 10000
};

// Utility functions
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ChatStoryAI-Test-Script/1.0',
        ...options.headers
      },
      timeout: CONFIG.timeout
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(typeof options.body === 'string' ? options.body : JSON.stringify(options.body));
    }

    req.end();
  });
}

function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  
  const timestamp = new Date().toISOString();
  console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
}

// Test functions
async function testHealthCheck() {
  log('Testing health check...', 'info');
  try {
    const response = await makeRequest(`${CONFIG.baseUrl}/api/docs`);
    if (response.status === 200) {
      log('✓ Health check passed', 'success');
      return true;
    } else {
      log(`✗ Health check failed: ${response.status}`, 'error');
      return false;
    }
  } catch (error) {
    log(`✗ Health check error: ${error.message}`, 'error');
    return false;
  }
}

async function testAuthentication() {
  log('Testing authentication...', 'info');
  
  // Test login
  try {
    const loginResponse = await makeRequest(`${CONFIG.baseUrl}/api/auth/login`, {
      method: 'POST',
      body: {
        email: CONFIG.email,
        password: CONFIG.password
      }
    });
    
    if (loginResponse.status === 200) {
      log('✓ Login successful', 'success');
      return loginResponse.headers['set-cookie'] || [];
    } else {
      log(`✗ Login failed: ${loginResponse.status} - ${JSON.stringify(loginResponse.data)}`, 'error');
      return null;
    }
  } catch (error) {
    log(`✗ Login error: ${error.message}`, 'error');
    return null;
  }
}

async function testStoriesAPI(cookies) {
  log('Testing Stories API...', 'info');
  
  const headers = cookies ? { 'Cookie': cookies.join('; ') } : {};
  
  try {
    // Test get stories
    const storiesResponse = await makeRequest(`${CONFIG.baseUrl}/api/stories`, {
      headers
    });
    
    if (storiesResponse.status === 200) {
      log('✓ Get stories successful', 'success');
      log(`  Found ${storiesResponse.data.data?.length || 0} stories`, 'info');
    } else {
      log(`✗ Get stories failed: ${storiesResponse.status}`, 'error');
    }
    
    // Test create story
    const createResponse = await makeRequest(`${CONFIG.baseUrl}/api/stories/create`, {
      method: 'POST',
      headers,
      body: {
        title: 'Test Story',
        description: 'A test story created by automation',
        main_category_id: 1,
        tag_ids: [1, 2]
      }
    });
    
    if (createResponse.status === 201 || createResponse.status === 200) {
      log('✓ Create story successful', 'success');
      return createResponse.data.data?.id;
    } else {
      log(`✗ Create story failed: ${createResponse.status} - ${JSON.stringify(createResponse.data)}`, 'error');
    }
    
  } catch (error) {
    log(`✗ Stories API error: ${error.message}`, 'error');
  }
  
  return null;
}

async function testLibraryAPI() {
  log('Testing Library API...', 'info');
  
  try {
    // Test get new stories
    const newStoriesResponse = await makeRequest(`${CONFIG.baseUrl}/api/library/new?page=1`);
    
    if (newStoriesResponse.status === 200) {
      log('✓ Get new stories successful', 'success');
    } else {
      log(`✗ Get new stories failed: ${newStoriesResponse.status}`, 'error');
    }
    
    // Test get popular stories
    const popularResponse = await makeRequest(`${CONFIG.baseUrl}/api/library/popular`);
    
    if (popularResponse.status === 200) {
      log('✓ Get popular stories successful', 'success');
    } else {
      log(`✗ Get popular stories failed: ${popularResponse.status}`, 'error');
    }
    
  } catch (error) {
    log(`✗ Library API error: ${error.message}`, 'error');
  }
}

async function testCategoriesAPI() {
  log('Testing Categories API...', 'info');
  
  try {
    const response = await makeRequest(`${CONFIG.baseUrl}/api/categories`);
    
    if (response.status === 200) {
      log('✓ Get categories successful', 'success');
      log(`  Found ${response.data.data?.length || 0} categories`, 'info');
    } else {
      log(`✗ Get categories failed: ${response.status}`, 'error');
    }
    
  } catch (error) {
    log(`✗ Categories API error: ${error.message}`, 'error');
  }
}

// Main test runner
async function runTests() {
  log('Starting ChatStoryAI API Tests...', 'info');
  log(`Base URL: ${CONFIG.baseUrl}`, 'info');
  
  // Test 1: Health check
  const healthOk = await testHealthCheck();
  if (!healthOk) {
    log('Health check failed, stopping tests', 'error');
    process.exit(1);
  }
  
  // Test 2: Authentication
  const cookies = await testAuthentication();
  
  // Test 3: Stories API (requires auth)
  if (cookies) {
    await testStoriesAPI(cookies);
  } else {
    log('Skipping Stories API tests (no authentication)', 'warning');
  }
  
  // Test 4: Library API (public)
  await testLibraryAPI();
  
  // Test 5: Categories API (public)
  await testCategoriesAPI();
  
  log('All tests completed!', 'success');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    log(`Test runner error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = {
  runTests,
  testHealthCheck,
  testAuthentication,
  testStoriesAPI,
  testLibraryAPI,
  testCategoriesAPI
};
