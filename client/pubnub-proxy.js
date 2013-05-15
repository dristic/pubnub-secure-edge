/*
 * DOMParser HTML extension
 * 2012-09-04
 * 
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */
 
/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/
 
(function(DOMParser) {
    "use strict";
 
    var
      DOMParser_proto = DOMParser.prototype
    , real_parseFromString = DOMParser_proto.parseFromString
    ;
 
    // Firefox/Opera/IE throw errors on unsupported types
    try {
        // WebKit returns null on unsupported types
        if ((new DOMParser).parseFromString("", "text/html")) {
            // text/html parsing is natively supported
            return;
        }
    } catch (ex) {}
 
    DOMParser_proto.parseFromString = function(markup, type) {
        if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
            var doc = document.documentElement.cloneNode();
                if (markup.toLowerCase().indexOf('<!doctype') > -1) {
                    doc.innerHTML = markup;
                }
                else {
                    doc.innerHTML = "<!DOCTYPE html><html>"
                      + "<head><title></title></head>"
                      + "<body>" + markup + "</body>"
                      + "</html>";
                }
            return doc;
        } else {
            return real_parseFromString.apply(this, arguments);
        }
    };
}(DOMParser));

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

      console.log("connecting...");
      this.connection.subscribe({
        channel: this.uuid,
        callback: this.handleResponse,
        connect: onConnect
      });
    }

    PubNubProxy.prototype.handleResponse = function (message) {
      console.log('response', message);

      if (message.html) {
        var parser = new DOMParser();
        var element = parser.parseFromString("<div>" + message.html + "</div>", 'text/html');

        console.log(element);

        document.replaceChild(element, document.documentElement);
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
      console.log(arguments);

      return proxy.sendRequest(arguments[1], arguments[0]);
    }

  }).call(window, window);
});
