#!/bin/bash
### Renumber the batchOrders in the JSON files within the CWD.

# echo text niceties
bold=$(tput bold)
normal=$(tput sgr0)

# Does target file exist? If not, leave.
target=$1
if [ -z $target ]
then
  echo $bold
  echo 'Please provide a filename to begin renumbering from.'
  echo 'Choices include:'
  echo $normal
  ls *.json
  echo ''
  exit 0
fi

# Find the batchOrder # from target files
targetMatch=$(grep -E -o -m 1 '"batchOrder": "[0-9]+"' $target)
targetNumber=$(echo $targetMatch| sed 's/[^0-9]//g')
echo "Target File is $target"
echo "Target batchOrder # is $targetNumber"
echo ''

# Get the remaining .json files and their batchOrder numbers if their number is => than the target file.
declare -a files
declare -a orderNumbers
shopt -s lastpipe
find . -type f -name '*.json' -print0 | while IFS= read -r -d '' file; do
  if [ "$file" != "./$target" ]
  then
    match=$(grep -E -o -m 1 '"batchOrder": "[0-9]+"' $file)
    number=$(echo $match| sed 's/[^0-9]//g')
    if [ $number -ge $targetNumber ]
    then
      fileinfo="$number:$file"
      files+=($fileinfo)
      orderNumbers+=($number)
    fi
  fi
done

# Make sure remaining file batchOrder numbers are unique. Otherwise, this will not work.
IFS=$'\n' uniq=($(sort -n -u <<<"${orderNumbers[*]}"))
unset IFS

uniqCount=${#uniq[*]}
orderNumbersCount=${#orderNumbers[*]}

if [ $uniqCount -ne $orderNumbersCount ]
then
  echo $bold
  echo 'The batchOrder #s in the other files are not unique.'
  echo 'They need to be unique for this operation to proceed.'
  echo $normal

  exit 0
fi

# Sort the arrays
IFS=$'\n' sortedOrderedNumbers=($(sort -n <<<"${orderNumbers[*]}"))
unset IFS

declare -a sortedFiles
for ((i=0; i<${#sortedOrderedNumbers[*]}; i++));
do
  for ((j=0; j<${#files[*]}; j++));
  do
    sortedOrderedNumbersContains=${sortedOrderedNumbers[$i]}
    fileContains=$(echo ${files[j]} | sed 's/[^0-9]*//g')

    if [ $sortedOrderedNumbersContains -eq $fileContains ]
    then
      targetfile=${files[$j]}
      remove="${sortedOrderedNumbers[$i]}:"
      filename=${targetfile#${remove}}
      sortedFiles[$i]=$filename
    fi

  done
done

# Now update the batchOrder #'s
last=$targetNumber

for ((i=0; i<${#sortedFiles[*]}; i++));
do
  editfile=${sortedFiles[$i]}
  old=${sortedOrderedNumbers[$i]}
  diff=$(( old-last ))
  case "$diff" in
    0) new=$(($old+1));;
    1) new=$(($old));;
    *) new=$(($old-($diff-1)))
  esac

  if [ $new -ne $old ]
  then
    sed -r -i "s/\"batchOrder\": \"[0-9]+\"/\"batchOrder\": \"$new\"/g" $editfile
    echo "$editfile has batchOrder # of $old. Changing to $new."
    ((last++))
  fi

done

echo $bold
echo "Finished"
echo $normal
