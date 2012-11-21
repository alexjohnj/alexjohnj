---
layout: default
title: SymSteam
version: Beta 2
---

# SymSteam ({{ page.version }})

<div class="project-icon">
	<div class="sprite-icons-symsteam-icon-256"></div>
</div>

<div id="project-header-links" markdown="1">

## [Download SymSteam {{ page.version }}][application-download-link], [View it on GitHub][github-project-page] or [Check out the Documentation][symsteam-documentation].

</div>

---

## What is SymSteam?

SymSteam is a Mac application designed to make it easy for laptop users to play Steam games off of both an external and an internal hard drive. SymSteam manages a symbolic link to a Steam game library on an external hard drive so that when an external drive with your games on is connected to your computer, you play games off of the external hard drive. When the drive is unplugged, you play games off of your internal drive. It's ideal for people who like to play games on their MacBook's both at home and on the go. 

SymSteam is unobtrusive. It runs in the background and displays (optional) notifications via either Growl or Notification Center[^1] when something happens.

## What are the System Requirements? 

SymSteam has been tested on OS 10.8 (Mountain Lion) but should, in theory, work on OS 10.7 (Lion). The external hard drive you use to play your games off of should be formatted to HFS+ but it _may_ work with other file systems.

## Is it Open Source?

Oh yeah! You can find SymSteam on [GitHub][github-project-page] where you can report bugs and help out by making some contributions to the code.

## A Disclaimer

Please remember that SymSteam is in beta. While I've been using the application for over 6 months without any problems there will be bugs so always have a backup of your Steam games and saves. If something happens involving SymSteam that results in you loosing data, while I'll feel very sorry for you, it's not my fault, so don't try and sue me or anything.

## Some Useful Links

- [Changelog][symsteam-changelog]
- [GitHub Project Page][github-project-page]
- [Documentation][symsteam-documentation]

[github-project-page]: https://github.com/alexjohnj/symsteam
[application-download-link]: https://github.com/alexjohnj/symsteam/downloads
[symsteam-documentation]: documentation/
[symsteam-changelog]: http://alexjohnj.github.com/symsteam/changelog.html

---

[^1]: Requires OS 10.8 Mountain Lion