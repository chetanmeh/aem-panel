chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'getSlingTracerJSON') {
      getSlingTracerJSON(request, sender, sendResponse)
      return true;
    }
});

function getSlingTracerJSON(request, sender, sendResponse){
  var callback = sendResponse;

  console.log('Requesting Sling Tracer information for ' + request.url);

  $.ajax({
    url: request.url,
    method: 'GET',
    success: function(d) {
      callback(d);
    }
  });
}
