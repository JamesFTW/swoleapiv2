import express, { Express } from 'express'
import helmet from 'helmet'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import api from './api'
import pgSession from 'connect-pg-simple'

const PgSession = pgSession(session)

const sessionMiddleware = session({
  store: new PgSession({
    conString: process.env.DATABASE_URL,
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
})

const app: Express = express()
const port = process.env.PORT

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))
app.use(helmet())

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

app.use('/api', api)

module.exports = app
