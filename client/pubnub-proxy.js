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
    "use strict";
    
    var METHOD = {
      GET: "GET",
      POST: "POST",
      PUT: "PUT",
      DELETE: "DELETE"
    };

    /////
    // PubNub Proxy Class
    ///////
    function PubNubProxy(options) {
      this.connection = options.connection;
      this.uuid = options.uuid || this.connection.uuid();

      if (options.intercept_ajax === true) {
        this.interceptAjax();
      }

      console.log("connecting...");
      this.connection.subscribe({
        channel: this.uuid,
        callback: this.handleResponse,
        connect: options.callback
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

    PubNubProxy.prototype.interceptAjax = function () {
      var open = XMLHttpRequest.prototype.open,
          self = this;
      XMLHttpRequest.prototype.open = function (method, url) {
        if (/pubnub/ig.test(url) == true) {
          return open.apply(this, arguments);
        } else {
          return self.sendRequest(url, method);
        }
      }
    }

    PubNubProxy.prototype.destroy = function() {
      this.connection.unsubscribe({
        channel: this.uuid
      });

      delete this.connection;
      delete this.uuid;
    };

    // Initialize the PubNub connection.
    this.pubnub = PUBNUB.init({
      subscribe_key: "sub-c-fe7719da-bd85-11e2-8f85-02ee2ddab7fe",
      publish_key: "pub-c-f73c9874-8d1e-4356-8ad2-e63ebb9d5cc7",
      uuid: 'client'
    });

    // Initialize the proxy object.
    this.proxy = new PubNubProxy({
      connection: this.pubnub, 
      uuid: 'client', 
      intercept_ajax: true,
      callback: function () {
        // Call the first page request.
        proxy.sendRequest(window.location.href, METHOD.GET);
      }
    });

  }).call(window, window);
});
