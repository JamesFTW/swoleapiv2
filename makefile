start:
	npm run start:dev

deps: 
	npm install

seed:
	npm run db:migrate && npm run db:seed 