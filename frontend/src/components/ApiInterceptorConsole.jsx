import React, { useState, useEffect } from 'react';
import { 
  getInterceptorConfig, 
  updateInterceptorConfig, 
  subscribeToLogs, 
  clearInterceptorLogs 
} from '../utils/apiInterceptor';

export default function ApiInterceptorConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [config, setConfig] = useState(getInterceptorConfig());
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [activeTab, setActiveTab] = useState('response'); // response | request | headers

  useEffect(() => {
    // Subscribe to logs updates
    const unsubscribe = subscribeToLogs((newLogs) => {
      setLogs(newLogs);
    });

    // Listen to config changes
    const handleConfigChange = () => {
      setConfig(getInterceptorConfig());
    };
    window.addEventListener('interceptor-config-changed', handleConfigChange);

    return () => {
      unsubscribe();
      window.removeEventListener('interceptor-config-changed', handleConfigChange);
    };
  }, []);

  const handleToggle = (key) => {
    const newValue = !config[key];
    updateInterceptorConfig(key, newValue);
  };

  const getStatusColor = (status) => {
    if (status === 200 || status === 201) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (status === 401 || status === 403) return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
    if (status === 'FAILED') return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
    return 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20';
  };

  const getMethodColor = (method) => {
    if (method === 'GET') return 'text-sky-400 font-bold';
    if (method === 'POST') return 'text-indigo-400 font-bold';
    if (method === 'PUT') return 'text-amber-400 font-bold';
    if (method === 'DELETE') return 'text-rose-400 font-bold';
    return 'text-zinc-400 font-bold';
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-zinc-950/90 text-amber-400 border border-amber-500/30 hover:border-amber-400 shadow-[0_4px_20px_rgba(0,0,0,0.4),0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.5),0_0_25px_rgba(212,175,55,0.25)] hover:scale-105 backdrop-blur-md px-4 py-3 rounded-full flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        API Console
      </button>

      {/* Side Panel Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[480px] bg-zinc-950/95 border-l border-zinc-800 shadow-2xl backdrop-blur-xl transform transition-transform duration-300 flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel Header */}
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div>
            <span className="text-[0.6rem] tracking-[0.3em] text-amber-400 uppercase font-semibold block mb-1">Developer Utilities</span>
            <h2 className="text-sm font-serif tracking-widest text-white uppercase font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
                <line x1="6" y1="6" x2="6.01" y2="6"></line>
                <line x1="6" y1="18" x2="6.01" y2="18"></line>
              </svg>
              API Interceptor Console
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-white bg-zinc-800/40 hover:bg-zinc-800 border border-zinc-800 p-2 rounded-full transition-all cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Configuration Toggles */}
        <div className="p-6 border-b border-zinc-900 bg-zinc-900/20 space-y-4">
          <h3 className="text-[0.65rem] font-semibold tracking-wider text-zinc-500 uppercase">Simulator Settings</h3>
          
          <div className="grid grid-cols-1 gap-3.5">
            {/* Toggle 1: Auto-inject Auth */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800/40">
              <div>
                <span className="text-xs font-bold text-white block">Auto-inject Auth Headers</span>
                <span className="text-[0.65rem] text-zinc-500 font-light mt-0.5 block">Attaches Bearer auth token if user is signed in</span>
              </div>
              <button
                onClick={() => handleToggle('injectAuth')}
                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  config.injectAuth ? 'bg-indigo-600' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    config.injectAuth ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Simulate Slow Network */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800/40">
              <div>
                <span className="text-xs font-bold text-white block">Simulate Slow Network</span>
                <span className="text-[0.65rem] text-zinc-500 font-light mt-0.5 block">Injects artificial 1.5s latency to all requests</span>
              </div>
              <button
                onClick={() => handleToggle('slowNetwork')}
                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  config.slowNetwork ? 'bg-amber-500' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    config.slowNetwork ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Force Auth Expiry */}
            <div className="flex items-center justify-between p-3.5 bg-zinc-900/60 rounded-xl border border-zinc-800/40">
              <div>
                <span className="text-xs font-bold text-white block">Force Session Expiry (Simulate 401)</span>
                <span className="text-[0.65rem] text-zinc-500 font-light mt-0.5 block">Forces all API fetches to reject with 401 Unauthorized</span>
              </div>
              <button
                onClick={() => handleToggle('simulate401')}
                className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
                  config.simulate401 ? 'bg-rose-600' : 'bg-zinc-700'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    config.simulate401 ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Logs List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-[0.65rem] font-semibold tracking-wider text-zinc-500 uppercase">
              Intercepted Network Logs ({logs.length})
            </h3>
            {logs.length > 0 && (
              <button
                onClick={clearInterceptorLogs}
                className="text-[0.65rem] font-bold text-amber-500 hover:text-amber-400 uppercase tracking-widest transition-colors cursor-pointer"
              >
                Clear Logs
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800/60 rounded-2xl p-6">
              <svg className="w-8 h-8 text-zinc-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <h4 className="text-xs font-bold text-zinc-400 mb-1">No API Requests Logged Yet</h4>
              <p className="text-zinc-600 text-[0.65rem] max-w-[240px] mx-auto">
                Trigger some network requests (e.g. sign in, checkout, subscribe, reload) to see interceptor in action.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                const pathName = log.url.replace('http://localhost:5000', '');

                return (
                  <div
                    key={log.id}
                    className={`bg-zinc-900 border transition-all duration-300 rounded-xl overflow-hidden ${
                      isExpanded ? 'border-zinc-700 shadow-lg' : 'border-zinc-800/60 hover:border-zinc-800'
                    }`}
                  >
                    {/* Collapsed Header Bar */}
                    <div
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-zinc-800/30 transition-all select-none"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className={`text-[0.65rem] px-2 py-0.5 rounded-full font-semibold ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                        <span className={`text-xs ${getMethodColor(log.method)}`}>{log.method}</span>
                        <span className="text-xs font-mono text-zinc-300 truncate tracking-tight max-w-[180px]" title={log.url}>
                          {pathName}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[0.65rem] text-zinc-500 font-light flex-shrink-0">
                        <span>{log.duration}ms</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-400' : 'text-zinc-600'}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Content Panel */}
                    {isExpanded && (
                      <div className="border-t border-zinc-800 bg-zinc-950 p-4">
                        {/* Tabs Bar */}
                        <div className="flex gap-2 border-b border-zinc-900 pb-2 mb-3 text-[0.65rem] font-bold uppercase tracking-wider">
                          <button
                            onClick={() => setActiveTab('response')}
                            className={`pb-1 border-b-2 transition-all cursor-pointer ${
                              activeTab === 'response' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Response
                          </button>
                          <button
                            onClick={() => setActiveTab('request')}
                            className={`pb-1 border-b-2 transition-all cursor-pointer ${
                              activeTab === 'request' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Request Body
                          </button>
                          <button
                            onClick={() => setActiveTab('headers')}
                            className={`pb-1 border-b-2 transition-all cursor-pointer ${
                              activeTab === 'headers' ? 'border-amber-400 text-amber-400' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                            }`}
                          >
                            Headers
                          </button>
                        </div>

                        {/* Tab Content Panels */}
                        <div className="max-h-[220px] overflow-y-auto rounded-lg bg-zinc-900/40 border border-zinc-900 p-3 font-mono text-[0.65rem] text-zinc-300">
                          {activeTab === 'response' && (
                            log.responseBody ? (
                              <pre className="whitespace-pre-wrap word-break-all text-emerald-300/90">
                                {JSON.stringify(log.responseBody, null, 2)}
                              </pre>
                            ) : log.error ? (
                              <pre className="whitespace-pre-wrap text-rose-400">{log.error}</pre>
                            ) : (
                              <span className="text-zinc-500 italic">No response body content available</span>
                            )
                          )}

                          {activeTab === 'request' && (
                            log.requestBody ? (
                              <pre className="whitespace-pre-wrap word-break-all text-indigo-300/90">
                                {JSON.stringify(log.requestBody, null, 2)}
                              </pre>
                            ) : (
                              <span className="text-zinc-500 italic">No request body sent (GET / Empty payload)</span>
                            )
                          )}

                          {activeTab === 'headers' && (
                            Object.keys(log.headers).length > 0 ? (
                              <div className="space-y-1">
                                {Object.entries(log.headers).map(([key, val]) => (
                                  <div key={key} className="flex flex-col sm:flex-row justify-between border-b border-zinc-900 pb-1 gap-1">
                                    <span className="text-amber-400/80 font-bold shrink-0">{key}:</span>
                                    <span className="text-zinc-400 break-all text-right font-light">{val}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-zinc-500 italic">No headers customized on this request</span>
                            )
                          )}
                        </div>

                        <div className="mt-3 flex justify-between items-center text-[0.55rem] text-zinc-500 font-light">
                          <span>Timestamp: {log.timestamp}</span>
                          <span>Logs ID: {log.id}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Panel Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-900/30 flex justify-between items-center">
          <div className="text-[0.6rem] text-zinc-500 font-light">
            Press <code className="bg-zinc-800 text-zinc-300 px-1 py-0.5 rounded font-mono">ESC</code> to exit panel.
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="px-5 py-2 border border-zinc-800 hover:border-zinc-700 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer"
          >
            Close Panel
          </button>
        </div>
      </div>

      {/* Panel Backdrop Closer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-[2.5px] z-40"
        />
      )}
    </>
  );
}
