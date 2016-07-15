#!/bin/bash
webpack
echo -e "Enter commit message: "
read
git commit -a -m "$REPLY"