+++
title = "Core Data Property-Level Model Validation in Swift 4"
author = "Alex Jackson"
date = 2017-09-25T19:00:00+01:00
tags = ["swift"]
+++

I ran into an issue while writing property validation methods for a Core Data
stack where the methods simply weren't being called. After a bit of head
scratching I realised it was because the methods needed to be annotated with
`@objc`. This wasn't needed in Swift 3 because `@objc` was inferred on all
methods of subclasses of `NSObject`; however, the behaviour of `@objc` inference
[changed in Swift 4][objc-inference-evolution]. Now, subclasses of `NSObject`
must explicitly mark methods that need to be accessible from Objective-C. This
took longer to realise than it should have since the [Core Data
documentation's][core-data-property-docs] sample code for property-level
validation hasn't been updated for Swift 4.

[objc-inference-evolution]: https://github.com/apple/swift-evolution/blob/master/proposals/0160-objc-inference.md
[core-data-property-docs]: https://developer.apple.com/library/content/documentation/Cocoa/Conceptual/CoreData/ObjectValidation.html#//apple_ref/doc/uid/TP40001075-CH20-SW1

<!--more-->
<!--theres-no-more-->
