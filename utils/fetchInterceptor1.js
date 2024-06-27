(() => {
  if (window.stashListener) return;

  const { fetch: originalFetch } = window;
  const stashListener = new EventTarget();

  window.fetch = async (...args) => {
    let [resource, config] = args;
    const response = await originalFetch(resource, config);
    const contentType = response.headers.get('content-type');

    if (typeof resource === 'string'
      && contentType
      && contentType.indexOf('application/json') !== -1
      && resource.endsWith('/graphql')) {
      try {
        const data = await response.clone().json();
        console.log('Dispatching response event:', data);
        stashListener.dispatchEvent(new CustomEvent('response', { detail: data }));

        if (data.data.configuration) {
          stashListener.dispatchEvent(new CustomEvent('configuration', { detail: data.data.configuration }));
        }
      }
      catch (e) {
        console.error('Error parsing JSON:', e);
      }
    }
    return response;
  };
  
  window.stashListener = stashListener;
})();