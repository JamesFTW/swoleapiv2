import express, { Express } from 'express'
import dotenv from 'dotenv'
import api from './api'
import helmet from "helmet";

dotenv.config()

const app: Express = express()
const port = process.env.PORT

app.use(express.urlencoded())
app.use(helmet())

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

app.use('/api', api)

module.exports = app
