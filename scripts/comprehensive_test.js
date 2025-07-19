#!/usr/bin/env node

/**
 * Comprehensive API Test Script cho ChatStoryAI
 * Test tất cả các endpoints được định nghĩa trong API documentation
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');
const path = require('path');

// Cấu hình
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  email: process.env.TEST_EMAIL || 'test@example.com',
  password: process.env.TEST_PASSWORD || 'password123',
  timeout: 15000,
  outputFile: 'test_results.json'
};

// Test results storage
let testResults = {
  startTime: new Date().toISOString(),
  endTime: null,
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  results: []
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
        'User-Agent': 'ChatStoryAI-Comprehensive-Test/1.0',
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
            data: jsonData,
            rawData: data
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data,
            rawData: data
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

function recordTest(testName, passed, details = {}) {
  testResults.totalTests++;
  if (passed) {
    testResults.passedTests++;
  } else {
    testResults.failedTests++;
  }
  
  testResults.results.push({
    testName,
    passed,
    timestamp: new Date().toISOString(),
    ...details
  });
}

// Test suites
const TEST_SUITES = {
  // Authentication Tests
  authentication: [
    {
      name: 'POST /api/auth/login',
      method: 'POST',
      endpoint: '/api/auth/login',
      body: () => ({ email: CONFIG.email, password: CONFIG.password }),
      expectedStatus: [200, 201],
      saveResponse: 'authCookies'
    },
    {
      name: 'POST /api/auth/register',
      method: 'POST',
      endpoint: '/api/auth/register',
      body: () => ({
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        username: `testuser_${Date.now()}`
      }),
      expectedStatus: [200, 201, 400] // 400 if user already exists
    },
    {
      name: 'POST /api/auth/forgot-password',
      method: 'POST',
      endpoint: '/api/auth/forgot-password',
      body: () => ({ email: CONFIG.email }),
      expectedStatus: [200, 201, 404]
    }
  ],

  // Stories Management Tests
  stories: [
    {
      name: 'GET /api/stories',
      method: 'GET',
      endpoint: '/api/stories',
      requiresAuth: true,
      expectedStatus: [200]
    },
    {
      name: 'POST /api/stories/create',
      method: 'POST',
      endpoint: '/api/stories/create',
      requiresAuth: true,
      body: () => ({
        title: `Test Story ${Date.now()}`,
        description: 'A test story created by automation',
        main_category_id: 1,
        tag_ids: [1, 2]
      }),
      expectedStatus: [200, 201],
      saveResponse: 'createdStoryId'
    },
    {
      name: 'GET /api/stories/[id]',
      method: 'GET',
      endpoint: '/api/stories/{{createdStoryId}}',
      requiresAuth: true,
      expectedStatus: [200, 404],
      dependsOn: 'createdStoryId'
    }
  ],

  // Public Library Tests
  library: [
    {
      name: 'GET /api/library/new',
      method: 'GET',
      endpoint: '/api/library/new?page=1',
      expectedStatus: [200]
    },
    {
      name: 'GET /api/library/popular',
      method: 'GET',
      endpoint: '/api/library/popular',
      expectedStatus: [200]
    },
    {
      name: 'GET /api/library/search',
      method: 'GET',
      endpoint: '/api/library/search?q=test&category=1',
      expectedStatus: [200]
    }
  ],

  // Categories Tests
  categories: [
    {
      name: 'GET /api/categories',
      method: 'GET',
      endpoint: '/api/categories',
      expectedStatus: [200]
    }
  ],

  // AI Features Tests
  ai: [
    {
      name: 'GET /api/ai/gemini',
      method: 'GET',
      endpoint: '/api/ai/gemini',
      requiresAuth: true,
      expectedStatus: [200, 401]
    },
    {
      name: 'POST /api/ai/chat-history/messages',
      method: 'POST',
      endpoint: '/api/ai/chat-history/messages',
      requiresAuth: true,
      body: () => ({
        messages: [
          { role: 'user', content: 'Hello AI' },
          { role: 'assistant', content: 'Hello! How can I help you?' }
        ]
      }),
      expectedStatus: [200, 201, 401]
    }
  ],

  // Documentation Tests
  docs: [
    {
      name: 'GET /api/docs',
      method: 'GET',
      endpoint: '/api/docs',
      expectedStatus: [200]
    }
  ]
};

// Global state
let globalState = {
  authCookies: null,
  createdStoryId: null
};

async function runTestSuite(suiteName, tests) {
  log(`\n=== Running ${suiteName.toUpperCase()} Tests ===`, 'info');
  
  for (const test of tests) {
    // Skip test if dependency not met
    if (test.dependsOn && !globalState[test.dependsOn]) {
      log(`⏭️  Skipping ${test.name} - dependency ${test.dependsOn} not available`, 'warning');
      recordTest(test.name, false, { reason: 'Dependency not met', dependency: test.dependsOn });
      continue;
    }

    try {
      // Prepare request
      let endpoint = test.endpoint;
      
      // Replace placeholders
      Object.keys(globalState).forEach(key => {
        if (globalState[key]) {
          endpoint = endpoint.replace(`{{${key}}}`, globalState[key]);
        }
      });

      const url = `${CONFIG.baseUrl}${endpoint}`;
      const options = {
        method: test.method,
        headers: {}
      };

      // Add auth if required
      if (test.requiresAuth && globalState.authCookies) {
        options.headers['Cookie'] = globalState.authCookies.join('; ');
      }

      // Add body if provided
      if (test.body) {
        options.body = test.body();
      }

      log(`Testing ${test.name}...`, 'info');
      const response = await makeRequest(url, options);
      
      // Check if status is expected
      const statusOk = test.expectedStatus.includes(response.status);
      
      if (statusOk) {
        log(`✓ ${test.name} - Status: ${response.status}`, 'success');
        recordTest(test.name, true, { 
          status: response.status, 
          endpoint: endpoint,
          method: test.method 
        });

        // Save response data if specified
        if (test.saveResponse && response.data) {
          if (test.saveResponse === 'authCookies') {
            globalState.authCookies = response.headers['set-cookie'] || [];
          } else if (test.saveResponse === 'createdStoryId') {
            globalState.createdStoryId = response.data.data?.id || response.data.id;
          }
        }
      } else {
        log(`✗ ${test.name} - Expected: ${test.expectedStatus.join('|')}, Got: ${response.status}`, 'error');
        recordTest(test.name, false, { 
          status: response.status, 
          expectedStatus: test.expectedStatus,
          endpoint: endpoint,
          method: test.method,
          responseData: response.data 
        });
      }

    } catch (error) {
      log(`✗ ${test.name} - Error: ${error.message}`, 'error');
      recordTest(test.name, false, { 
        error: error.message,
        endpoint: test.endpoint,
        method: test.method 
      });
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

async function runAllTests() {
  log('🚀 Starting Comprehensive API Tests...', 'info');
  log(`📍 Base URL: ${CONFIG.baseUrl}`, 'info');
  
  // Run all test suites
  for (const [suiteName, tests] of Object.entries(TEST_SUITES)) {
    await runTestSuite(suiteName, tests);
  }
  
  // Generate summary
  testResults.endTime = new Date().toISOString();
  const duration = new Date(testResults.endTime) - new Date(testResults.startTime);
  
  log('\n📊 TEST SUMMARY', 'info');
  log(`Total Tests: ${testResults.totalTests}`, 'info');
  log(`Passed: ${testResults.passedTests}`, 'success');
  log(`Failed: ${testResults.failedTests}`, 'error');
  log(`Success Rate: ${((testResults.passedTests / testResults.totalTests) * 100).toFixed(2)}%`, 'info');
  log(`Duration: ${duration}ms`, 'info');
  
  // Save results to file
  const outputPath = path.join(__dirname, CONFIG.outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(testResults, null, 2));
  log(`📄 Results saved to: ${outputPath}`, 'info');
  
  // Exit with appropriate code
  process.exit(testResults.failedTests > 0 ? 1 : 0);
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(error => {
    log(`❌ Test runner error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runAllTests, TEST_SUITES };
