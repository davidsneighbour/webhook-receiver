/**
 * Implements exponential backoff retry logic
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @param {number} delay - Base delay between retries in milliseconds
 * @returns {Promise<any>} - The result of the function
 */
export async function withRetry(fn, maxRetries, delay) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await new Promise(resolve => 
          setTimeout(resolve, delay * Math.pow(2, attempt))
        );
      }
    }
  }

  throw lastError;
}