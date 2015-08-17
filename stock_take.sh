#!/bin/bash

# find out if TCP port 25 open or not
#(echo >/dev/tcp/localhost/25) &>/dev/null && echo "TCP port 25 open" || echo "TCP port 25 close"

#for ((COUNT = 1; COUNT <= 10; COUNT++)); do
#  echo $COUNT
#  sleep 1
#done

declare file="out.txt"

read msg

if [ $msg = "start" ]
then
  echo "" > ./out.txt
elif [ $msg = "continue" ]
then
  true
elif [ $msg = "upload" ]
then
  curl --data-urlencode "file@out.txt" http://apps.staging.mshini.com/api/test
  exit
fi

exec 3<>/dev/tcp/speedwayr-10-e3-04.local/14150
while read LINE <&3
do
  declare regex="$LINE"
  declare file_content=$( cat "${file}" )


  if [[ " $file_content " =~ $regex ]]
  then
    true
  else
    echo $LINE
    echo $LINE >> ./out.txt
  fi

  sleep 0.2
done
