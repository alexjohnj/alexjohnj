+++
background_image = "/images/projects/PROJECT_NAME/bg-blur.jpg"
project_css_class = "project-julius"
source_url = "https://github.com/alexjohnj/julius/"
dl_url = "https://github.com/alexjohnj/julius/releases/tag/v0.1.1"
title = "julius"
version = "0.1.1"
description = "A simple command line tool for encrypting and decrypting text using the Caesar cipher. It's fast, written in Go and supports IO redirections."
syntax_highlighting = true
+++

julius (with a lowercase j) is a simple command line tool for encrypting and decrypting text using the Caesar cipher. It's fast, cross platform and supports IO redirections. julius has full Unicode support. Although it will only encrypt characters in the Latin alphabet, it won't break if you include other characters too.

By default, julius will encrypt and decrypt messages using a key of 13 so you can easily work with messages encrypted using the [ROT13][rot13-wiki] cipher.

[rot13-wiki]: https://en.wikipedia.org/wiki/ROT13

## Installation

[Pre-compiled][releases-page] binaries are available for 64 bit versions of Linux, OS X and Windows as well as an ARM build for Linux. If you want to compile the program yourself though then this'll get you going:

```bash
go get github.com/alexjohnj/julius
go install github.com/alexjohnj/julius
```

[releases-page]: https://github.com/alexjohnj/julius/releases/tag/v0.1.1

## Usage

To encrypt a message, use the `encrypt` subcommand. You can specify a key using the `--key` flag or use the default key of 13:

```bash
julius encrypt --key=10 "Romani ite domum"
>> Bywkxs sdo nywew
```

To decrypt a message, use the `decrypt` subcommand. Like with the `encrypt` command, you can specify a key using the `--key` flag or use the default key of 13:

```bash
julius decrypt --key=10 "Bywkxs sdo nywew"
>> Romani ite domum
```

julius can read from `stdin` and sends its output to `stdout` so you can use it in Unix redirections:

```bash
julius encrypt < plaintext.txt > ciphertext.txt
```

