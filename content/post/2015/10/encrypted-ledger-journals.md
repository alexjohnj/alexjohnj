+++
title = "Using Ledger With an Encrypted Journal"
date = "2015-10-15T17:00:00-06:00"
syntax_highlighting = true
+++

I'm a pretty big fan of [Ledger][ledger-homepage], a command line
accounting system based on the double entry bookkeeping system. One of
its strengths lies in the fact that the journal file that contains
your transactions is a plain text file. This makes it super easy to
sync the journal using your favourite file syncing service. Of course,
before putting the journal file on a remote server, you'll probably
want to encrypt it. Ledger program doesn't support encrypted journal
files but, using [GPG][gpg-homepage] and a shell alias, you can get
the vast majority of Ledger's functionality to work with an encrypted
journal.

[ledger-homepage]: http://ledger-cli.org

[gpg-homepage]: https://gnupg.org
<!--more-->

To read the encrypted journal, I use a simple shell alias to pipe the
output of `gpg` into `ledger`, telling it to read from `stdin`. For
the fish shell, the alias I use is:

```sh
alias eledger "gpg --batch -d -q $LEDGER_FILE | ledger -f - "
```

Adjust this for your shell of choice. Here I've assumed you've defined
the `$LEDGER_FILE` env variable, which Ledger uses by default. I'm
also running `gpg` in batch mode, which suppresses most of its
output. Remove the `--batch` flag if you'd rather see this output (it
won't get piped into Ledger).

Use this alias like you'd use the `ledger` command. Any commands or
arguments get added to the end of the alias and passed on to
ledger. The majority of Ledger's commands will work using this
method. Only commands that rely on the journal's path will fail.

## Editing

If you edit your Ledger journal in Emacs then good news, Emacs will
decrypt the journal file automatically and encrypt it when you
save. Even better news, if you use `ledger-mode` in Emacs, the
majority of commands (in my testing) continue to work as normal.

