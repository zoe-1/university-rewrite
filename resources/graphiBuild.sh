

rm -f lib/graphi/dist/schema.js
rm -f lib/graphi/dist/data.js

babel lib/graphi/src/schema.js --out-file ./lib/graphi/dist/schema.js

babel lib/graphi/src/data.js --out-file ./lib/graphi/dist/data.js

echo "Built graphi schema"
