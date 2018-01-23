
# @note below commands babal compiles specific files
# babel  lib/graphi/src/schema.js --out-file ./lib/graphi/dist/schema.js --out-dir lib/graphi/src
# babel lib/graphi/src/data.js --out-file ./lib/graphi/dist/data.js --out-dir lib/graphi/src

# compile all files in directory to /dist directory

babel lib/graphi/src  --out-dir lib/graphi/dist

echo "Cleaned and rebuilt graphi schema"
