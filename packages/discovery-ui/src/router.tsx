import { Router } from 'express'
import React from 'react'
import { renderPage } from './common/renderPage'
import { HomePage } from './pages/Home'
import { ProjectPage } from './pages/Project'

export function createRouter() {
  const router = Router()

  router.get('/', function (_req, res) {
    const page = renderPage(<HomePage />)
    res.send(page)
  })

  router.get('/p/:project/:chain', function (req, res) {
    const page = renderPage(
      <ProjectPage
        projectName={req.params.project}
        chainName={req.params.chain}
      />,
    )
    res.send(page)
  })

  return router
}
