#!/usr/bin/env node

/**
 * Performance Test Script cho ChatStoryAI API
 * Test hiệu suất và khả năng chịu tải của các endpoints
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const fs = require('fs');

// Cấu hình performance test
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  email: process.env.TEST_EMAIL || 'test@example.com',
  password: process.env.TEST_PASSWORD || 'password123',
  concurrentUsers: parseInt(process.env.CONCURRENT_USERS) || 10,
  requestsPerUser: parseInt(process.env.REQUESTS_PER_USER) || 5,
  timeout: 30000,
  outputFile: 'performance_results.json'
};

// Performance metrics
let performanceResults = {
  startTime: new Date().toISOString(),
  endTime: null,
  config: CONFIG,
  totalRequests: 0,
  successfulRequests: 0,
  failedRequests: 0,
  averageResponseTime: 0,
  minResponseTime: Infinity,
  maxResponseTime: 0,
  requestsPerSecond: 0,
  results: []
};

function makeRequest(url, options = {}) {
  const startTime = Date.now();
  
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
        'User-Agent': 'ChatStoryAI-Performance-Test/1.0',
        ...options.headers
      },
      timeout: CONFIG.timeout
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        resolve({
          status: res.statusCode,
          responseTime,
          success: res.statusCode >= 200 && res.statusCode < 400,
          data: data
        });
      });
    });

    req.on('error', (error) => {
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      resolve({
        status: 0,
        responseTime,
        success: false,
        error: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      resolve({
        status: 0,
        responseTime,
        success: false,
        error: 'Request timeout'
      });
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

// Test scenarios
const TEST_SCENARIOS = [
  {
    name: 'Public Library - New Stories',
    endpoint: '/api/library/new?page=1',
    method: 'GET',
    weight: 0.4 // 40% of requests
  },
  {
    name: 'Public Library - Popular Stories',
    endpoint: '/api/library/popular',
    method: 'GET',
    weight: 0.3 // 30% of requests
  },
  {
    name: 'Categories',
    endpoint: '/api/categories',
    method: 'GET',
    weight: 0.2 // 20% of requests
  },
  {
    name: 'API Documentation',
    endpoint: '/api/docs',
    method: 'GET',
    weight: 0.1 // 10% of requests
  }
];

async function simulateUser(userId) {
  log(`👤 User ${userId} starting...`, 'info');
  const userResults = [];
  
  for (let i = 0; i < CONFIG.requestsPerUser; i++) {
    // Select random scenario based on weight
    const random = Math.random();
    let cumulativeWeight = 0;
    let selectedScenario = TEST_SCENARIOS[0];
    
    for (const scenario of TEST_SCENARIOS) {
      cumulativeWeight += scenario.weight;
      if (random <= cumulativeWeight) {
        selectedScenario = scenario;
        break;
      }
    }
    
    const url = `${CONFIG.baseUrl}${selectedScenario.endpoint}`;
    const result = await makeRequest(url, {
      method: selectedScenario.method
    });
    
    userResults.push({
      userId,
      requestId: i + 1,
      scenario: selectedScenario.name,
      endpoint: selectedScenario.endpoint,
      ...result,
      timestamp: new Date().toISOString()
    });
    
    // Small delay between requests from same user
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
  }
  
  log(`👤 User ${userId} completed ${CONFIG.requestsPerUser} requests`, 'success');
  return userResults;
}

async function runPerformanceTest() {
  log('🚀 Starting Performance Test...', 'info');
  log(`👥 Concurrent Users: ${CONFIG.concurrentUsers}`, 'info');
  log(`📊 Requests per User: ${CONFIG.requestsPerUser}`, 'info');
  log(`📍 Target: ${CONFIG.baseUrl}`, 'info');
  
  const startTime = Date.now();
  
  // Create promises for all users
  const userPromises = [];
  for (let i = 1; i <= CONFIG.concurrentUsers; i++) {
    userPromises.push(simulateUser(i));
  }
  
  // Wait for all users to complete
  log('⏳ Waiting for all users to complete...', 'info');
  const allResults = await Promise.all(userPromises);
  
  const endTime = Date.now();
  const totalDuration = endTime - startTime;
  
  // Flatten results
  const flatResults = allResults.flat();
  
  // Calculate metrics
  performanceResults.totalRequests = flatResults.length;
  performanceResults.successfulRequests = flatResults.filter(r => r.success).length;
  performanceResults.failedRequests = flatResults.filter(r => !r.success).length;
  
  const responseTimes = flatResults.map(r => r.responseTime);
  performanceResults.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  performanceResults.minResponseTime = Math.min(...responseTimes);
  performanceResults.maxResponseTime = Math.max(...responseTimes);
  performanceResults.requestsPerSecond = (performanceResults.totalRequests / totalDuration) * 1000;
  
  performanceResults.endTime = new Date().toISOString();
  performanceResults.results = flatResults;
  
  // Generate report
  log('\n📊 PERFORMANCE TEST RESULTS', 'info');
  log(`⏱️  Total Duration: ${totalDuration}ms (${(totalDuration/1000).toFixed(2)}s)`, 'info');
  log(`📈 Total Requests: ${performanceResults.totalRequests}`, 'info');
  log(`✅ Successful: ${performanceResults.successfulRequests}`, 'success');
  log(`❌ Failed: ${performanceResults.failedRequests}`, 'error');
  log(`📊 Success Rate: ${((performanceResults.successfulRequests / performanceResults.totalRequests) * 100).toFixed(2)}%`, 'info');
  log(`⚡ Requests/Second: ${performanceResults.requestsPerSecond.toFixed(2)}`, 'info');
  log(`⏱️  Response Times:`, 'info');
  log(`   Average: ${performanceResults.averageResponseTime.toFixed(2)}ms`, 'info');
  log(`   Min: ${performanceResults.minResponseTime}ms`, 'info');
  log(`   Max: ${performanceResults.maxResponseTime}ms`, 'info');
  
  // Scenario breakdown
  log('\n📋 Scenario Breakdown:', 'info');
  const scenarioStats = {};
  flatResults.forEach(result => {
    if (!scenarioStats[result.scenario]) {
      scenarioStats[result.scenario] = {
        total: 0,
        successful: 0,
        failed: 0,
        totalResponseTime: 0
      };
    }
    
    scenarioStats[result.scenario].total++;
    if (result.success) {
      scenarioStats[result.scenario].successful++;
    } else {
      scenarioStats[result.scenario].failed++;
    }
    scenarioStats[result.scenario].totalResponseTime += result.responseTime;
  });
  
  Object.entries(scenarioStats).forEach(([scenario, stats]) => {
    const avgResponseTime = stats.totalResponseTime / stats.total;
    const successRate = (stats.successful / stats.total) * 100;
    log(`   ${scenario}: ${stats.total} requests, ${successRate.toFixed(1)}% success, ${avgResponseTime.toFixed(2)}ms avg`, 'info');
  });
  
  // Save results
  const outputPath = require('path').join(__dirname, CONFIG.outputFile);
  fs.writeFileSync(outputPath, JSON.stringify(performanceResults, null, 2));
  log(`\n📄 Detailed results saved to: ${outputPath}`, 'info');
  
  // Performance recommendations
  log('\n💡 Performance Recommendations:', 'warning');
  if (performanceResults.averageResponseTime > 1000) {
    log('   ⚠️  Average response time is high (>1s). Consider optimizing database queries.', 'warning');
  }
  if (performanceResults.requestsPerSecond < 10) {
    log('   ⚠️  Low throughput (<10 req/s). Consider adding caching or scaling infrastructure.', 'warning');
  }
  if ((performanceResults.failedRequests / performanceResults.totalRequests) > 0.05) {
    log('   ⚠️  High error rate (>5%). Check server logs for issues.', 'warning');
  }
  
  return performanceResults;
}

// Run performance test if this file is executed directly
if (require.main === module) {
  runPerformanceTest().catch(error => {
    log(`❌ Performance test error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runPerformanceTest, CONFIG };
