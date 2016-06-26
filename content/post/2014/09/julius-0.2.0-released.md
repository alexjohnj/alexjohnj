+++
date = "2014-09-09T14:02:51+01:00"
title = "julius 0.2.0 Released"
+++

Besides the [project page][julius-project-page], I haven't written about julius on this blog before so here's a quick overview. julius is a stupidly simple command line tool for encrypting and decrypting text using the Caesar Cipher. It's designed to play nicely with Unix redirections so you can use it to easily encrypt/decrypt the output of commands.

[julius-project-page]: /projects/julius/

<!--more-->

Everyone knows that the Caesar cipher is unbelievably weak which is why nobody in their right mind uses it for anything serious. Version 0.2.0 of julius highlights this weakness by adding the `brute` subcommand. Using this command, julius will try every possible key for an encrypted message and output the plaintext. Because there's only 25 possible keys, this takes next to no time to run even on very modest hardware.

As an example, here's some benchmarks performed on a Raspberry Pi Model B+ running ArchLinux:

| Text to Brute-force                   | Text Size (Bytes)     | Time Taken (ms)     |
| :---------------------:               | :-------------------: | :-----------------: |
| "Hello, world!"                       | 14                    | 4.18                |
| [julius sourcecode][julius-source]    | 6007                  | 56.42               |
| [Alice in Wonderland][alice-fulltext] | 167518                | 1080.00             |

[julius-source]: https://github.com/alexjohnj/julius/blob/master/julius.go

[alice-fulltext]: http://www.gutenberg.org/cache/epub/11/pg11.txt

On more powerful hardware (like, say, a MacBook Air), it takes julius no time at all to brute force a message.

You can download 0.2.0 today from the [GitHub releases][julius-releases] page. There's builds available for 64 bit versions of OS X, Linux and Windows as well as an ARM build for Linux.

[julius-releases]: https://github.com/alexjohnj/julius/releases/tag/v0.2.0
