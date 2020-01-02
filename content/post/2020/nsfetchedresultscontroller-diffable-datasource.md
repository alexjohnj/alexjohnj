+++
title = "NSFetchedResultsController & NSDiffableDataSourceSnapshot Issues"
author = "Alex Jackson"
date = 2020-01-02T13:00:00+01:00
tags = ["swift", "core-data"]
+++

In iOS 13, `NSFetchedResultsController` gained support for delivering changes to
its content as a `NSDiffableDataSourceSnapshot` via. its delegate. The snapshot
contains the contents of the controller and can be used to populate a table or
collection view complete with animations for content updates.

Unfortunately the API has a few issues. The way it's bridged from Objective-C to
Swift makes using it a bit confusing and it doesn't match all the functionality
of the older delegate methods. In this post I'll document a couple of the issues
I've run into and how I've worked around them.

<!--more-->

## Using Snapshots in Swift

The first issue I encountered using the new API is accessing the snapshot from
Swift. The documentation declares the signature of the snapshot delegate method
as

``` swift
func controller(_ controller: NSFetchedResultsController<NSFetchRequestResult>, didChangeContentWith snapshot: NSDiffableDataSourceSnapshot)
```

but this isn't correct as `NSDiffableDataSourceSnapshot` has two generic
parameters for the `SectionIdentifier` and `ObjectIdentifier` that are
missing. The delegate method's signature actually bridges from Objective-C as:

``` swift
func controller(_ controller: NSFetchedResultsController<NSFetchRequestResult>, didChangeContentWith snapshot: NSDiffableDataSourceSnapshotReference)
```

The snapshot is an instance of `NSDiffableDataSourceSnapshotReference`, a class
that lacks the generic type parameters found on the struct version. By itself
this class seems useless as there aren't any other APIs that use it and it seems
to only exist to bridge this delegate method. To use the snapshot, you must cast
it to a `NSDiffableDataSourceSnapshot<String, NSManagedObjectID>`:

``` swift
func controller(_ controller: NSFetchedResultsController<NSFetchRequestResult>, didChangeContentWith snapshot: NSDiffableDataSourceSnapshotReference) {
    let snapshot = snapshot as NSDiffableDataSourceSnapshot<String, NSManagedObjectID>
    // Do something with the snapshot
}
```

Note that you can put any type for the `SectionIdentifier` and `ItemIdentifier`
parameters and it'll compile but only `String` and `NSManagedObjectID` are valid
as can be seen in the declaration of the Objective-C protocol:

``` objective-c
- (void)controller:(NSFetchedResultsController *)controller didChangeContentWithSnapshot:(NSDiffableDataSourceSnapshot<NSString *, NSManagedObjectID *> *)snapshot
```

At this point you've got a normal `NSDiffableDataSourceSnapshot` that can be
used with a table or collection view. I don't quite understand why the delegate
method gets bridged this way though since the Objective-C declaration is using
lightweight generics that should bridge across to Swift generics.

## Tracking Object Updates

The traditional delegate methods for `NSFetchedResultsController` updates
provide notifications of object insertions, updates, moves and deletes. Although
`NSDiffableDataSourceSnapshot` supports tracking all these events, the snapshot
provided to `NSFetchedResultsController`'s delegate only tracks insertions,
deletions and moves.

If you need to track object updates via. a data source snapshot, you'll need to
use the traditional delegate methods to build and maintain your own
snapshot. Using Swift's new `CollectionDifference` type this isn't too hard,
particularly if you only need to deal with one section. Note that you won't be
able to use the `NSManagedObjectID` as an `ItemIdentifier` in the snapshot
though for reasons I'll explain below.

In my situation when dealing with a single section I was able to get away with
an implementation like this:

