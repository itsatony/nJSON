#!/bin/sh
curl -include --insecure  --header "X-Requested-With: XMLHttpRequest" -H 'Content-Type:application/json' -H 'Accept: application/json' --data-binary @$1 https://njson.itsatony.com?id=$2 
