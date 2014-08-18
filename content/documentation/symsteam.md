+++
title = "SymSteam Documentation"
url = "/projects/symsteam/documentation/"
+++

## Setup

### Preparing Your Steam Folder

1. Connect an external hard drive to your computer that is formatted as a [HFS+ drive](#verifying-drive-format).
2. Open a new Finder window and press &#8679;&#8984;G. In the window that appears, enter the following path: `~/Library/Application Support/Steam/`.
3. In the Steam folder, locate a folder called `SteamApps`. Copy this folder to your external hard drive. This could take a while depending on how many games you have. Go grab a coffee while you're waiting.

### Configuring SymSteam

1. Launch SymSteam. It will prompt you to locate the SteamApps folder on your external hard drive. This is the folder you copied in the last step of “Preparing Your Steam Folder”. Click choose and locate the folder on your external hard drive with all of your games in it. Click next.
2. If everything went successfully, SymSteam will ask if you want it to start on login. You'll probably want to select yes.
3. If something went wrong, have a look at [troubleshooting](#troubleshooting).

## Preferences

### Accessing SymSteam's Preferences Window

There are two ways to access SymSteam's preferences window depending on whether or not SymSteam is running. If SymSteam is running:

1. Find the SymSteam application in your Applications folder. Double click on the application to show the preferences window.

If SymSteam isn't running:

2. Launch SymSteam as normal while holding down the &#8997; key.

### Enabling/Disabling Notifications

If you want to enable/disable the notifications shown by SymSteam when certain events occur:

1. Open SymSteam's preferences window.
2. Under the “General” tab of the preferences window you can toggle notifications by checking/unchecking the “Display Notifications Box”.

## Troubleshooting

### Setup Fails Because the Selected Drive Lacks a UUID

This is likely because the drive isn't formatted as a HFS+ drive. SymSteam uses the UUID (Universally Unique Identifier) of the drive to distinguish it from drives that don't have your Steam folder on it. HFS+ assigns a UUID to your drive while some other filesystems do not.

To format your drive to HFS+, see [Formatting a Drive to HFS+](#formatting-drive).

### SymSteam is Telling me to Check the Console

If something's gone wrong, SymSteam will output a fairly detailed message to the Console explaining what it thinks has gone wrong. This message may include a potential fix to the issue so checking the Console could help you fix a problem you may be having. 

To check the Console:

1. Launch Console.app (Applications > Utilities > Console). 
2. In the filter field in the top right of the Console window, search for “SymSteam”.
3. All of the messages logged by SymSteam will be displayed. Look for the most recent one to see what the problem is and what the fix might be. 

## Resetting SymSteam

### Performing a Partial Reset

A partial reset will cause SymSteam to forget which drive your Steam games are on and will prompt you to rerun setup when you next launch SymSteam. If you are having issues with SymSteam, a partial reset is a good, nondestructive way to try and fix them. 

A partial reset won't delete any of the games you have stored on both your external hard drive or your internal hard drive. SymSteam doesn't touch your games at any stage when performing a partial reset. 

To perform a partial reset:

1. Access SymSteam's [preferences window](#accessing-preferences-window).
2. Click the about button in the preferences window.
3. While holding down the &#8997; key, click on the quit button. 
4. SymSteam will ask if you want to reset SymSteam. Click OK. 

Now, when you next launch SymSteam setup will be rerun. 

### Performing a Full Reset

A full reset combines a partial reset and the deletion of some files. A full reset will require you to rerun setup again. A full reset shouldn't delete any of your Steam games unless you delete the wrong files so exercise some care. To perform a full reset:

1. Perform a [partial reset](#symsteam-partial-reset) of SymSteam and ensure that SymSteam has been quit.
2. Disconnect your external hard drive.
3. Open a Finder window and press &#8679;&#8984;G. In the window that appears, enter the following path: `~/Library/Application Support/Steam/` and press go.
4. Identify the folders/files in the Steam folder called `SteamApps` & `SteamAppsSymb`. 
5. Right click on `SteamApps` and click “Get Info”. In the window that comes up, if the “Kind” of the item is an alias, delete the file. If not, leave the file. 
6. Right click on the `SteamAppsSymb` folder/file and click “Get Info”. If the “Kind” of the item is an alias then delete it, if not, rename the folder to `SteamApps` (this assumes that the file in the previous step called `SteamApps` was an alias and has been deleted).

If you can't find any file/folder called `SteamApps` but do find a folder called `SteamAppsLoc`, rename `SteamAppsLoc` to `SteamApps`.

## Appendix

### Verifying a Drive is HFS+ Formatted

1. Open Disk Utility (Applications > Utilities > Disk Utility) and connect your external hard drive.
2. In the left hand pane of the Disk Utility window, select the partition of your external hard drive that you wish to store your games on. 
3. At the bottom of the Disk Utility window, look to see what the format of the partition is. If it says "Mac OS Extended (Journaled)" then you're all good to go. If not, you'll need to [reformat the drive](#formatting-drive).

### Formatting a Drive to HFS+

**Warning. Formatting a drive will delete everything on the drive. Make sure you have a backup.**

1. Open Disk Utility (Applications > Utilities > Disk Utility) and connect your external hard drive.
2. In the left hand pane of the Disk Utility window, select your external hard drive.
3. In the right hand pane of the Disk Utility window, select the erase tab. 
4. Set the format of the disk to “Mac OS Extended (Journaled)”. Name the disk whatever you wish.
5. Click Erase. **Read the alert that appears carefully and verify that the information shown is correct.** If everything is correct, click OK.
6. Sit back and let Disk Utility work its magic. It should only take a minute or two. 

### SymSteam Terminology

There's a few special names I give different folders in SymSteam. This list might come in handy.

- `SteamApps` folder. This is the folder that all your Steam games are stored in. Steam looks for this folder and loads games from it. 
- `SteamAppsSymb`. This is a symbolic link to a folder called `SteamApps` on your external hard drive. In English: When Steam looks for a `SteamApps` folder SymSteam points it to the `SteamAppsSymb` link which then points to the `SteamApps` folder on your external hard drive. 
- `SteamAppsLoc`. This is the folder on your computer's internal hard drive that houses your games. When your external hard drive isn't plugged in, this folder won't exist and will instead be called `SteamApps`. As soon as you plug your external hard drive in however, `SteamApps` gets renamed to `SteamAppsLoc` so that Steam will ignore this folder and instead pay attention to the folder on your external hard drive. 
