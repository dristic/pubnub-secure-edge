document.addEventListener('DOMContentLoaded', function (event) {
  (function (window) {
    var METHOD = {
      GET: "GET",
      POST: "POST",
      PUT: "PUT",
      DELETE: "DELETE"
    };

    /////
    // PubNub Proxy Class
    ///////
    function PubNubProxy(connection, uuid, onConnect) {
      this.connection = connection;
      this.uuid = uuid;

      this.connection.subscribe({
        channel: this.uuid,
        callback: this.handleResponse,
        connect: onConnect
      });
    }

    PubNubProxy.prototype.handleResponse = function (message) {
      console.log('response', message);

      if (message.html) {
        var div = document.createElement('div');
        div.innerHTML = message.html;
        var elements = div.childNodes;

        var htmlEl = document.querySelector('html');
        htmlEl.parentNode.replaceChild(elements, htmlEl);
      }
    };

    PubNubProxy.prototype.sendRequest = function (url, method) {
      var request = {
        response_channel: this.uuid,
        request: {
          url: url,
          method: method
        }
      }

      console.log('sending');
      this.connection.publish({
        channel: 'server',
        message: request
      });
    };

    // Initialize the PubNub connection.
    this.pubnub = PUBNUB.init({
      subscribe_key: "sub-c-fe7719da-bd85-11e2-8f85-02ee2ddab7fe",
      publish_key: "pub-c-f73c9874-8d1e-4356-8ad2-e63ebb9d5cc7",
      uuid: 'client'
    });

    // Initialize the proxy object.
    this.proxy = new PubNubProxy(this.pubnub, 'client', function () {
      // Call the first page request.
      proxy.sendRequest(window.location.href, METHOD.GET);
    });

    window.XMLHttpRequest.prototype.open = function () {

    }

  }).call(window, window);
});
