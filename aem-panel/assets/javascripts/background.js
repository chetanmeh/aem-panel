/** Options Initialization */
if (!localStorage.getItem('aempanel.options')) {
  localStorage.setItem('aempanel.options',
      JSON.stringify({
          user: 'admin',
          password: 'admin',
          tracerIds: 'oak-query,oak-writes',
          host: 'http://localhost:4502'
      })
  );
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'getSlingTracerJSON') {
      getSlingTracerJSON(request, sender, sendResponse)
      return true;
    }
});

function getSlingTracerJSON(request, sender, sendResponse) {
  var options = JSON.parse(localStorage.getItem('aempanel.options')),
      callback = sendResponse,
      // Handle servlet context
      url = options.host + '/system/console/tracer/' + request.requestId + '.json',
      username = options.user,
      password = options.password;

  console.log('Requesting Sling Tracer information @ ' + url);

  $.ajax({
    url: url,
    method: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    },
    success: function(d) {
      callback(d);
    }
  });
};

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    var options = JSON.parse(localStorage.getItem('aempanel.options'));

    details.requestHeaders.push({
      name: 'Sling-Tracer-Record',
      value: 'true'
    });

    details.requestHeaders.push({
      name: 'Sling-Tracers',
      value: options.tracerIds
    });

    return { requestHeaders: details.requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ['blocking', 'requestHeaders']
);
