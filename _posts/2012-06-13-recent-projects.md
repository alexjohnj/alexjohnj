---
title: "Recent Projects"
layout: post
---

It would seem that pretty much the only thing I use this blog for is announcements. Guess what's in this post, some more announcements, specifically regarding some new projects that I've started in the past month (and a bit). 

<!-- more -->

Now that I've got a lot more free time on my hands, I've managed to start two new Cocoa projects for the Mac, one of which I've been intending to do for several months. They're both free applications and they're both open source, with the source code being available off of my [GitHub](https://github.com/alexjohnj) page. If you were to categorise both of these projects, they'd both fall into two categories that are totally new to me in terms of development. One of the projects is a game and another is an utility aimed at developers. 

## MemTester ( - Mac)

MemTester is the game. I've never made a game before so this was/is quite a fun little project to work on. MemTester is a very simple memory testing game (surprise, surprise) that tests your ability to memorise an increasingly lengthy sequence of numbers, letters or symbols. The game has three difficulties, easy (just numbers), medium (just lowercase letters) & hard (nearly all possible ASCII characters) and has amazing features like a high scores table & fancy animations (/sarcasm). I started working on MemTester as a port of a similar game that a friend of mine made. [My friend's version](http://code.google.com/p/mem-tester) was written in Java and was very un-Mac like so I decided to make a native Cocoa port of the game for fun. He wasn't best pleased. 

So far, version 1.0 of MemTester has been released and there's been no further development since then (though I do have a couple of things planned). Development for MemTester will be on and off, but you can watch [the project](https://github.com/alexjohnj/memtester-mac) on GitHub. You can also download the latest version from [here](https://github.com/alexjohnj/memtester-mac/downloads). 

## Appcastr

Appcastr is the development tool. It's quite possibly my most ambitious project to date and so far, developing it has been a joy and I've learnt a lot of new things working on it. Appcastr is a tool for developers who use the Sparkle update system, that's the update system used by 99% of Mac applications that aren't in the Mac App Store, that makes it easier & quicker for developers to create and maintain appcast files by providing a GUI to edit them with. Appcast files are just RSS files with a special `<enclosure>` element in them that allows them to include information on the latest version of an application and where to get it from. The appcast file is downloaded by the Sparkle update framework and then parsed to see if there's a new version of the application available. 
	
Since appcast files are just XML files, it's not exactly hard to edit the files by hand but it's a lot faster to use a GUI application and I plan on adding a couple of handy features that will make distributing an update significantly faster if the developer chooses to use Appcastr. 

I'm a bit concerned working on a project like Appcastr. Given that it's aimed at developers, it's much more likely that the source code will be viewed by, and possibly edited by, other developers than my other projects. This means the quality of my code is a lot more important and will probably receive some judgment. Make no mistake, I really want other developers to look at my code and tell me where to improve it. Given that I've taught myself to program, I'm certain that my code is rife with malpractice and things that'd probably make more experienced developers cry. I'd love to hear some constructive criticism about the quality of my code. 

Appcastr version 0.1 was released just yesterday and version 0.1.1 was released this morning. I'm going to work diligently on this project so expect frequent updates. You can get the bleeding edge version of Appcastr by visiting the [project's GitHub page](https://github.com/alexjohnj/appcastr) and checking for the branch which is the most commits ahead (at the time of writing, version 0.2). Be warned though, things could be broken or buggy in that branch. The "master" branch will have more stable code and (should) be a representation of the most recent build available off of the project's [downloads page](https://github.com/alexjohnj/appcastr/downloads). 

---

So they're the two new projects that I've launched recently. My third project, [SymSteam](https://github.com/alexjohnj/symsteam), hasn't received much love recently. It's been stuck on beta 1 for a while. To be honest, I've been using the application day-in-day-out for several months now and haven't noticed any bugs in my usage so I'm tempted to make an icon for the application and release it as version 1.0. Laziness FTW!
