#!/usr/bin/env python

from pubnub import Pubnub as PubnubNetwork

import sys
import urllib2

"""
{"response_channel":"client","request":{"url":"http://a.pubnub.com/time/0"}}
"""

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Get Args
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def getarg(pos): return pos < len(sys.argv) and sys.argv[pos] or None

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Setup Values
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
channel = getarg(1) or 'server'
pubnub  = PubnubNetwork(
    "pub-c-f73c9874-8d1e-4356-8ad2-e63ebb9d5cc7",  ## PUBLISH_KEY
    "sub-c-fe7719da-bd85-11e2-8f85-02ee2ddab7fe",  ## SUBSCRIBE_KEY
    None,
    True    ## SSL IS ENABLED
)

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Main
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def main():

    ## Show Startup Channel
    print("LISTENING_CHANNEL: '%s'" % channel)

    ## Receive In-bound Traffic Behind a fully closed Firewall
    pubnub.subscribe({
        'channel'  : channel,
        'callback' : receiver 
    })

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Request URL
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def request(url):
    try:
        try: usock = urllib2.urlopen( url, None, 200 )
        except TypeError: usock = urllib2.urlopen( url, None )
        response = usock.read()
        usock.close()
        return response
    except:
        print( "ERROR:", sys.exc_info()[0] )
        return "404: %s " % url

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Listen for HTTP Requests and Broker
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def receiver(message):
    try:
        url = message['request']['url'] or '///'
        url = "/".join((url).split('/')[3:])

        if '#' in url: url = url.split('#')[1]

        response = request("http://localhost/%s" % url)[:15000]

        #print("RESPONSE: %s" % response)
        print("PROXYING: %s" % url)
        print("RESPONSE-SIZE: %s" % len(response))
        print("BROKER: %s" % pubnub.publish({
            'channel' : message['response_channel'],
            'message' : {
                'html' : response
            }
        }))

    except:
        print( "ERROR:", sys.exc_info()[0] )

    return True

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Execute if Main
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
if __name__ == "__main__": main()
