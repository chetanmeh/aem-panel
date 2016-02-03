chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'getSlingTracerJSON') {
      getSlingTracerJSON(request, sender, sendResponse)
      return true;
    }
});

function getSlingTracerJSON(request, sender, sendResponse) {
  var callback = sendResponse,
      // Handle servlet context
      url = 'http://localhost:4502/system/console/tracer/' + request.requestId + '.json',
      username = 'admin',
      password = 'admin';

  console.log('Requesting Sling Tracer information @ ' + url);

  $.ajax({
    url: url,
    method: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + btoa(username + ":" + password));
    },
    success: function(d) {
      console.log(d);
      callback(d);
    }
  });
};

chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        var redirectUrl = details.url;

        if (details.url.indexOf('tracers=') !== -1) {
          return;
        }

        // Only add for HTML files
        if (details.url.match(/.html/m)) {
          if (details.url.indexOf('?') === -1) {
            redirectUrl += '?tracers=oak-writes';
          } else {
            redirectUrl += '&tracers=oak-writes';
          }

          return { redirectUrl: redirectUrl };
        }
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    if (details.url.match(/.html/m)) {
      details.requestHeaders.push({
        name: 'Sling-Tracer-Record',
        value: 'true'
      });
      return { requestHeaders: details.requestHeaders };
    }
  },
  { urls: ["<all_urls>"] },
  ['blocking', 'requestHeaders']
);
