---
title: SymSteam Beta 2 Released
layout: post
---

It may have taken nearly 9 months but beta 2 of SymSteam is finally available for download. This is a _huge_ update for SymSteam that completely changes how it works and fixes many bugs as a result. SymSteam no longer manages drives based on their names, rather, it relies on the UUID of a drive to determine if the drive is the Steam drive. This makes SymSteam more reliable in situations where you have drives with the same name but it does introduce a new requirement. The drive you're storing your games on must have a UUID which essentially means that the drive must be HFS+ formatted[^1].

In addition to this major change, lots of small changes have also been made that make SymSteam easier to use and more reliable. The error correction performed on your Steam folders when SymSteam is launched is far more reliable now and SymSteam can fix incorrect folder setups in many more cases, reducing the number of situations where SymSteam will fail to work. The setup process has been rewritten to make it much simpler to use and also to make it less likely to fail. The preferences window has been expanded upon too, providing more in-depth options for notifications and an option to start SymSteam on login. Oh, SymSteam finally has an icon too! It's not amazing but it's better than the generic app icon that SymSteam had before the update.

The full changelog for beta 2 can be found [here][symsteam-changelog].

SymSteam now has some fairly extensive documentation available on its new [project page][symsteam-project-page]. The new documentation includes information on setting up SymSteam and some troubleshooting information too. The documentation can be accessed [here][symsteam-documentation].

If you already have SymSteam installed then it will prompt you to update (assuming you've allowed it to). If not, you can download beta 2 of SymSteam [here][symsteam-project-page].

---

[^1]: There are other filesystems that assign drives a UUID but I don't think any of these have native support in OS X. 

[symsteam-changelog]: http://alexjohnj.github.com/symsteam/changelog.html
[symsteam-project-page]: http://www.alexj.me/projects/symsteam/
[symsteam-documentation]: http://www.alexj.me/projects/symsteam/documentation/
[symsteam-download-link]: http://application-downloads.s3.amazonaws.com/SymSteam-Beta-2.zip
