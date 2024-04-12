import express, { Express } from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import pgSession from 'connect-pg-simple'
import cors from 'cors'
import api from './api'

dotenv.config()

const PgSession = pgSession(session)

const sessionMiddleware = session({
  store: new PgSession({
    conString: process.env.DEV_DATABASE_URL
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
})

const app: Express = express()
const port = process.env.PORT
const db_hostname = process.env.DATABASE_HOSTNAME

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session());
app.use(passport.authenticate('session'));
app.use(helmet())

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://${db_hostname}:${port}`);
});

app.use('/api', api)

module.exports = app
