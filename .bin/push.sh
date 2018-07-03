#!/bin/bash
host='redro2.2018ieemcamp.me'
username='pp253'

echo "Connecting to $host via sftp."

sftp $username@$host < ./.bin/script.sh
