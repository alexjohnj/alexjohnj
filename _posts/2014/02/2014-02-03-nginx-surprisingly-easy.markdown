---
title: Nginx—Surprisingly Easy
date: 2014-02-03 00:15:00
layout: post
---

Out of curiosity I spent my Sunday afternoon moving this blog from Amazon S3 to a [DigitalOcean][digital-ocean-link] VPS (spoiler, that's a referral link). I didn't have a solid reason to do this---it's both more expensive and more effort---aside from to learn. I've never set up a web server from scratch before let alone owned a VPS. I kind of felt I needed one so I could earn some geek cred.

[digital-ocean-link]: https://www.digitalocean.com/?refcode=755d29c48c8c

I'm running Ubuntu 12.04 LTS on the VPS since Ubuntu's the Linux distribution I have the most experience with[^1]. Nginx is acting as the web server and seems to be fast. It's not like I have anything to compare it with though. The VPS is DigitalOcean's cheapest droplet---512 MB of RAM and a 20 GB SSD.

Given my lack of experience with web servers, I was expecting Nginx to be a pain to set up. Surprisingly, it wasn't. Within 30 minutes I had a test page up and within an hour I was serving a mirror of this site from a subdomain of this site. Granted, this is a purely static site, so I didn't have to set up the full LEMP stack.

I won't go into detail about how I set up the VPS but I'll share a few resources I found. DigitalOcean's support website has some [good documentation][digital-ocean-docs] on setting up a Linux VPS. There's also a tutorial on [setting up a LEMP stack][digital-ocean-lemp] but I'm not a fan of it. The tutorial uses the outdated nginx package provided in the Ubuntu repositories. It needs updating with info on getting the latest version of Nginx.

[digital-ocean-docs]: https://www.digitalocean.com/community

[digital-ocean-lemp]: https://www.digitalocean.com/community/articles/how-to-install-linux-nginx-mysql-php-lemp-stack-on-ubuntu-12-04

A very useful resource I found for learning about Nginx was [Martin Fjordvald's blog][martin-blog]. He's written several useful and interesting articles especially ["Nginx Configuration Primer"][config-primer]. He's also [written a short book][martin-book] that goes into a bit more detail. It's a quick read and definitely worth the ~£6.00 if you're new to Nginx. 

[martin-blog]: http://blog.martinfjordvald.com
[config-primer]: http://blog.martinfjordvald.com/2010/07/nginx-primer/
[martin-book]: http://blog.martinfjordvald.com/2013/05/my-new-nginx-book-instant-nginx-starter/

## Advantages

More than anything this was a learning exercise but there were a few benefits.

The biggest advantage is native support for root domain names. AWS doesn't support them unless you use their [Route 53][amazon-route-53] service. As a result, I had to use a 3^rd party service to redirect the root domain to the www `cname` record. This added an extra 200--300 ms to the DNS look up if somebody used the naked domain. It was a noticeable difference in performance. Now, the homepage loads in ~300 ms regardless of which domain you use.

Another advantage is the extra control I get. With S3, supporting features like gzip compression was an all or nothing choice. If a browser didn't support gzip---an admittedly rare occurrence---it'd receive nothing but garbled data. With Nginx though I can enable the `gzip_static` directive and support these browsers.

[amazon-route-53]: http://aws.amazon.com/route53/

Going forwards I'm probably going to serve [Geography AS Notes][gas-notes] from the same DigitalOcean droplet since GitHub pages offers even less control than Amazon S3. I don't see any reason why I can't serve it from the same droplet since this website is such a low volume site, it will have a negligible performance impact. If need be I can get a better DigitalOcean droplet but since Geography AS Notes is strictly not for profit and advertisement free I'd have to find some way to subsidise the cost.

[gas-notes]: http://geographyas.info

[^1]: I've been running and maintaining Ubuntu on my Grandmother's computer since 8.04. She uses my old MacBook now but had no problems with Ubuntu when she used it.