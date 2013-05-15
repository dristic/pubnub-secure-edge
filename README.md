PubNub Proxy
===============

Close your Firewall 100%.

![PubNub Proxy](http://pubnub.s3.amazonaws.com/assets/pubnub-proxy-852px.png)

The PubNub Proxy takes a *HTTP Traffic* and routes requests through the PubNub Network.
This allows your web site to be behind a 100% closed firewall yet still accept
and respond to web requests.

# PubNub JavaScript Terminator

The client works by making the initial page request and optionally
intercepting all AJAX and link requests after the page is loaded.
The first step is initialzing a connection with pubnub and then
initializing the proxy object.

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
    proxy.sendRequest(window.location.href, "GET");
  }
});
```

# PubNub Python Terminator

The server is started by cd-ing into the server directory and running

    python server.py <channel name (usually server)>

This will start the proxy server locally and redirect all commands to localhost:80

## Video Details

>PubNub - Close Your Firewall

 1. Show URL via Port 80 Request.
 2. Close all Ports on the EC2 Firewall.
 3. Show Inaccessible URL.
 4. Show Bootstrap w/ PubNub Termintor: ./pubnub-proxy/client/index.html#web/example.html
 5. It works!

### Practical Applications

 1. Using the enahced security model to broker your REST API interfaces behind the corporate firewalls.
 2. To a lesser extent though still applicable you can use this wrapper to re-route html page navigation.

### Limitations

Note that there are limitations.

 1. Max Message Size: 7.4KB - Solution is to Chunk Responses beyond this range.
 2. Right now the terminators establish Public Routes which means anyone, anywhere, can send/receive information based on channel ID.  However this can be resolved in several fashions. 
    1. One way is to use two sets of PubNub keys to prevent a rouge injecting feedback responses altogether.  Done.
    2. In addition you can also enable Cipher Key AES Cryptography, Bidirectionally!  Obviously as long as you don't transmit the cipher key, rouges are blocked from intercepting the inbound request.  
    3. Also PubNub is working on a new edge based perimeter service which provides enhanced authority controls routes and clients.


![PubNub Proxy](http://pubnub.s3.amazonaws.com/assets/pubnub-proxy-852px.png)

# PubNubProxy JS Class
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

