/** Options Initialization */
var tracer = (function(global){
    var tabCount = 0;
    var listenerRegistered = false;
    var tabs = {};
    var api ={};
    var activationCallback;
    var deactivationCallback;

    api.registerTab = function(tabId){
        console.assert(tabId != undefined);
        tabs[tabId] = true;
        tabCount++;
        tabCountChanged();
        console.log("Registered tab " + tabId)
    };

    api.unregisterTab = function(tabId){
        delete tabs[tabId];
        tabCount--;
        tabCountChanged();
        console.log("Unregisterd " + tabId)
    };

    api.shouldInjectHeaders = function(tabId) {
        return tabs.hasOwnProperty(tabId)
    };

    api.registerListener = function (activate, deactivate) {
        activationCallback = activate;
        deactivationCallback = deactivate;
    };

    var tabCountChanged = function () {
        if (tabCount <= 0 && deactivationCallback != undefined && listenerRegistered){
            deactivationCallback();
            listenerRegistered = false;
        } else if (tabCount > 0 && activationCallback != undefined && !listenerRegistered){
            activationCallback();
            listenerRegistered = true;
        }
    };

    return api;
}(this));

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

chrome.runtime.onConnect.addListener(function(port) {
    console.assert(port.name == "aem-panel");
    var tabId;
    port.onMessage.addListener(function(msg) {
        var action = msg.action
        if (action === "register"){
            tabId = msg.tabId;
            tracer.registerTab(tabId);
        }
    });

    port.onDisconnect.addListener(function(msg){
        if (tabId != undefined) {
            tracer.unregisterTab(tabId)
        }
    });
});

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

var injectHeaderListener = function (details) {
  var options = JSON.parse(localStorage.getItem('aempanel.options'));
  if (tracer.shouldInjectHeaders(details.tabId)) {
    details.requestHeaders.push({
      name: 'Sling-Tracer-Record',
      value: 'true'
    });

    details.requestHeaders.push({
      name: 'Sling-Tracers',
      value: options.tracerIds
    });
  }

  return {requestHeaders: details.requestHeaders};
};

tracer.registerListener(/*activate*/ function () {
    chrome.webRequest.onBeforeSendHeaders.addListener(injectHeaderListener,
      {urls: ["<all_urls>"]},
      ['blocking', 'requestHeaders']
    );
    console.log("Registered the Sling Header injecting listener");
  },
  /*deactivate*/ function () {
    chrome.webRequest.onBeforeSendHeaders.removeListener(injectHeaderListener);
    console.log("Removed the Sling Header injecting listener");
  }
);