#!/bin/bash

case $1 in
  -i | --import )
    mongo oxifood --eval "db.comedorias.drop()" &&
    mongoimport --db oxifood --collection comedorias --file comedorias.json
  ;;
  -e | --export)
    mongoexport --db oxifood --collection comedorias --out comedorias.json
  * )
    exit 1
esac
