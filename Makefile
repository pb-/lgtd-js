up: node_modules
	yarn start
.PHONY: up

node_modules:
	yarn install
