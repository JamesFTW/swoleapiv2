#api/Dockerfile
FROM node:18

WORKDIR /

COPY package*.json package-lock.json ./

RUN npm install
COPY .env_docker .env

# Ports 
ENV PORT=3000
EXPOSE 3000

# Ensure entrypoint script has execute permissions
COPY setup_db.sh /
RUN chmod +x /setup_db.sh

COPY . .

CMD chmod +x /setup_db.sh && /bin/bash -c "/setup_db.sh && npm run start:dev"
