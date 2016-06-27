#!/bin/bash
set -x
#check set config script
if [ ! -f /usr/share/nginx/html/update.sh ]; then
    echo "update.sh doesn't exists." && exit
fi
# set js config
cd /usr/share/nginx/html && chmod +x update.sh && ./update.sh
# run nginx
nginx