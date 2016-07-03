---
title: SymSteam Beta 2.1 Released
date: "2013-03-31T12:32:00Z"
tags: [symsteam, projects]
---

This is a _very_ small update for SymSteam that fixes two bugs you probably didn't even know existed. The first, a simple spelling mistake in an error message. The second, a cock-up with pointers that meant that if an error occurred while deleting an old symbolic link an empty error message would be displayed. Not particularly helpful.

<!--more-->

Code wise, SymSteam should be easier to translate into other languages because I've changed all the user interface strings so that they're created using `NSLocalizedString()` and are stored in a strings file. If anyone wants to go ahead and translate SymSteam into another language please do.

You should be prompted to install the update if you already have SymSteam installed. If not, you can view the changelog and download it from SymSteam's [project page][project-page]. As always, you can find the source code for SymSteam on [GitHub][github-project].

[project-page]: /projects/symsteam/
[github-project]: https://github.com/alexjohnj/symsteam/
