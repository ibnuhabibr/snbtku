import { useState, useEffect, useRef } from 'react';

/**
 * Hook for using Web Workers with TypeScript support
 * 
 * @param workerPath Path to the worker script
 * @returns Methods for communicating with the worker
 */
export function useWebWorker<TData, TResult>(workerPath: string) {
  const [result, setResult] = useState<TResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Use a ref for the worker to avoid recreating it on each render
  const workerRef = useRef<Worker | null>(null);
  
  // Initialize worker
  useEffect(() => {
    // Create worker only if it doesn't exist
    if (!workerRef.current && typeof window !== 'undefined') {
      try {
        workerRef.current = new Worker(workerPath);
        
        // Set up message handler
        workerRef.current.onmessage = (event: MessageEvent) => {
          const { data, error } = event.data;
          
          if (error) {
            setError(new Error(error));
            setIsLoading(false);
            return;
          }
          
          // Process result based on message type
          setResult(data);
          setIsLoading(false);
        };
        
        // Set up error handler
        workerRef.current.onerror = (event: ErrorEvent) => {
          setError(new Error(`Worker error: ${event.message}`));
          setIsLoading(false);
        };
      } catch (err) {
        console.error('Failed to create Web Worker:', err);
        setError(err instanceof Error ? err : new Error('Failed to create Web Worker'));
      }
    }
    
    // Clean up worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [workerPath]);
  
  // Function to send messages to the worker
  const sendMessage = (type: string, data: TData) => {
    if (!workerRef.current) {
      setError(new Error('Worker not initialized'));
      return;
    }
    
    // Reset state
    setIsLoading(true);
    setError(null);
    
    // Send message to worker
    workerRef.current.postMessage({ type, data });
  };
  
  return {
    result,
    error,
    isLoading,
    sendMessage,
  };
}

/**
 * Custom hook for IRT calculations using Web Worker
 */
export function useIRTCalculations() {
  const {
    result: irtResult,
    error: irtError,
    isLoading: isCalculating,
    sendMessage
  } = useWebWorker<any, any>('/workers/irt-worker.js');
  
  // Calculate IRT score
  const calculateScore = (responses: number[], questionParams: any[]) => {
    sendMessage('calculate_irt_score', { responses, questionParams });
  };
  
  // Generate recommendations
  const generateRecommendations = (responses: number[], questionParams: any[], topics: string[]) => {
    sendMessage('generate_recommendations', { responses, questionParams, topics });
  };
  
  return {
    irtResult,
    irtError,
    isCalculating,
    calculateScore,
    generateRecommendations
  };
}
