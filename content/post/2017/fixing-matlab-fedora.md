+++
title = "Fixing MATLAB on Fedora"
author = "Alex Jackson"
date = 2017-03-10T15:00:00Z
tags = ["matlab", "linux"]
+++

The other week I had to set up a new installation of MATLAB r2016a on a
(somewhat) fresh Fedora installation. After running the installer, I ran into a
bunch of library errors when trying to run external C++ programs[^fish-matlab]
from MATLAB or when trying to plot something. When running an external C++
program, MATLAB would complain about missing versions of `CXXABI` and `GLIBCXX`
in `libstdc++`[^1]. When plotting something, MATLAB would complain about
`libmwosgserver.so`.

[^1]: Really it was the external program complaining, not MATLAB.
[^fish-matlab]: Since I use fish as my shell, that meant any external command.

<!--more-->

The first problem is caused by MATLAB trying to use its own, older version of
`libstdc++`. The second problem is caused by MATLAB trying to use the system's
version of `libmwosgserver`. To fix the error when running C++ programs, I had
to tell MATLAB to use the system's version of `libstdc++`. To fix the error when
plotting, I had to tell MATLAB to use its own OpenGL libraries rather than the
system's.

The fixes are easy to make, you need to edit a couple of lines in a startup
script. First of all, find out where the system's version of `libstdc++` is
located (`$` indicates text to enter in a shell):

``` shell
$ find /usr -name 'libstdc++.so.6' -exec dirname '{}' \;
/usr/local/MATLAB/R2016a/sys/os/glnxa64
/usr/lib64
/usr/lib
```

The first line is MATLAB's version of the library, the second the system's
64-bit version of the library, the third the system's 32-bit version. If you're
somehow still on a 32-bit system you'll need to note down the path
`/usr/lib`. Otherwise, the path you need is `/usr/lib64`. Now you need to edit
MATLAB's init script. The exact location will depend on where you installed
MATLAB to. Assuming you installed MATLAB into the `/usr/local` directory then
you'll need to edit `/usr/local/MATLAB/R2016a/bin/.matlab7rc.sh`.

This script is essentially a massive switch statement that sets different
environment variables depending on which operating system and architecture
you're on. Find the case statement corresponding to your architecture (`glnxa64`
for 64-bit Linux) which will look something like this:

``` shell
case "$ARCH" in
    glnx86|glnxa64)
```

For me that was around line 164 but it will probably depend on which version of
MATLAB you're running. Inside this case, find the line that says

``` shell
LDPATH_PREFIX=""
```

and change it to

``` shell
LDPATH_PREFIX="$MATLAB/sys/opengl/lib/$ARCH:/usr/lib64"
```

This pushes MATLAB's OpenGL libraries and the system's C++ libraries to the
front of MATLAB's load path, forcing it to use those versions of the
libraries. Save the file, restart MATLAB and you should be good to go.
