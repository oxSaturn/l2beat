import { Router } from 'express'
import React from 'react'
import { Home } from './Home'
import { renderPage } from './renderPage'

export function createRouter() {
  const router = Router()

  router.get('/', function (_req, res) {
    const page = renderPage(<Home />)
    res.send(page)
  })

  return router
}
