---
title: SymSteam Beta 1 Released
date: 2012-04-11
tags: [symsteam, projects]
---

Good news! Just the other day, SymSteam, my small pet project, received a pretty major update.  In fact, this update is so major, I've labelled it Beta 1. Pretty much everything to do with SymSteam has changed.

<!--more-->

Beta 1 brings numerous new features and changes to the application. A list of the changes is available on SymSteam's new website [here](http://alexjohnj.github.com/symsteam/changelog.html) but in this post I'd just like to elaborate on some of the features and the work that's gone into beta 1 of SymSteam.

Development on SymSteam 0.2 began back in February with the simple aim of adding support for Growl notifications and fixing some bugs to make SymSteam more usable. Growl support was added pretty quickly but I had the idea of rewriting the underlying logic of SymSteam which helped to remove a substantial number of bugs. The rewrite took the best part of a day and made SymSteam far easier to use. It simplified the setup procedure and helped make SymSteam less likely to fail in difficult situations. After this rewrite, I rewrote the scanning system for detecting the SteamApps folder. I changed it so that SymSteam performed first a shallow scan (only scanning top level directories) and then it performed a deep scan, should it not find the SteamApps folder when performing the shallow scan. This change in the scanning mechanism helped to significantly reduce the time it took for SymSteam to detect the SteamApps folder when a drive was plugged in, in around 90% of cases.

After making all these changes to the scanning system however, I decided to endulge on another rewrite, completely changing the way SymSteam functions. SymSteam no longer scans all drives that are connected for the SteamApps folder, rather it will resolve the symbolic link you point it to and only scan at that directory, performing a simple check to see if the folder exists at the symbolic link or not. If the correct drive is connected, the folder will exist and SymSteam can update the SteamApps folders so that Steam loads its games off of the external hard drive. If the folder doesn't exist however, then life carries on as normal and nothing changes. This is *a lot* faster than scanning each drive that is connected and SymSteam can now work in a split second rather than a few seconds.

After this rewrite, I attempted to write a startup method that would run when SymSteam is launched that would attempt to fix any naming problems with the SteamApps folders that may arise when SymSteam is quit without being given the ability to rename the SteamApps folders so that the local folder is active. This error prevention method seems to work with limited success and I'll continue to develop it in future versions to make it more successful.

I decided to update the preferences window in SymSteam too, using the MASPreferences framework to provide a proper preferences window. I wrote about how to use MASPreferences and my experiences with it on SimpleCode [here](http://simplecode.me/2012/04/08/preferences-window-in-cocoa-maspreferences/).

There were several other changes within SymSteam, however I feel that these were the most substantial. Other changes include a vastly simplified setup procedure (which I briefly touched upon when talking about the rewrite), a new tool to help ease the creation of symbolic links and a new autoupdate system too, which will make pushing updates much easier in the future.

SymSteam beta 1 is available now and I've already got plans for the next version of SymSteam, beta 2. SymSteam now has its own website, so you can get access to SymSteam beta 1 and the source code via <http://alexjohnj.github.com/symsteam>.
