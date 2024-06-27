function waitForClass(className, callback) {
  const checkInterval = 100; // ms
  const maxRetries = 30; // Timeout after 3 seconds
  let retryCount = 0;

  const intervalId = setInterval(() => {
    const elements = document.getElementsByClassName(className);
    if (elements.length > 0) {
      clearInterval(intervalId);
      callback();
    } else if (retryCount >= maxRetries) {
      clearInterval(intervalId);
      console.info(`Element with class ${className} not found within timeout period`);
    }
    retryCount++;
  }, checkInterval);
}