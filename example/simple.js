
var http = require('http'),
    httpProxy = require('http-proxy'),
    HttpProxyRules = require('../');

module.exports = function spawnReverseProxy(cb) {

  // Set up proxy rules object
  var proxyRules = new HttpProxyRules({
    rules: {
      '.*/test': 'http://localhost:8080/cool',
      '.*/test2/': 'http://localhost:8080/cool2/'
    },
    default: 'http://localhost:8080'
  });

  // Create reverse proxy instance
  var proxy = httpProxy.createProxy();

  // Create http server that leverages reverse proxy instance
  // and proxy rules to proxy requests to different targets
  http.createServer(function(req, res) {

    var target;
    if (target = proxyRules.test(req)) {
      return proxy.web(req, res, {
        target: target
      });
    }

    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('The request url and path did not match any of the listed rules!');
  }).listen(6010, cb);

};