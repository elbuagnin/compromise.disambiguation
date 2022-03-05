#!/bin/bash

curlwithcode() {
    code=0
    # Run curl in a separate command, capturing output of -w "%{http_code}" into statuscode
    # and sending the content to a file with -o >(cat >/tmp/curl_body)
    statuscode=$(curl -w "%{http_code}" \
        -o >(cat >/tmp/curl_body) \
        "$@"
    ) || code="$?"

    body="$(cat /tmp/curl_body)"
    echo "statuscode : $statuscode"
    echo "exitcode : $code"
    echo "body : $body"
}

curlwithcode localhost:8080
if [[ $statuscode != '200' ]]; then
    sleep 1
    curlwithcode localhost:8080
fi
