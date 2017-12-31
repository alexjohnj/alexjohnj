+++
title = "A Banner View for iOS 11+"
author = "Alex Jackson"
date = 2017-12-07T18:00:00Z
tags = ["swift", "ios", "snippets"]
+++

I needed a way to present non-modal alerts inside an app I'm working on and
wanted to use a banner system that's a bit like what Tweetbot[^fn:tweetbot]
does. I ended up writing a `UIView` subclass called `BannerView` that I've [open
sourced][banner-view-gh] for anybody to use.

[^fn:tweetbot]: I haven't used Tweetbot for almost a year but I know it _used_ to have these banners.

<!--more-->

The banner view uses the new [safe area layout guides][doc-safe-area] introduced
in iOS 11 to lay itself out correctly when navigation bars are present. The top
of the banner expands to fill the top safe area which looks really cool on an
iPhone X[^fn:iphone-x]:

[^fn:iphone-x]: At least, it does in the simulator. I can only imagine what it looks like on an actual device.

<video loop autoplay muted>
    <source src="/videos/banner-view/no-nav.webm" type="video/webm">
    <source src="/videos/banner-view/no-nav.mp4" type="video/mp4">
    Ack! Your browser doesn't support WebM or MP4 videos! What is this, the 3DS browser?
</video>

[doc-safe-area]: https://developer.apple.com/documentation/uikit/uiview/2891102-safearealayoutguide

The appearance of the banner is easily customised and an optional icon can be
displayed alongside the message. There's support for a swipe-to-dismiss gesture
baked in too.

There are a few minor issues but they shouldn't be too hard to fix. The banner
doesn't quite resize properly if the phone's rotated and things get a bit funky
if the banner's embedded inside a navigation bar with `prefersLargeTitles =
true`. Oh, and there's no built in way to perform an action when the user taps
the banner although you could accomplish that by attaching a
`UITapGestureRecognizer` to the view.

Again, you can get `BannerView` from [here][banner-view-gh]. It's licensed under
an MIT license.

[banner-view-gh]: https://gist.github.com/alexjohnj/df4d969fa0ac6f29fa8a134c91fa30ff
