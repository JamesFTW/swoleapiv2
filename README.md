
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
npm run db:start

## Show running containers 
docker ps 

## Take the NAME of the container from the docker ps step and execute it with bash 
docker exec -it name_here bash

## Auth into the mysql db
mysql -uroot -ppassword
```

As well as add the following line to your project .env if you are working locally 
`
DATABASE_URL="mysql://root:password@localhost:3306/swole"
DATABASE_PASSWORD="password" 
`