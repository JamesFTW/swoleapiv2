.PHONY: help
help: ## describe available commands 
	@echo "Available targets:"
	@grep -E '^[a-zA-Z0-9_%-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

start: ## start the local api server after db is running
	npm run start:dev

stop-db: ## kill and remove the db image
	docker kill db && docker rm db

deps: ## install dependencies
	npm install

seed: ## creates schema and loads seed data from prisma/exerciseseeds after db is running
	npm run db:migrate && npm run db:seed 

db-access: ## access db running in container 
	docker exec -it db psql -U postgres -W      

test: ## Testing via jest 
	npm run test

start-docker: ## starts all items in docker-compose.yml
	docker-compose up

docker-debug-start:
	docker run --interactive --env-file  ./.env --rm --name debug-api -p 3000:3000 swoleapiv2-api sleep infinity"