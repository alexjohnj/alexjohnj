+++
title = "How a Core Data Attribute's Name Can Lead to Crashes"
author = "Alex Jackson"
date = 2017-11-10T19:55:00Z
tags = ["swift", "core-data"]
+++

_TL;DR: You can't name a Core Data attribute `new*` in Objective-C or Swift
because of how automatic reference counting interacts with manual reference
counting. If you do, you'll crash unreliably when your Core Data stack is
deallocated._

I've spent the better part of a day trying to fix this hard to track down bug in
my Core Data stack that was causing a crash. The crash was introduced when I
added a new entity to my object model. The `NSManagedObject` subclass looked a
little like this:

<!--more-->

``` swift
public final class RenamedThing: NSManagedObject {
    @NSManaged private(set) public var newName: String
    @NSManaged private(set) public var oldName: String
    @NSManaged public var markedForLocalDeletionDate: Date?
}
```

Any tests that accessed `RenamedThing`'s `newName` attribute would crash when
the `NSPersistentContainer` was set to `nil` in the test's `tearDown()`
method. The crash message looked like:


```text
xctest(..) malloc: *** error for object ..: pointer being freed was not allocated
*** set a breakpoint in malloc_error_break to debug
```

After eliminating any possibility of this being a bug related to Core Data's
concurrency model, I broke out Xcode's memory graph debugger and then `NSZombie`
to see if I could find anything. This felt like an odd thing to do since this is
Swift and so automatic reference counting (ARC) is active and I can't make any
manual calls to `release` anywhere. In the end, neither the memory graph
debugger nor `NSZombie` were of any help.

At this point I was starting to think that this might be a bug in Core Data. To
check I wasn't doing something crazy stupid with ARC though, I checked through
the documentation on ARC. Eventually, I came across the [Transitioning to ARC
release notes][arc-release-notes] and found this lovely tidbit under the "new"
rules section:

> You cannot give an accessor a name that begins with new. This in turn means
> that you can’t, for example, declare a property whose name begins with new
> unless you specify a different getter[.]

[arc-release-notes]: https://developer.apple.com/library/content/releasenotes/ObjectiveC/RN-TransitioningToARC/Introduction/Introduction.html#//apple_ref/doc/uid/TP40011226-CH1-SW14

I renamed the `newName` attribute to something else and, of course, my tests
stopped crashing. This is both my favourite and least favourite type of bug---a
bug that takes hours to figure out but just a second to fix.

I was surprised to find that the transitioning to ARC guide is still relevant
today, even in Swift. I _think_ this means that Core Data is still using manual
memory management (at least in parts) which is a little surprising given how
long ARC has been available and how complicated the memory management must be
for Core Data. Still, "if it ain't broke then don't fix it" is probably a
_really_ good rule to stick by for something as complex as Core Data.
