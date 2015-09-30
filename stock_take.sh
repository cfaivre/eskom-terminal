#!/bin/bash

# find out if TCP port 25 open or not
#(echo >/dev/tcp/localhost/25) &>/dev/null && echo "TCP port 25 open" || echo "TCP port 25 close"

#for ((COUNT = 1; COUNT <= 10; COUNT++)); do
#  echo $COUNT
#  sleep 1
#done

declare file="out.txt"

function read_tags {
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

	done
}

read msg

if [ $msg = "start" ]
then
  echo "" > ./out.txt
  read_tags
elif [ $msg = "continue" ]
then
  true
  read_tags
elif [ $msg = "shutdown" ]
then
  sudo halt
  exit
elif [ $msg = "upload" ]
then
  curl --silent --max-time 5 --request PUT --data-urlencode "rfids@out.txt" http://eskom-api.staging.mshini.com/api/stock_take/pi > /dev/null
  EXIT_STATUS=$?
  if [ $EXIT_STATUS != 0 ]
    then
      echo "failure"
      exit
  else
    echo "success"
    exit
  fi
fi

