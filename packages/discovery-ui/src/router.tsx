import { Router } from 'express'
import React from 'react'
import { renderPage } from './common/renderPage'
import { HomePage } from './pages/Home'
import { ProjectPage } from './pages/Project'
import { z } from 'zod'
import { openCode } from './commands/openCode'

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

  const CodeQuery = z.object({
    project: z.string(),
    chain: z.string(),
    address: z.string(),
  })
  router.get('/code', function (req, res) {
    const query = CodeQuery.parse(req.query)
    openCode(query.project, query.chain, query.address)
    res.status(204).send('')
  })

  return router
}
