.PHONY: help
help: ## describe available commands 
	@echo "Available targets:"
	@grep -E '^[a-zA-Z0-9_%-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start: ## start the local api server after db is running
	npm run start:dev

start-db-dev: ## start the local api server "docker build -t db . && docker run -d -p 3306:3306 db",
	npm run db:start:dev

stop-db: ## kill and remove the db image
	docker kill db && docker rm db

deps: ## install dependencies
	npm install

seed: ## creates schema and loads seed data from prisma/exerciseseeds after db is running
	npm run db:migrate && npm run db:seed 

sql-access: ## generates dialog for how to access the sql server manually for testing 
	docker ps && echo "\n1. 'docker exec -it db bash'\n" && echo "Then 2. 'mysql -uroot'"

test: ## Testing via jest 
	npm run test