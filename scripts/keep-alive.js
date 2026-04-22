#!/usr/bin/env node
/**
 * Keep-Alive Ping Script for Render Free Tier
 * 
 * Gửi request ping định kỳ đến FastAPI server để tránh bị sleep
 * Hỗ trợ retry, logging, và xử lý lỗi
 * 
 * Usage: node keep-alive.js <server_url> [retries] [timeout_ms]
 * Ví dụ: node keep-alive.js https://your-app.onrender.com 3 10000
 */

const https = require('https');
const http = require('http');

// ============ CONFIG ============
const CONFIG = {
  // Lấy từ environment variable hoặc command line
  SERVER_URL: process.env.RENDER_URL || process.argv[2] || 'https://your-render-url.onrender.com',
  HEALTH_ENDPOINT: '/health',
  MAX_RETRIES: parseInt(process.argv[3]) || parseInt(process.env.PING_RETRIES) || 3,
  TIMEOUT_MS: parseInt(process.argv[4]) || parseInt(process.env.PING_TIMEOUT) || 10000,
  VERBOSE: process.env.VERBOSE === 'true' || process.argv.includes('--verbose'),
};

// ============ LOGGING ============
const logger = {
  log: (msg) => console.log(`[${new Date().toISOString()}] ℹ️  ${msg}`),
  success: (msg) => console.log(`[${new Date().toISOString()}] ✅ ${msg}`),
  error: (msg) => console.error(`[${new Date().toISOString()}] ❌ ${msg}`),
  warn: (msg) => console.warn(`[${new Date().toISOString()}] ⚠️  ${msg}`),
  debug: (msg) => CONFIG.VERBOSE && console.log(`[${new Date().toISOString()}] 🔍 ${msg}`),
};

// ============ PING LOGIC ============
/**
 * Gửi request đến health endpoint
 * @returns {Promise<{success: boolean, statusCode: number, message: string, duration: number}>}
 */
function pingServer(url, timeout = CONFIG.TIMEOUT_MS) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(url, { timeout }, (res) => {
      const duration = Date.now() - startTime;
      
      if (res.statusCode === 200) {
        resolve({
          success: true,
          statusCode: res.statusCode,
          message: `Server responded with 200 OK`,
          duration,
        });
      } else {
        resolve({
          success: false,
          statusCode: res.statusCode,
          message: `Unexpected status code: ${res.statusCode}`,
          duration,
        });
      }
    });

    request.on('timeout', () => {
      request.destroy();
      const duration = Date.now() - startTime;
      resolve({
        success: false,
        statusCode: 0,
        message: `Request timeout after ${timeout}ms`,
        duration,
      });
    });

    request.on('error', (error) => {
      const duration = Date.now() - startTime;
      resolve({
        success: false,
        statusCode: 0,
        message: `Request error: ${error.message}`,
        duration,
      });
    });
  });
}

/**
 * Retry logic với exponential backoff
 * @returns {Promise<{success: boolean, attempts: number, lastResult: object}>}
 */
async function pingWithRetry(url, maxRetries = CONFIG.MAX_RETRIES) {
  let lastResult = null;
  let consecutiveFailures = 0;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`Attempt ${attempt}/${maxRetries}`);
      lastResult = await pingServer(url);

      if (lastResult.success) {
        logger.success(
          `Server is alive (${lastResult.statusCode}) - ${lastResult.duration}ms - Attempt ${attempt}/${maxRetries}`
        );
        return {
          success: true,
          attempts: attempt,
          lastResult,
        };
      }

      consecutiveFailures++;
      logger.warn(`Attempt ${attempt} failed: ${lastResult.message} (${lastResult.duration}ms)`);

      // Retry với delay exponential backoff (1s, 2s, 4s)
      if (attempt < maxRetries) {
        const delayMs = Math.pow(2, attempt - 1) * 1000;
        logger.debug(`Waiting ${delayMs}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    } catch (error) {
      consecutiveFailures++;
      logger.error(`Attempt ${attempt} error: ${error.message}`);
    }
  }

  // Tất cả attempts thất bại
  logger.error(
    `❌ All ${maxRetries} attempts failed. Last error: ${lastResult?.message || 'Unknown error'}`
  );

  // Log cảnh báo nếu fail quá nhiều lần
  if (consecutiveFailures >= maxRetries) {
    logger.warn(`⚠️  ALERT: Server may be down after ${consecutiveFailures} consecutive failures`);
  }

  return {
    success: false,
    attempts: maxRetries,
    lastResult,
  };
}

// ============ MAIN ============
async function main() {
  // Nếu URL đã có /health hoặc endpoint khác, dùng luôn; nếu không, thêm /health
  const url = CONFIG.SERVER_URL.endsWith('/') 
    ? CONFIG.SERVER_URL.slice(0, -1) + CONFIG.HEALTH_ENDPOINT
    : CONFIG.SERVER_URL.includes('/health') || CONFIG.SERVER_URL.includes('/status')
    ? CONFIG.SERVER_URL
    : CONFIG.SERVER_URL + CONFIG.HEALTH_ENDPOINT;
  
  logger.log(`Starting keep-alive ping...`);
  logger.log(`Target: ${url}`);
  logger.log(`Max retries: ${CONFIG.MAX_RETRIES}`);
  logger.log(`Timeout: ${CONFIG.TIMEOUT_MS}ms`);

  const result = await pingWithRetry(url);

  // Exit code: 0 = success, 1 = failure
  process.exit(result.success ? 0 : 1);
}

// ============ RUN ============
main().catch((error) => {
  logger.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
