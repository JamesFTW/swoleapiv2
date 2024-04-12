
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

## Build and run docker containers locally
docker compose -f "docker-compose.yml" up -d --build 

## Auth into local docker db
make db-access
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