#!/usr/bin/env python

import sys
import urllib2
from pubnub import Pubnub as PubnubNetwork

"""
{"response_channel":"client","request":{"url":"http://a.pubnub.com/time/0"}}
"""

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Get Args
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def getarg(pos): return pos in sys.argv and sys.argv[pos] or None

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Setup Values
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
channel = getarg(1) or 'server'
pubnub  = PubnubNetwork(
    "pub-c-f73c9874-8d1e-4356-8ad2-e63ebb9d5cc7",  ## PUBLISH_KEY
    "sub-c-fe7719da-bd85-11e2-8f85-02ee2ddab7fe",  ## SUBSCRIBE_KEY
    None,                                          ## SECRET_KEY
    True                                           ## SSL_ON
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
        return "404: %s " % url

## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
## Listen for HTTP Requests and Broker
## -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
def receiver(message):
    try:
        url      = "/".join((message['request']['url']or'///').split('/')[3:])
        response = request("http://0.0.0.0/%s" % url)

        print("PROXYING: %s" % url)
        print("RESPONSE: %s" % response)
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
