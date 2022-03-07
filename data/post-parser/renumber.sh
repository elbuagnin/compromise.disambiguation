#!/bin/bash
### Renumber the order # in a Parser JSON file.

linenum=0
i=1

while IFS= read -r line; do
  ((linenum=linenum+1))

  if [[ "$line" =~ ^$ ]]
  then
    ((i=i+1))
  fi

  sed -r -i "$linenum s/\"order\": \"[0-9]+\"/\"order\": \"$i\"/" $1
done < $1
