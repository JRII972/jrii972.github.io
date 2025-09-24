import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import logsManager from '../../core/state/LogManager.js';

const LogContext = createContext({ logs: [], push: () => {}, clear: () => {} });

export function LogProvider({ children, max = 200 }) {
  const [logs, setLogs] = useState([]);

  const push = useCallback((line) => {
    setLogs(prev => {
      const next = [...prev, line];
      if (next.length > max) next.splice(0, next.length - max);
      return next;
    });
  }, [max]);

  const clear = useCallback(() => setLogs([]), []);

  useEffect(() => {
    const unsub = logsManager.subscribe(push);
    return unsub;
  }, [push]);

  return (
    <LogContext.Provider value={{ logs, push, clear }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs(){
  return useContext(LogContext);
}

export default LogContext;
