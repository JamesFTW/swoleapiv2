import express, { Express } from 'express'
import dotenv from 'dotenv'
import api from './api'
import helmet from 'helmet'
import passport from 'passport'
// import session from 'express-session'
import cookieParser from 'cookie-parser'
// const MySQLStore = require('express-mysql-session')(session);

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(cookieParser())
app.use(express.urlencoded())
app.use(passport.initialize())

// const options = {
// 	host: 'aws.connect.psdb.cloud',
// 	port: 3000,
// 	user: '14ua090vs0ajjuj7jh53',
// 	password: 'pscale_pw_5hRjOd2ofNDorKwv2wxuLorZZS66gmEJtrCZiY99yUD',
// 	database: 'swoleproddb'
// };

// const sessionStore = new MySQLStore(options);

// app.use(session({
//   secret: 'keyboard cat',
//   resave: false, // don't save session if unmodified
//   saveUninitialized: false, // don't create session until something stored
//   cookie: {
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     secure: false
//   },
//   store: sessionStore
// }));


// app.use(passport.authenticate('session'));

app.use(helmet())

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use('/api', api)

module.exports = app
