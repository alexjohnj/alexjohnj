+++
title = "Strongly Typed Notifications in Swift"
author = "Alex Jackson"
date = 2017-07-05T15:00:00Z
tags = ["swift"]
+++

While working on rewriting [Spotijack][spotijack-link] in Swift, I started to
feel dissatisfied with
Foundation's [notification API][notification-center-docs]. It's a stringly typed
API that makes heavy use of `Any` and as someone who _loves_ their types this
makes me sad. To cheer myself up, I set about writing a more strongly typed
notification system.

The end result is a small
library[^fn:microframework]---[TypedNotification][typednotification-github]---that
provides a set of protocols defining a more descriptive type system for
notifications. Check out the GitHub project if you're interested. There's a
Playground in it demoing the protocols. The rest of this blog post will cover
them in a bit more detail.

[spotijack-link]: https://github.com/alexjohnj/spotijack
[notification-center-docs]: https://developer.apple.com/documentation/foundation/notificationcenter
[typednotification-github]: https://github.com/alexjohnj/typednotification

[^fn:microframework]: I believe the cool kids call this a µFramework.

<!--more-->

## Features

Before I show you the protocols, let me run you through what I wanted to
achieve.

### Closure Based API

First, I wanted to have a closure based API that closely mirrors the foundation
API. Swift has a concise syntax for closures that makes it easy to create short
pieces of code. For longer blocks of code, Swift has function references that
let functions be used as closures. Furthermore, closures encapsulate information
on the types of their arguments which selectors lack. The foundation API already
contains a block based function for notifications so my protocol can simply
mimic that API.

### Notifications as Types

The second requirement is for notifications to convey as much information as
possible using their types. That means no identifying notifications by a string
(at least, not to the user) and no `userInfo` dictionary to attach data to a
notification. A notification's identifier should be inherent to its type and any
data attached to the notification should be declared as properties.

### Automatic Removal of Observers

Finally, I wanted to get rid of the need to think about the lifetime of
observers. The block based foundation API returns an opaque object that users
must remember to unregister before it is deallocated. Forgetting to manage these
objects creates bugs that are difficult to pass off as features.

## The _TypedNotifcation_ Protocol

### Overview

This is the core protocol of _TypedNotifications_. Types that conform to this
protocol can be posted as notifications. The protocol declaration is simple:

``` swift
protocol TypedNotification: Namespaced {
    associatedtype Sender
    /// The name of the notification to be used as an identifier.
    static var name: String { get }
    /// The object sending the notification.
    var sender: Sender { get }
}
```

All types conforming to `TypedNotification` have a `name` property that's used
to identify the notification and a `sender` property that's used to identify the
sender. The `sender` property has an associated type that can be used to
constrain senders to a subset of types.

This protocol reduces the chances of making a mistake with the stringly typed
notification system by only having to declare the name of the notification
once. It also adds some information about the contents of the notification by
providing an associated type for the `sender` property.

To reduce the chances of a notification name collision, I've made the
`TypedNotification` protocol conform to a `Namespaced` protocol which looks
like:

``` swift
protocol Namespaced {
    static var namespace: String { get }
}
```

A protocol extension on `TypedNotifcation` uses the `Namespaced` protocol to
provide a default implementation for the `name` property:

``` swift
extension TypedNotification {
    static var name: String {
        return "\(Self.namespace).\(Self.self)"
    }
}
```

This will generate a notification name using the `namespace` property and the
name of the type conforming to `TypedNotifcation`.

### Usage

For each notification that your application posts, create a type that conforms
to `TypedNotification` and implement the required properties. Thanks to the
aforementioned protocol extension, only the `sender` and `namespace` properties
need to be implemented. You can write a protocol extension on `Namespaced` to
reduce the implementation down to just the `sender` property. As an example:

``` swift
extension Namespaced {
    static var namespace: String { return "org.alexj" }
}

struct ExampleNotification: TypedNotification {
    let sender: ExampleClass
    let newValue: Double
}
```

Here, `ExampleClass` is the only class that's responsible for sending instances
of `ExampleNotification`. If multiple types can post a notification, consider
constraining the `sender` property using a protocol. If worst comes to worst,
you can make `sender` an instance of `Any?` at the expense of some type safety.

## The _TypedNotificationCenter_ Protocol

### Overview

To post instances of `TypedNotifcation`, the library provides another protocol
called `TypedNotificationCenter`. This declares three methods to post
notifications, add observers and remove observers:

``` swift
protocol TypedNotificationCenter {
    /// Post a `TypedNotification`
    func post<T: TypedNotification>(_ notification: T)
    /// Register a block to be executed when a `TypedNotification` is posted.
    func addObserver<T: TypedNotification>(forType type: T.Type, object obj: T.Sender?,
                     queue: OperationQueue?, using block: @escaping (T) -> Void) -> NotificationObserver
    /// Deregister a `NotificationObserver`.
    func removeObserver(observer: NotificationObserver)
}

```

Aside from a different type signature, these methods mirror the Foundation
`NotificationCenter` APIs. _TypedNotification_ includes an extension on
`NotificationCenter` that adds conformance to the `TypedNotificationCenter`
protocol. You can use the protocol when writing tests.

### The _NotifcationObserver_ Class

The `addObserver` method returns an instance of `NotificationObserver` rather
than the `NSObjectProtocol` conforming object returned by the Foundation
API. `NotificationObserver` is a lightweight class that stores an
`NSObjectProtocol` conforming object. When a `NotificationObserver` is
deallocated, `removeObserver` is automatically called. There's no need to
manually remove observers any more, just store[^fn:notificationobserver-return]
a strong reference to the `NotificationObserver`.

[^fn:notificationobserver-return]: Xcode will emit a warning if you don't store the returned `NotificationObserver`. It might be a good idea to enable "Treat Warnings as Errors" in your build settings.

### Usage

Usage is almost identical to using the Foundation API. Building on the previous
example, here's how to use a `TypedNotification` conforming type with
`NotificationCenter`:

``` swift
class ExampleClass {
    private let center = NotificationCenter.default
    private var _valueObserver: NotificationObserver? = nil

    init() {
        _valueObserver = center.addObserver(forType: ExampleNotification.self, object: self, queue: nil) { (noti) in
            print("New value: \(noti.newValue)")
        }
    }

    var value = 0.0 {
        didSet {
            center.post(ExampleNotification(sender: self, newValue: value))
        }
    }
}
```

Note that the closure parameter `noti` is of type `ExampleNotification` so you
can directly access the `newValue` property without any downcasting. Also note
that the observer is tied to the lifetime of `ExampleClass`. When an instance of
`ExampleClass` is deallocated, `_valueObserver` will remove itself as an
observer.

## Conclusions

I think the advantages of this library compared to the Foundation API are
clear. Representing notifications as types improves the safety of your code by
eliminating manually managed string identifiers and weakly typed `userInfo`
dictionaries. A further advantage of typed notifications is
self-documentation. As data attached to a notification is part of the type,
there's no need to document the keys of a `userInfo` dictionary. Users can look
at the public interface of a `TypedNotification` conforming type to see what
data it provides.

The `TypedNotificationCenter` protocol goes hand in hand with the
`TypedNotification` protocol. It improves run time safety by automatically
removing observers when they are deallocated, eliminating an entire class of
bugs. Furthermore, it provides a starting point for writing tests for
notifications.

The _TypedNotification_ library is available
from [GitHub][typednotification-github] under an MIT license. It is compatible
with the Swift Package Manager and Carthage.
