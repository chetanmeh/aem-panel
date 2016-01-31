/**
 * Listen for Requests in the current window and process them accordingly.
 **/

var requests = {
  bindListener: function(scope) {

    chrome.devtools.network.onRequestFinished.addListener(function(chromeRequest) {
      var httpTransaction = createHTTPTransaction(chromeRequest);

      if (httpTransaction.key) {
        // TODO update w servlet context
        url = '/system/console/tracer/' + httpTransaction.key + '.json'

        if (chrome && chrome.runtime) {
          chrome.runtime.sendMessage({
              action: 'getSlingTracerJSON',
              url: url
            },
            function(data) {
              data = sampleJSON;
              panel.addData(httpTransaction, data, scope);
              //$('.data-container').scrollTop(100000000);
            }
          );
        } else {
          panel.addData(httpTransaction, sampleJSON, scope);
        }
      }
    });
  }
};


var createHTTPTransaction = function(request) {
  var httpTransaction, requestId;

  requestId = request.response.headers.find(function(x) {
    if (x.name.toLowerCase() === 'sling-tracer-request-id') {
      return x.value;
    }
  });

  requestId = (new Date()).getTime() + '';

  // initialize the httpTransaction w the Chrome Request/Response object
  httpTransaction = request;

  // set specifics attributes
  httpTransaction.key = requestId;

  console.log(httpTransaction);
  return httpTransaction;
};

var sampleJSON = {
method: "POST",
logs: [
" 0 TIMER_START{Request Processing} ",
" 0 COMMENT timer_end format is {<elapsed msec>,<timer name>} <optional message> ",
" 1 LOG Method=POST, PathInfo=/content/dam/ ",
" 1 TIMER_START{ResourceResolution} ",
" 1 TIMER_END{0,ResourceResolution} URI=/content/dam/ resolves to Resource=JcrNodeResource, type=sling:Folder, superType=null, path=/content/dam ",
" 1 LOG Resource Path Info: SlingRequestPathInfo: path='/content/dam', selectorString='null', extension='null', suffix='/' ",
" 1 TIMER_START{ServletResolution} ",
" 1 TIMER_START{resolveServlet(JcrNodeResource, type=sling:Folder, superType=null, path=/content/dam)} ",
" 2 TIMER_END{1,resolveServlet(JcrNodeResource, type=sling:Folder, superType=null, path=/content/dam)} Using servlet org.apache.sling.servlets.post.impl.SlingPostServlet ",
" 2 TIMER_END{1,ServletResolution} URI=/content/dam/ handled by Servlet=org.apache.sling.servlets.post.impl.SlingPostServlet ",
" 2 LOG Applying Requestfilters ",
" 2 LOG Calling filter: org.apache.sling.bgservlets.impl.BackgroundServletStarterFilter ",
" 2 LOG Calling filter: com.adobe.granite.rest.impl.servlet.ApiResourceFilter ",
" 2 LOG Calling filter: com.adobe.granite.httpcache.impl.InnerCacheFilter ",
" 2 LOG Calling filter: org.apache.sling.rewriter.impl.RewriterFilter ",
" 2 LOG Calling filter: com.adobe.granite.optout.impl.OptOutFilter ",
" 2 LOG Calling filter: org.apache.sling.engine.impl.debug.RequestProgressTrackerLogFilter ",
" 2 LOG Calling filter: org.apache.sling.tracer.internal.LogTracer$SlingTracerFilter ",
" 9 LOG Calling filter: org.apache.sling.i18n.impl.I18NFilter ",
" 9 LOG Calling filter: org.apache.sling.security.impl.ContentDispositionFilter ",
" 9 LOG Calling filter: com.adobe.granite.csrf.impl.CSRFFilter ",
" 9 LOG Calling filter: com.adobe.granite.requests.logging.impl.RequestLoggerImpl ",
" 9 LOG Applying Componentfilters ",
" 9 TIMER_START{org.apache.sling.servlets.post.impl.SlingPostServlet#0} ",
" 9 LOG Calling PostOperation: org.apache.sling.servlets.post.impl.operations.ModifyOperation ",
" 15 TIMER_END{6,org.apache.sling.servlets.post.impl.SlingPostServlet#0} ",
" 20 TIMER_END{20,Request Processing} Request Processing ",
" 20 LOG Filter timing: filter=com.adobe.granite.requests.logging.impl.RequestLoggerImpl, inner=6, total=6, outer=0 ",
" 20 LOG Filter timing: filter=com.adobe.granite.csrf.impl.CSRFFilter, inner=6, total=6, outer=0 ",
" 20 LOG Filter timing: filter=org.apache.sling.security.impl.ContentDispositionFilter, inner=6, total=6, outer=0 ",
" 20 LOG Filter timing: filter=org.apache.sling.i18n.impl.I18NFilter, inner=6, total=6, outer=0 ",
" 20 LOG Filter timing: filter=org.apache.sling.tracer.internal.LogTracer$SlingTracerFilter, inner=6, total=18, outer=12 ",
" 20 LOG Filter timing: filter=org.apache.sling.engine.impl.debug.RequestProgressTrackerLogFilter, inner=18, total=18, outer=0 ",
" 20 LOG Filter timing: filter=com.adobe.granite.optout.impl.OptOutFilter, inner=18, total=18, outer=0 ",
" 20 LOG Filter timing: filter=org.apache.sling.rewriter.impl.RewriterFilter, inner=18, total=18, outer=0 ",
" 20 LOG Filter timing: filter=com.adobe.granite.httpcache.impl.InnerCacheFilter, inner=18, total=18, outer=0 ",
" 20 LOG Filter timing: filter=com.adobe.granite.rest.impl.servlet.ApiResourceFilter, inner=18, total=18, outer=0 "
],
queries: [ ]
};
