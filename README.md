PubNub Proxy
===============

![PubNub Proxy](http://pubnub.s3.amazonaws.com/assets/pubnub-proxy-852px.png)

The PubNub Proxy takes a web request and proxies it through the PubNub service. This allows your web site to be completely behind a firewall yet still accept and respond to web requests.

# JavaScript Client
The client works by making the initial page request and optionally intercepting all AJAX and link requests after the page is loaded. The first step is initialzing a connection with pubnub and then initializing the proxy object.

```javascript
// Initialize the PubNub connection.
this.pubnub = PUBNUB.init({
  subscribe_key: "demo",
  publish_key: "demo"
});

// Initialize the proxy object.
this.proxy = new PubNubProxy({
  connection: this.pubnub,
  intercept_ajax: true,
  intercept_links: true,
  intercept_forms: true,
  callback: function () {
    // Call the first page request.
    proxy.sendRequest(window.location.href, METHOD.GET);
  }
});
```

# PubNubProxy
## constructor([options])
Sets up all interceptions that are turned on and subscribes to page updates.

Options:
* _connection_ The pubnub connection object.
* _uuid_ (optional) A custom UUID if the connection was created with one.
* _intercept_ajax_ (optional) If the proxy should intercept all AJAX calls.
* _intercept_links_ (optional) If the proxy should intercept anchor tag clicks.
* _intercept_forms_ (optional) If the proxy should intercept form posts.
* _callback_ (optional) The function to call after the proxy has subscribed to the user channel.

## handleResponse(message)
Handles the proxy response from the server. Looks for message.html to load into the window.

## sendRequest(url, method)
Sends a request to the proxy server for a given page. Example:

  proxy.sendRequest('http://pubnub.com/about', 'GET');
  
## destroy()
Unsubscribes from the user response channel and deletes all object references.