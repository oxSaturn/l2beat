import { Router } from 'express'

export function createRouter() {
  const router = Router()

  router.get('/', function (_req, res) {
    res.send('Hello world!')
  })

  return router
}
