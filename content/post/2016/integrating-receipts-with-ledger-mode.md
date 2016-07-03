+++
title = "Integrating Receipts with ledger-mode"
date = "2016-07-02T16:00:00Z"
tags = ["emacs", "ledger"]
+++

I've written a couple of functions for Emacs' ledger-mode that make working with
receipts a bit easier. With the cursor on a transaction, calling
`alex/ledger-attach-receipt` will prompt for a file. This function copies the
file to a receipts directory, renaming it to its hash and sorting it in
subdirectories according to the transaction's year and month[^sorting]. Finally,
the function adds a comment to the transaction with the hash of the file. The
function `alex/ledger-open-attached-receipt` reads this comment and opens the
associated file in Emacs. The receipts folder can be customised through the
variable `alex/ledger-receipt-folder`.

[^sorting]: With the default receipt folder, files get copied to `~/finance/receipts/$YEAR/$MONTH`.

<!--more-->

``` emacs-lisp
(defvar alex/ledger-receipt-folder "~/finance/receipts")
(defun alex/ledger-get-xact-date ()
"Read the effective date (before =) of a
transaction. Returns the date as a time value."
(save-excursion
    (ledger-navigate-beginning-of-xact)
    (re-search-forward ledger-iso-date-regexp)
    (encode-time 0 0 0 (string-to-number (match-string 4))
                (string-to-number (match-string 3))
                (string-to-number (match-string 2)))))

(defun alex/ledger-construct-receipt-path (date hash &optional ext)
"Construct a path to a receipt file. DATE is a time value. HASH is a
string. EXT is the file extension (with dot) and defaults to .pdf"
(unless ext (setq ext ".pdf"))
(concat (file-name-as-directory alex/ledger-receipt-folder)
        (file-name-as-directory (format-time-string "%Y" date))
        (file-name-as-directory (format-time-string "%m" date))
        hash
        ext))

(defun alex/ledger-attach-receipt ()
"Prompt for a receipt file, calculate its hash and move the file to
alex/ledger-receipt-folder, renaming it to its hash. Inserts the new file name
as a comment to the transaction."
(interactive)
(let* ((fname (read-file-name "Receipt File Name:"))
        (fhash (with-temp-buffer
                (insert-file-contents fname)
                (secure-hash 'sha1 (current-buffer))))
        (xdate (alex/ledger-get-xact-date))
        (newpath (alex/ledger-construct-receipt-path xdate fhash (file-name-extension fname t))))
    (mkdir (file-name-directory newpath) t)
    (copy-file fname newpath)
    (save-excursion
    (ledger-navigate-beginning-of-xact)
    (end-of-line)
    (insert "\n; Receipt: " fhash (file-name-extension fname t))
    (indent-line-to ledger-post-account-alignment-column))))

(defun alex/ledger-open-attached-receipt ()
"Open the receipt file specified by the Receipt tag in a new buffer."
(interactive)
(save-excursion
    (ledger-navigate-beginning-of-xact)
    (let* ((xact-date (alex/ledger-get-xact-date))
            (xact-end (save-excursion (ledger-navigate-end-of-xact)))
            (receipt-pos (re-search-forward "; Receipt: \\(.*\\)" xact-end t nil))
            (receipt-hash-fname (match-string 1)))
    (when (not receipt-pos) (error "No receipt found for current transaction"))
    (find-file (alex/ledger-construct-receipt-path xact-date
                                                    (file-name-base receipt-hash-fname)
                                                    (file-name-extension receipt-hash-fname t))))))
```

With evil-leader, I've bound the attach and open functions to `SPC-i` and
`SPC-I` respectively. Combined with git, I've found these functions work nicely
for sorting scans of receipts.
