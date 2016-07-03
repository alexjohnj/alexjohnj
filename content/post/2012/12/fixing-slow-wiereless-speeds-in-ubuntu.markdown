+++
title = "Fixing Slow Wireless Speeds in Ubuntu 12.10"
date = "2012-12-31"
syntax_highlighting = true
tags = ["linux"]
+++

After building a new computer recently I went ahead and installed Ubuntu 12.10 on it alongside Windows. Since the computer doesn't have a wireless card and isn't anywhere near a router, I bought a cheap Wireless USB adapter so that I could connect to my wireless network. I actually bought the adapter several years ago and used it on a computer running Ubuntu 10.04 that was in a similar situation. The adapter I bought was a [Belkin F5D8053][wireless-adapter-amazon-page], the v6 revision. I bought this adapter because I'd been told that it had good compatibility with Linux and I remember it working perfectly well in Ubuntu 10.04. I was surprised to find then that when I used the adapter with my new installation of Ubuntu 12.10 it was very unreliable. The adapter worked but after arround five minutes of usage, the connection speed would drop substantially and anything, be it on the internet or my local network, was incredibly slow.

[wireless-adapter-amazon-page]: http://www.amazon.co.uk/gp/product/B001HO3ZTQ/ref=as_li_ss_tl?ie=UTF8&camp=1634&creative=19450&creativeASIN=B001HO3ZTQ&linkCode=as2&tag=simpl06-21

<!--more-->

I set about trying to figure out what was up. The first thing I thought was that maybe the driver used for the adapter had been messed up somehow between Ubuntu 10.04 and 12.10. Running `lsusb` revealed that the adapter used a RTL8191SU chipset by Realtek so I went to Realtek's website and downloaded the source to compile the driver for the adapter. Turns out, something changed in version 3.4 of the Linux Kernel that made compiling these drivers impossible without some minor modifications. Version 3.5 of the Kernel broke even those modifications so compiling new drivers wasn't an option any more.

Some more Googling produced some interesting information. Apparently, there's a [bug][network-manager-bug-report] in network-manager, the package used by Ubuntu to connect to networks, that results in the connection speed slowing down after a few minutes of use. The solution, install an alternate to network-manager and disable network-manager. I went ahead and installed [wicd][wicd-website] and disabled network-manager and so far, in the past 36 hours of use (around 12 hours continuous use over 3 days), I've had no drop in connection speed. It would seem that the drop in connection speed is due to network-manager which means that people having similar problems with connection speed could find that replacing network-manager will solve their problems.

## The Fix

The fix is quite simple, install wicd and disable network-manager. The steps for doing this are outlined below:

First, install the wicd package:

```bash
sudo apt-get intall wicd
```

Next, disable network-manager and stop it from starting on startup too:

```bash
sudo stop network-manager
sudo mv /etc/init/network-manager.conf /etc/init/network-manager.conf.off
```

Now start the wicd daemon and bring up the GUI tool so you can connect to your wireless network:

```bash
sudo /etc/init.d/wicd start
wicd-client
```

And that's it, assuming that network-manager was your problem, you should now have a far more stable wireless connection and wicd should start on login too. If you want to get wicd in Unity's system tray, you'll need to run the following command:

```bash
gsettings set com.canonical.Unity.Panel systray-whitelist "['wicd']"
```

Then logout and log back in, you should now have a (fairly ugly) tray icon for wicd. There's replacement icons available, just Google for them.

Once you're certain that wicd has solved your problem and you don't need network-manager anymore, you can go ahead and remove nework-manager. First, revert the changes made to network-manager's upstart job and then remove the package:

```bash
sudo mv /etc/init/network-manager.conf.off /etc/init/network-manager.conf
sudo apt-get remove --purge network-manager
```

That solved the problem for me. If it does for you, be sure to file a bug report so that this issue hopefully gets fixed in network-manager.

[wicd-website]: https://launchpad.net/wicd
[network-manager-bug-report]: https://bugs.launchpad.net/ubuntu/+source/linux/+bug/621265
