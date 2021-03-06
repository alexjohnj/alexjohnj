+++
title = "SymSteam"
date = "2012-02-05"
tags = ["symsteam", "projects"]
+++

I've just released a new project on GitHub. It's called [SymSteam](https://github.com/alexjohnj/symsteam) and it's for anybody who likes to play Steam games on their MacBook Air (or any other Mac for that matter). MacBook Airs are reasonably powerful machines, not gaming machines but with the Intel HD graphics inside of them they can handle many of the games on OS X without too much difficulty. The problem is, games are big and SSDs are small. The baseline MacBook Air only has a 64GB SSD and, while the top of the line model has a 256GB SSD, that still isn’t a lot of space for your games once you’ve got all of your other stuff on there too. The solution to this storage problem that most people use is to put their games on an external hard drive and create a symbolic link to them where Steam would expect to find them. This way, you can play games off of your external hard drive when you’ve got the hard drive with you. And there’s the problem, it’s sort of an all or nothing solution. You can either sacrifice some portability, convenience and speed and have all of your games on an external hard drive or you can have your games on an internal hard drive, just not that many. What if you want to play a quick game of Plants vs Zombies while you’re out but don’t have your hard drive with you? That’s not a huge game, it’d only take up maybe 100MB on your hard drive. That game would be fine on your internal hard drive but if you choose to put all your games on an external hard drive you won’t be able to play it off of your internal drive without doing a bit of messing around with folders. This is where SymSteam comes in.

<!--more-->

## Enter SymSteam

SymSteam runs in the background. It doesn't have a dock icon or a menu bar icon. It doesn't have any windows apart from a setup window. It's not going to get in your way. SymSteam watches for when you plug in a USB storage device. It then scans said device to see if it can find a SteamApps folder. If it doesn't, nothing happens. If it does though, it will configure your Steam folder so that Steam will load games off of the device you just plugged in. Unplug the device and you’re playing games off of your internal hard drive. It’s seamless, when it works.

SymSteam is really immature at the moment. It works, but only just. I'm running it on my system because it's handy and I'll continue to work on it for now. Currently, I want to get some sort of preferences window and Growl notifications implemented. There's also a lot of bugs that need fixing.

If you're a developer, or want the latest, cutting edge build, you can get SymSteam from its GitHub repository [here](https://github.com/alexjohnj/symsteam).

If you're just interested in downloading a ready to use, reasonably/partly/just about stable version, get version 0.1 from [here](https://github.com/alexjohnj/symsteam/downloads).
