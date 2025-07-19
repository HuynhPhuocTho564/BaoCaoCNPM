#!/usr/bin/env node

/**
 * Demo script để chạy tất cả các test và tạo báo cáo tổng hợp
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    log(`🚀 Running: ${command} ${args.join(' ')}`, 'info');
    
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        log(`✅ Command completed successfully`, 'success');
        resolve(code);
      } else {
        log(`❌ Command failed with code ${code}`, 'error');
        resolve(code); // Don't reject, continue with other tests
      }
    });
    
    child.on('error', (error) => {
      log(`❌ Command error: ${error.message}`, 'error');
      resolve(1);
    });
  });
}

async function checkServerHealth() {
  log('🔍 Checking server health...', 'info');
  
  const https = require('https');
  const http = require('http');
  const { URL } = require('url');
  
  const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  
  return new Promise((resolve) => {
    try {
      const urlObj = new URL(`${baseUrl}/api/docs`);
      const client = urlObj.protocol === 'https:' ? https : http;
      
      const req = client.get(urlObj, (res) => {
        if (res.statusCode === 200) {
          log('✅ Server is healthy and responding', 'success');
          resolve(true);
        } else {
          log(`⚠️  Server responded with status ${res.statusCode}`, 'warning');
          resolve(false);
        }
      });
      
      req.on('error', (error) => {
        log(`❌ Server health check failed: ${error.message}`, 'error');
        resolve(false);
      });
      
      req.setTimeout(5000, () => {
        req.destroy();
        log('❌ Server health check timeout', 'error');
        resolve(false);
      });
      
    } catch (error) {
      log(`❌ Server health check error: ${error.message}`, 'error');
      resolve(false);
    }
  });
}

function generateSummaryReport() {
  log('📊 Generating summary report...', 'info');
  
  const summaryReport = {
    timestamp: new Date().toISOString(),
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    tests: {}
  };
  
  // Read comprehensive test results
  const comprehensiveResultsPath = path.join(__dirname, 'test_results.json');
  if (fs.existsSync(comprehensiveResultsPath)) {
    try {
      const comprehensiveResults = JSON.parse(fs.readFileSync(comprehensiveResultsPath, 'utf8'));
      summaryReport.tests.comprehensive = {
        totalTests: comprehensiveResults.totalTests,
        passedTests: comprehensiveResults.passedTests,
        failedTests: comprehensiveResults.failedTests,
        successRate: ((comprehensiveResults.passedTests / comprehensiveResults.totalTests) * 100).toFixed(2) + '%'
      };
    } catch (error) {
      log(`⚠️  Could not read comprehensive test results: ${error.message}`, 'warning');
    }
  }
  
  // Read performance test results
  const performanceResultsPath = path.join(__dirname, 'performance_results.json');
  if (fs.existsSync(performanceResultsPath)) {
    try {
      const performanceResults = JSON.parse(fs.readFileSync(performanceResultsPath, 'utf8'));
      summaryReport.tests.performance = {
        totalRequests: performanceResults.totalRequests,
        successfulRequests: performanceResults.successfulRequests,
        failedRequests: performanceResults.failedRequests,
        averageResponseTime: performanceResults.averageResponseTime.toFixed(2) + 'ms',
        requestsPerSecond: performanceResults.requestsPerSecond.toFixed(2),
        successRate: ((performanceResults.successfulRequests / performanceResults.totalRequests) * 100).toFixed(2) + '%'
      };
    } catch (error) {
      log(`⚠️  Could not read performance test results: ${error.message}`, 'warning');
    }
  }
  
  // Save summary report
  const summaryPath = path.join(__dirname, 'summary_report.json');
  fs.writeFileSync(summaryPath, JSON.stringify(summaryReport, null, 2));
  
  // Display summary
  log('\n📋 TEST SUMMARY REPORT', 'info');
  log(`🌐 Target URL: ${summaryReport.baseUrl}`, 'info');
  log(`⏰ Generated: ${summaryReport.timestamp}`, 'info');
  
  if (summaryReport.tests.comprehensive) {
    log('\n🔍 Comprehensive Tests:', 'info');
    log(`   Total: ${summaryReport.tests.comprehensive.totalTests}`, 'info');
    log(`   Passed: ${summaryReport.tests.comprehensive.passedTests}`, 'success');
    log(`   Failed: ${summaryReport.tests.comprehensive.failedTests}`, 'error');
    log(`   Success Rate: ${summaryReport.tests.comprehensive.successRate}`, 'info');
  }
  
  if (summaryReport.tests.performance) {
    log('\n⚡ Performance Tests:', 'info');
    log(`   Total Requests: ${summaryReport.tests.performance.totalRequests}`, 'info');
    log(`   Successful: ${summaryReport.tests.performance.successfulRequests}`, 'success');
    log(`   Failed: ${summaryReport.tests.performance.failedRequests}`, 'error');
    log(`   Success Rate: ${summaryReport.tests.performance.successRate}`, 'info');
    log(`   Avg Response Time: ${summaryReport.tests.performance.averageResponseTime}`, 'info');
    log(`   Requests/Second: ${summaryReport.tests.performance.requestsPerSecond}`, 'info');
  }
  
  log(`\n📄 Detailed summary saved to: ${summaryPath}`, 'info');
}

async function runDemo() {
  log('🎬 Starting ChatStoryAI API Test Demo...', 'info');
  
  // Check if server is running
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    log('⚠️  Server appears to be down or not responding. Tests may fail.', 'warning');
    log('💡 Make sure your ChatStoryAI server is running on the configured URL.', 'info');
  }
  
  log('\n📋 Test Plan:', 'info');
  log('1. Basic API Tests', 'info');
  log('2. Comprehensive API Tests', 'info');
  log('3. Performance Tests', 'info');
  log('4. Generate Summary Report', 'info');
  
  // Run basic tests
  log('\n🔧 Step 1: Running Basic API Tests...', 'info');
  await runCommand('node', ['test_api.js']);
  
  // Run comprehensive tests
  log('\n🔍 Step 2: Running Comprehensive API Tests...', 'info');
  await runCommand('node', ['comprehensive_test.js']);
  
  // Run performance tests
  log('\n⚡ Step 3: Running Performance Tests...', 'info');
  await runCommand('node', ['performance_test.js']);
  
  // Generate summary
  log('\n📊 Step 4: Generating Summary Report...', 'info');
  generateSummaryReport();
  
  log('\n🎉 Demo completed! Check the generated files for detailed results:', 'success');
  log('   - test_results.json (comprehensive test results)', 'info');
  log('   - performance_results.json (performance test results)', 'info');
  log('   - summary_report.json (summary report)', 'info');
  
  log('\n💡 Next steps:', 'info');
  log('   - Review the test results', 'info');
  log('   - Import postman_collection.json into Postman for manual testing', 'info');
  log('   - Use individual test scripts for specific testing needs', 'info');
}

// Run demo if this file is executed directly
if (require.main === module) {
  runDemo().catch(error => {
    log(`❌ Demo error: ${error.message}`, 'error');
    process.exit(1);
  });
}

module.exports = { runDemo };
