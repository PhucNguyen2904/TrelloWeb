#!/usr/bin/env python3
"""
Keep-Alive Ping Script for Render Free Tier (Python Version)

Gửi request ping định kỳ đến FastAPI server để tránh bị sleep
Hỗ trợ retry, logging, và xử lý lỗi

Usage: python keep-alive.py <server_url> [retries] [timeout]
Ví dụ: python keep-alive.py https://your-app.onrender.com 3 10
"""

import sys
import os
import time
import requests
from datetime import datetime
from typing import Dict, Optional
from urllib.parse import urljoin

# ============ CONFIG ============
CONFIG = {
    'SERVER_URL': os.environ.get('RENDER_URL') or (sys.argv[1] if len(sys.argv) > 1 else 'https://your-render-url.onrender.com'),
    'HEALTH_ENDPOINT': '/health',
    'MAX_RETRIES': int(sys.argv[2]) if len(sys.argv) > 2 else int(os.environ.get('PING_RETRIES', 3)),
    'TIMEOUT_SECONDS': int(sys.argv[3]) if len(sys.argv) > 3 else int(os.environ.get('PING_TIMEOUT', 10)),
    'VERBOSE': os.environ.get('VERBOSE') == 'true' or '--verbose' in sys.argv,
}

# ============ LOGGING ============
class Logger:
    @staticmethod
    def _timestamp():
        return datetime.now().isoformat()

    @staticmethod
    def log(msg: str):
        print(f"[{Logger._timestamp()}] ℹ️  {msg}")

    @staticmethod
    def success(msg: str):
        print(f"[{Logger._timestamp()}] ✅ {msg}")

    @staticmethod
    def error(msg: str):
        print(f"[{Logger._timestamp()}] ❌ {msg}", file=sys.stderr)

    @staticmethod
    def warn(msg: str):
        print(f"[{Logger._timestamp()}] ⚠️  {msg}", file=sys.stderr)

    @staticmethod
    def debug(msg: str):
        if CONFIG['VERBOSE']:
            print(f"[{Logger._timestamp()}] 🔍 {msg}")

# ============ PING LOGIC ============
def ping_server(url: str, timeout: int = CONFIG['TIMEOUT_SECONDS']) -> Dict:
    """
    Gửi GET request đến health endpoint
    
    Returns:
        Dict: {success, status_code, message, duration}
    """
    start_time = time.time()
    
    try:
        response = requests.get(url, timeout=timeout)
        duration = round((time.time() - start_time) * 1000, 2)  # ms
        
        if response.status_code == 200:
            return {
                'success': True,
                'status_code': response.status_code,
                'message': 'Server responded with 200 OK',
                'duration': duration,
            }
        else:
            return {
                'success': False,
                'status_code': response.status_code,
                'message': f'Unexpected status code: {response.status_code}',
                'duration': duration,
            }
    except requests.exceptions.Timeout:
        duration = round((time.time() - start_time) * 1000, 2)
        return {
            'success': False,
            'status_code': 0,
            'message': f'Request timeout after {timeout}s',
            'duration': duration,
        }
    except requests.exceptions.RequestException as e:
        duration = round((time.time() - start_time) * 1000, 2)
        return {
            'success': False,
            'status_code': 0,
            'message': f'Request error: {str(e)}',
            'duration': duration,
        }

def ping_with_retry(url: str, max_retries: int = CONFIG['MAX_RETRIES']) -> Dict:
    """
    Retry logic với exponential backoff
    
    Returns:
        Dict: {success, attempts, last_result}
    """
    last_result = None
    consecutive_failures = 0

    for attempt in range(1, max_retries + 1):
        try:
            Logger.debug(f"Attempt {attempt}/{max_retries}")
            last_result = ping_server(url)

            if last_result['success']:
                Logger.success(
                    f"Server is alive ({last_result['status_code']}) - "
                    f"{last_result['duration']}ms - Attempt {attempt}/{max_retries}"
                )
                return {
                    'success': True,
                    'attempts': attempt,
                    'last_result': last_result,
                }

            consecutive_failures += 1
            Logger.warn(
                f"Attempt {attempt} failed: {last_result['message']} "
                f"({last_result['duration']}ms)"
            )

            # Retry với delay exponential backoff (1s, 2s, 4s)
            if attempt < max_retries:
                delay_seconds = 2 ** (attempt - 1)
                Logger.debug(f"Waiting {delay_seconds}s before retry...")
                time.sleep(delay_seconds)

        except Exception as e:
            consecutive_failures += 1
            Logger.error(f"Attempt {attempt} error: {str(e)}")

    # Tất cả attempts thất bại
    Logger.error(
        f"❌ All {max_retries} attempts failed. "
        f"Last error: {last_result['message'] if last_result else 'Unknown error'}"
    )

    # Log cảnh báo nếu fail quá nhiều lần
    if consecutive_failures >= max_retries:
        Logger.warn(
            f"⚠️  ALERT: Server may be down after {consecutive_failures} consecutive failures"
        )

    return {
        'success': False,
        'attempts': max_retries,
        'last_result': last_result,
    }

# ============ MAIN ============
# ============ MAIN ============
def main():
    # Nếu URL đã có /health hoặc endpoint khác, dùng luôn; nếu không, thêm /health
    if CONFIG['SERVER_URL'].endswith('/'):
        url = CONFIG['SERVER_URL'].rstrip('/') + CONFIG['HEALTH_ENDPOINT']
    elif '/health' in CONFIG['SERVER_URL'] or '/status' in CONFIG['SERVER_URL']:
        url = CONFIG['SERVER_URL']
    else:
        url = CONFIG['SERVER_URL'] + CONFIG['HEALTH_ENDPOINT']
    
    Logger.log("Starting keep-alive ping...")
    Logger.log(f"Target: {url}")
    Logger.log(f"Max retries: {CONFIG['MAX_RETRIES']}")
    Logger.log(f"Timeout: {CONFIG['TIMEOUT_SECONDS']}s")

    result = ping_with_retry(url)

    # Exit code: 0 = success, 1 = failure
    sys.exit(0 if result['success'] else 1)

if __name__ == '__main__':
    main()
