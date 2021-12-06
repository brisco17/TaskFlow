#!/bin/bash

# colors
RED='\033[0;31m'
GREEN='\033[0;32m'
# are we testing localhost or production urls
in=$1
if [ "$in" == "localhost" ] 
then
    URL="http://0.0.0.0:8000"
elif [ "$in" == "production" ] 
then
    URL="https://young-chow-productivity-app.herokuapp.com"
else
    echo -e "${RED}Please enter either localhost for local testing or production for production testing"
    exit
fi

# check for httpie 
if [ -z $(which http) ] 
then
    echo -e "${RED}Please install httpie from your package manager"
fi

if [ -z $(which jq) ] 
then
    echo -e "{RED}Please install jq from your package manager"
fi

#Sign in token
TOKEN=$( http POST ${URL}/auth/token/login/ email=dummy@gmail.com password=NotAUser | jq '.auth_token' )

if [ -z $TOKEN ]
then
    http POST ${URL}/auth/users/ email=dummy@gmail.com password=NotAUser
    TOKEN=$(http POST ${URL}/auth/token/login/ email=dummy@gmail.com password=NotAUser | jq '.auth_token' )
fi
# format the token you recieve to not have "" around it
TOKEN=$( echo $TOKEN | sed 's/\"//g' )

#define the header for easy access
HEADER="Authorization:Token $TOKEN"

# run get on the endpoints to make sure they are working
for ENDPOINT in settings tasks tags
do
    OUT=$(http GET $URL/$ENDPOINT/ "$HEADER")
done

#the names for posts are different, so these must be done outside of for loop
# SETTINGS TEST
NAME="bash test"
DESCRIPTION="I am testing this endpoint with bash"
OUT=$( http POST $URL/settings/ name="$NAME" value="$DESCRIPTION" "$HEADER" )
ID=$( echo $OUT | jq '.id' ) 

if [ -z "$ID" ]
then
    echo -e "${RED}Creating a new setting failed."
    exit
fi

OUT=$( http DELETE "$URL/settings/$ID" "$HEADER" )
if [ ! -z "$OUT" ]
then
    echo -e "${RED}Deleting the new setting failed."
    exit
else
    echo -e "${GREEN}Settings tests passed."
fi

# TAG TESTS
OUT=$( http POST $URL/tags/ title="$NAME" description="$DESCRIPTION" "$HEADER" )
ID=$( echo $OUT | jq '.pk' ) 

if [ -z "$ID" ]
then
    echo -e "${RED}Creating a new tag failed."
    exit
fi

OUT=$( http DELETE "$URL/tags/$ID" "$HEADER" )
if [ ! -z "$OUT" ]
then
    echo -e "${RED}Deleting the new tag failed."
    exit
else
    echo -e "${GREEN}Tag tests passed."
fi

# TASK TESTS
OUT=$( http POST $URL/tasks/ title="$NAME" description="$DESCRIPTION" due_date="2021-12-25" "$HEADER" )
ID=$( echo $OUT | jq '.id' ) 

if [ -z "$ID" ]
then
    echo -e "${RED}Creating a new task failed."
    exit
fi

OUT=$( http DELETE "$URL/tasks/$ID" "$HEADER" )
if [ ! -z "$OUT" ]
then
    echo -e "${RED}Deleting the new task failed."
    exit
else
    echo -e "${GREEN}Task tests passed."
fi