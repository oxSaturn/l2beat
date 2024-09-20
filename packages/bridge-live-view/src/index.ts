import express from 'express'
import { createRouter } from './router'

const app = express()
const router = createRouter()
app.use(router)

const port = 3000
app.listen(port, () => {
  console.log('Listening on: http://localhost:3000')
})
