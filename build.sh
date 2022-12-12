rm -rf dist
mkdir -p dist
node ./node_modules/.bin/babel src --out-dir ./dist --copy-files --no-copy-ignored --ignore **/__test__