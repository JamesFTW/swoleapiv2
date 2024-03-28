import express, { Express } from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import mysql from 'mysql2'
import cors from 'cors'
import api from './api'

dotenv.config()

const MySQLStore = require('express-mysql-session')(session)
// const connection = mysql.createConnection(process.env.DATABASE_URL!)
const connection = mysql.createConnection({
  port: 3306,
  password: 'password',
  host: 'localhost',
  user: 'root',
  database: 'swole',
});
const sessionStore = new MySQLStore({}, connection);

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: false
  },
  store: sessionStore
}));
app.use(passport.initialize())
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(helmet())

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use('/api', api)

module.exports = app
