import express from 'express'
import { STATIC_PATH } from './constants'
import { createRouter } from './router'

const app = express()
const router = createRouter()
app.use(router)
app.use(express.static(STATIC_PATH))

const port = 3000
app.listen(port, () => {
  console.log('Listening on: http://localhost:3000')
})
