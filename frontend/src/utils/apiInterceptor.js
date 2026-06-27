// Global Fetch Interceptor for AuraStore
// This file intercepts all fetch requests, injects auth headers, logs requests, and simulates network states.

const originalFetch = window.fetch;

// Event listeners to update UI logs
const logListeners = new Set();
let requestLogs = [];

// Get configuration options from localStorage (persisted between reloads)
export const getInterceptorConfig = () => {
  return {
    injectAuth: localStorage.getItem('interceptor_inject_auth') !== 'false', // default true
    slowNetwork: localStorage.getItem('interceptor_slow_network') === 'true', // default false
    simulate401: localStorage.getItem('interceptor_simulate_401') === 'true', // default false
    logRequests: localStorage.getItem('interceptor_log_requests') !== 'false', // default true
  };
};

export const updateInterceptorConfig = (key, value) => {
  localStorage.setItem(`interceptor_${key}`, value);
  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('interceptor-config-changed'));
};

const notifyListeners = () => {
  const currentLogs = [...requestLogs];
  logListeners.forEach(listener => listener(currentLogs));
};

export const subscribeToLogs = (listener) => {
  logListeners.add(listener);
  listener([...requestLogs]);
  return () => {
    logListeners.delete(listener);
  };
};

export const clearInterceptorLogs = () => {
  requestLogs = [];
  notifyListeners();
};

// Monkey-patch window.fetch
window.fetch = async function (input, init = {}) {
  const startTime = Date.now();
  const config = getInterceptorConfig();
  
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (input instanceof URL) {
    url = input.href;
  } else if (input && typeof input === 'object' && input.url) {
    url = input.url;
  }

  // Define API base URL if not absolute
  const backendBaseUrl = 'http://localhost:5000';
  let targetUrl = url;
  
  if (url.startsWith('/api/')) {
    targetUrl = `${backendBaseUrl}${url}`;
  }

  // Create deep copy/initialization of init object
  const options = { ...init };
  options.headers = options.headers ? { ...options.headers } : {};

  // 1. Auto-inject Auth Header if enabled
  if (config.injectAuth) {
    const savedUser = localStorage.getItem('aurastore_session_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user && user.id) {
          options.headers['Authorization'] = `Bearer ${user.id}`;
          options.headers['X-Authenticated-User-Email'] = user.email;
        }
      } catch (e) {
        console.error('[Interceptor] Error parsing session user for Auth header', e);
      }
    }
  }

  const method = options.method || 'GET';
  const timestamp = new Date().toLocaleTimeString();
  const logId = Math.random().toString(36).substring(2, 9);

  // Helper to append a new log entry
  const addLogEntry = (status, responseBody, errorMessage = null) => {
    if (!config.logRequests) return;

    let parsedRequestBody = null;
    if (options.body) {
      try {
        parsedRequestBody = JSON.parse(options.body);
      } catch {
        parsedRequestBody = options.body;
      }
    }

    const duration = Date.now() - startTime;
    const newLog = {
      id: logId,
      timestamp,
      url: targetUrl,
      method,
      headers: { ...options.headers },
      requestBody: parsedRequestBody,
      status,
      responseBody,
      error: errorMessage,
      duration
    };

    // Keep log size reasonable (max 100 entries)
    requestLogs = [newLog, ...requestLogs].slice(0, 100);
    notifyListeners();
  };

  // 2. Simulate Slow Network
  if (config.slowNetwork) {
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // 3. Simulate 401 Unauthorized Response
  if (config.simulate401 && targetUrl.includes('/api/')) {
    const mockResponseBody = {
      success: false,
      message: 'Token expired. [Simulated 401 Unauthorized via Interceptor]'
    };
    
    // Log the intercepted request
    addLogEntry(401, mockResponseBody, 'Unauthorized (Simulated)');

    // Trigger auth logout & login modal event
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('auth-unauthorized', { detail: mockResponseBody.message }));
    }, 200);

    return new Response(JSON.stringify(mockResponseBody), {
      status: 401,
      statusText: 'Unauthorized',
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 4. Perform the actual network request
  try {
    // If input was a Request object, we recreate it with updated targetUrl and options
    let fetchTarget = targetUrl;
    if (input instanceof Request) {
      fetchTarget = new Request(targetUrl, options);
    }

    const response = await originalFetch(fetchTarget, options);

    // Clone the response so we can read the body without consuming it
    const responseClone = response.clone();
    
    let responseData = null;
    const contentType = responseClone.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await responseClone.json();
      } catch {
        responseData = '[Error parsing JSON response]';
      }
    } else {
      try {
        responseData = await responseClone.text();
      } catch {
        responseData = '[Non-JSON response]';
      }
    }

    // Handle 401 globally
    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('auth-unauthorized', { 
        detail: responseData?.message || 'Session expired. Please log in again.' 
      }));
    }

    addLogEntry(response.status, responseData);
    return response;
  } catch (error) {
    console.error('[Interceptor] Fetch error:', error);
    addLogEntry('FAILED', null, error.message);
    throw error;
  }
};
