#!/usr/bin/env bash

NOW_VARS=$(printenv | grep '^NOW')
NOW_VARS_ARR=(`echo ${NOW_VARS}`);
JSON_STRING='{ '
for var in "${NOW_VARS_ARR[@]}"
do
    var_str=$(echo $var | tr '=' '\n')
    var_arr=(`echo ${var_str}`)
    key=${var_arr[0]}
    val=${var_arr[1]}
    JSON_STRING+="\n  \"${key}\": \"${val}\","
done
echo -e "${JSON_STRING::-1}\n}" > ./src/static/version.json
