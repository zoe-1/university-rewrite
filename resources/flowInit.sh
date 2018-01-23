
rm -f lib/graphi/dist/schema.js
rm -f lib/graphi/dist/data.js

babel lib/graphi/src/schema.js --out-file ./lib/graphi/dist/schema.js

babel lib/graphi/src/data.js --out-file ./lib/graphi/dist/data.js

flow init

# flow

flow status # runs as background proces

echo "Built graphi schem - flowInit"
