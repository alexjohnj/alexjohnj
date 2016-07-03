---
title: "SymSteam 0.1.5 Released"
date: "2012-02-18"
tags: [symsteam, projects]
---

SymSteam, [my small project I released just a few weeks ago](/02/symsteam), received its first major update today. Version 0.1.5 was pushed to the GitHub repo a few hours ago and with it came an important new feature and some bug fixes.

<!--more-->

The most important new feature is a new preferences window which allows you to change the where your symbolic and local SteamApps folders are located. This is pretty handy since, previously, the only way to change these paths was to delete SymSteam's plist file. Under the hood, SymSteam's got a new system for managing connected drives so that it knows what drives are connected and, of those connected drives, which one is actually a Steam drive. This should remove a couple of bugs related to having multiple connected drives. It could, however, introduce some new ones. Watch out. One more thing to note, scanning drives for SteamApps folders should be a little bit faster now. Not massively, but a little bit.

To download the latest version of SymSteam, head over [here](https://github.com/alexjohnj/SymSteam/downloads). If you're interested in the source code, you can check out the code [here](https://github.com/alexjohnj/SymSteam). The code in the `master` branch should be reasonably in sync with the latest version of SymSteam available to download. Most major new features will get their own branch while they're being developed.

## 0.2

I also started working on version 0.2 today. The plan for version 0.2 is to add support for [Growl](http://growl.info/) notifications, improve the error handling logic for missing folders and add the ability to specify a single drive and path to scan for a SteamApps folder, improving performance greatly. So far, basic support for Growl has been added but not tested.

If you want to see and (hopefully) contribute towards the development of the latest build of SymSteam, you can look at the `symsteam-2.0` branch [here](https://github.com/alexjohnj/SymSteam/tree/symsteam-2.0) (I know, that should be `symsteam-0.2.0` but I wasn't thinking when I named the branch). Be warned, stuff will likely be unstable and broken in that branch.
