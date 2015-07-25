+++
title = "Spotijack 0.6 Released"
date = "2015-07-24T23:00:00Z"
+++

After sitting on the project for a few months, I've just released the
next version of Spotijack on [GitHub][github-releases], as well as the
application's [source code][github-source]. This is the first public
version of Spotijack because I've spent a while contemplating whether
the project is OK to release.

[github-releases]: https://github.com/alexjohnj/spotijack/releases
[github-source]: https://github.com/alexjohnj/spotijack

Spotijack is a utility for the Mac that automates the process of
recording music playing in Spotify with Audio Hijack Pro. Whenever the
song changes in Spotify, Spotijack tells Audio Hijack Pro to split the
recording and update the new recording's metadata. Obviously the
program enables piracy which I do not support, and this is why I've
sat on it for so long.

<!--more-->

I wrote the first version of Spotijack back in December of 2011. At
this point it was a simple AppleScript with no user interface and a
lot of bugs. After that I didn't touch the project for another two
years, largely because I didn't use it. In 2013, looking for a new
side project, I started working on Spotijack again. I ported the
application to Cocoa-AppleScript (a horrible experience) and gave it a
proper user interface. In 2014, I then rewrote the application in
Objective-C using the ScriptingBridge framework (a mostly non-horrible
experience). Ditching AppleScript made the project much more fun to
work on. As a result, I started adding new features and fixing bugs
just for fun. I started to treat it like a proper project and wanted
to make the code public.

I'm aware that the application's only real use is for music piracy
but, it's a fairly inefficient way of pirating music. I don't think
anybody will actually use Spotijack because there are far more
efficient ways to get music. So, I don't think I'm doing much harm by
releasing Spotijack and treating it as a little side project.
