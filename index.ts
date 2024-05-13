require('module-alias/register')
import express, { Express } from 'express'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import passport from 'passport'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import api from './api'
import pgSession from 'connect-pg-simple'
import * as Sentry from '@sentry/node'

const app: Express = express()

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Express({ router: api }),
    new Sentry.Integrations.Http({ tracing: true }),
  ],
})

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

const port = process.env.PORT

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.errorHandler())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(sessionMiddleware)
app.use(passport.initialize())
app.use(passport.session())
app.use(passport.authenticate('session'))
app.use(helmet())
app.use('/api', api)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})

export default app
