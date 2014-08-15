+++
title = "Restoring the Network Manager Applet After Upgrading to Lubuntu 14.04"
date = "2014-04-19"
+++

It seems there's a bug when upgrading Lubuntu to version 14.04 that causes the network manager applet to disappear from the system tray. I've experienced the problem on two separate installations so I'm going to guess this is a widespread problem.

The fix is easy. Just open a terminal session and run this command:

```
echo "nm-applet" >> ~/.config/lxsession/Lubuntu/autostart
```

All the command does is add `nm-applet` to your LXDE autostart file. If you logout and log back in, the network manager applet should be running.