``` swift
import UIKit
import CoreData
import Combine

/// A singleton section for the snapshot
struct Section: Hashable {
    private init() { }
    static let main = Section()
}

final class SingleSectionController<Object: NSManagedObject>: NSObject, NSFetchedResultsControllerDelegate {

    @Published
    var results = NSDiffableDataSourceSnapshot<Section, Object>()

    private let resultsController: NSFetchedResultsController<Object>

    init(context: NSManagedObjectContext, request: NSFetchRequest<Object>) {
        self.resultsController = NSFetchedResultsController(fetchRequest: request, managedObjectContext: context,
                                                            sectionNameKeyPath: nil, cacheName: nil)

        super.init()

        resultsController.delegate = self
    }

    func fetchData() {
        // Handle errors gracefully in production
        try! resultsController.performFetch()
        generateNewSnapshot()
    }

    private func generateNewSnapshot() {
        var initialSnapshot = NSDiffableDataSourceSnapshot<Section, Object>()
        initialSnapshot.appendSections([.main])

        if let objects = resultsController.fetchedObjects {
            initialSnapshot.appendItems(objects, toSection: .main)
        }

        self.results = initialSnapshot
    }


    // MARK: - Fetched Results Controller Delegate

    private var transientChanges: [CollectionDifference<Object>.Change] = []
    private var updatedObjects: Set<Object> = []

    func controllerWillChangeContent(_ controller: NSFetchedResultsController<NSFetchRequestResult>) {
        transientChanges.removeAll()
        updatedObjects.removeAll()
    }

    func controller(_ controller: NSFetchedResultsController<NSFetchRequestResult>, didChange anObject: Any, at indexPath: IndexPath?, for type: NSFetchedResultsChangeType, newIndexPath: IndexPath?) {
        guard let object = anObject as? Object else { return }

        switch type {
        case .insert:
            let insertionIndex = newIndexPath!
            transientChanges.append(.insert(offset: insertionIndex.row, element: object, associatedWith: nil))

        case .update:
            updatedObjects.insert(object)

        case .move:
            let sourceIndex = indexPath!.row
            let destinationIndex = newIndexPath!.row

            updatedObjects.insert(object)
            transientChanges.append(.insert(offset: destinationIndex, element: object, associatedWith: sourceIndex))
            transientChanges.append(.remove(offset: sourceIndex, element: object, associatedWith: destinationIndex))

        case .delete:
            let deletedIndex = indexPath!.row
            transientChanges.append(.remove(offset: deletedIndex, element: object, associatedWith: nil))

        @unknown default:
            fatalError("Unhandled \(NSFetchedResultsChangeType.self) \(type)")
        }
    }

    func controllerDidChangeContent(_ controller: NSFetchedResultsController<NSFetchRequestResult>) {
        guard let collectionDifference = CollectionDifference(transientChanges) else {
            // In theory, NSFetchedResultsController should deliver valid changes. In practice, I don't trust it so fall
            // back to generating a new snapshot if the changes can't be used as a diff.
            assertionFailure("Unable to create a collection difference from the changes \(transientChanges)")
            generateNewSnapshot()
            return
        }

        var newSnapshot = self.results
        for change in collectionDifference {
            switch change {
            case .insert(0, let object, _) where newSnapshot.numberOfItems(inSection: .main) == 0:
                newSnapshot.appendItems([object], toSection: .main)

            case .insert(0, let object, _):
                newSnapshot.insertItems([object], beforeItem: newSnapshot.itemIdentifiers(inSection: .main).first!)

            case .insert(newSnapshot.itemIdentifiers(inSection: .main).count, let object, _):
                newSnapshot.appendItems([object], toSection: .main)

            case .insert(let index, let object, _):
                let existingItem = newSnapshot.itemIdentifiers(inSection: .main)[index]
                newSnapshot.insertItems([object], beforeItem: existingItem)

            case .remove(_, let object, _):
                newSnapshot.deleteItems([object])
            }
        }

        newSnapshot.reloadItems(Array(updatedObjects))
        assert(newSnapshot.itemIdentifiers == resultsController.fetchedObjects ?? [],
               "Final snapshots items do not match the FRC's fetched objects")

        self.results = newSnapshot
    }
}
```

This tracks insertions, updates, moves and deletions using Swift's
`CollectionDifference` type to handle applying the updates in the correct
order. Compared to the `controller(_:didChangeContentWith:)` method, this
implementation does have one downside. As the snapshot's `ItemIdentifier` are
instances of `NSManagedObject`, you can't apply the snapshot from a background
queue (or at least, a different queue to the controller's context's queue)
whereas you can when using `NSManagedObjectID`s as identifiers.

## The Problem with Object IDs

The reason for using `NSManagedObject` as the `ItemIdentifier` instead of
`NSManagedObjectID` is due to how `NSFetchedResultsController` handles temporary
object IDs. As soon as an object matching the controller's fetch request is
inserted into the context, the controller will notify the delegate of an
insertion. At this point the object only has a temporary ID as it hasn't been
saved to the context's persistent store yet. If we were using an
`NSManagedObjectID` as the snapshot's `ItemIdentifier`, we'd add a temporary ID
to the snapshot at this point.

When the context is saved, the inserted object is given a (different) permanent
object ID. Although we can continue to use the temporary ID to retrieve the
object from its context, the `NSManagedObjectID` returned by the object's
`objectID` property will be the new, permanent ID.

Any subsequent updates to the object will be delivered to the results
controller's delegate as updates or moves. When we try to update the data source
snapshot using the updated object's `NSManagedObjectID`, the data source will
throw an exception because it only contains the temporary object ID, not the
permanent ID.

If you must use `NSManagedObjectID` as the data source's `ItemIdentifier`, you
can (kind of) exclude objects with a temporary ID from the results controller by
creating a private, read-only child context of the main context for the results
controller. The child context (and by extension the results controller) will not
know about newly inserted objects until the parent context is saved at which
point the objects will have a permanent ID (assuming the parent context is a
root context).

This setup creates some new problems though. If you need to merge changes into
the parent context from another context (say a background context), the merged
changes won't propagate to the child context automatically, even if
`automaticallyMergesChangesFromParent` is `true` for the child context.
