
## 📖 How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/JamesFTW/swoleapiv2.git

# Go into the repository
$ cd swoleapiv2

# Install dependencies
$ npm install

# Run the app
$ npm run start:dev

Once the server is running, you can access API endpoints locally using tools like Postman or cURL.
```


## Docker Instructions 
For the database there is some minimal setup with docker requred. 
Install the desktop app and the docker cli tools 

```bash

## Build and run the docker container locally
make start-db-dev-docker

## Show running containers 
docker ps 

## Take the NAME of the container from the docker ps step and execute it with bash 
docker exec -it db bash

## Auth into the mysql db
mysql -uroot
```

As well as add the following line to your project .env if you are working locally 
`
DEV_DATABASE_URL="postgresql://postgres:pw@localhost:5432/swole"
DATABASE_USER="postgres"
DATABASE_PASSWORD="pw"
DATABASE_HOSTNAME="db"
DATABASE_PORT=5432
PORT=3000
`