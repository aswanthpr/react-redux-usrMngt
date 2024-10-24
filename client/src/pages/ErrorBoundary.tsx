import React, { useState, useEffect } from 'react';

// Fallback component to display when an error is caught
const FallbackUI = () => (
  <div style={{ textAlign: 'center', padding: '20px', fontSize: '18px' }}>
    <h2>Something went wrong. Please try again later.</h2>
  </div>
);

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  // Error boundary lifecycle methods (mimicking componentDidCatch)
  const handleError = (error: Error) => {
    console.error('Caught error: ', error);
    setHasError(true);
  };

  useEffect(() => {
    const errorListener = (error: ErrorEvent) => {
      handleError(error.error);
    };

    const unhandledRejectionListener = (event: PromiseRejectionEvent) => {
      handleError(event.reason);
    };

    // Adding event listeners for both errors and unhandled rejections
    window.addEventListener('error', errorListener);
    window.addEventListener('unhandledrejection', unhandledRejectionListener);

    // Cleanup listeners when the component unmounts
    return () => {
      window.removeEventListener('error', errorListener);
      window.removeEventListener('unhandledrejection', unhandledRejectionListener);
    };
  }, []);

  if (hasError) {
    return <FallbackUI />;
  }

  return <>{children}</>;
};

export default ErrorBoundary;
