up: node_modules
	yarn start
.PHONY: up

node_modules: package.json
	yarn install
