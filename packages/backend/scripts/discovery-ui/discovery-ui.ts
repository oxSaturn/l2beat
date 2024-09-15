import path from 'path'
import { ConfigReader } from '@l2beat/discovery'
import express from 'express'
import { engine } from 'express-handlebars'
import { getSSEDiv, streamCLI } from './streamCLI'

export const app = express()
const port = 3000

const configReader = new ConfigReader()

// Set up Handlebars
const hbs = engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
})

app.engine('handlebars', hbs)
app.set('view engine', 'handlebars')
// Add views directory, but relative to current's file directory:
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
  res.render('home')
})

// get url /project/:chain/ and render home.handlebars, passing chain
app.get('/projects/:chain/:project', (req, res) => {
  const { chain, project } = req.params
  res.render('project', { chain, project })
})

app.get('/greet', (req, res) => {
  const { name } = req.query
  res.render('partials/greeting', { name, layout: false }, (_err, html) => {
    res.send(html)
  })
})

// Endpoint to start the command and return the SSE connection div
app.get('/start-command', (req, res) => {
  const { terminalId } = req.query
  if (terminalId === undefined) {
    throw new Error('Missing terminalId')
  } else {
    res.send(getSSEDiv('/stream-command', terminalId.toString()))
  }
})

app.get('/stream-command', (req, res) => {
  // streamCLI(req, res, 'ls', ['-la'])
  streamCLI(req, res, 'yarn', ['discover', 'ethereum', 'zora', '--dev'])
})

app.get('/partials/projects-list', async (_req, res) => {
  const chainConfigs = await Promise.all(
    configReader
      .readAllChains()
      .flatMap((chain) => configReader.readAllConfigsForChain(chain)),
  )
  const projects = chainConfigs.map((config) => ({
    name: config.name,
    chain: config.chain,
  }))

  res.render(
    'partials/projectsList',
    { projects, layout: false },
    (_err, html) => {
      res.send(html)
    },
  )
})

app.get('/partials/cli-terminal', async (_req, res) => {
  res.render('partials/cliTerminal', { layout: false }, (_err, html) => {
    res.send(html)
  })
})

app.get('/partials/json-view', async (_req, res) => {
  const contentRaw = configReader.readDiscovery('zora', 'ethereum')
  const content = JSON.stringify(contentRaw, null, 2)
  res.render('partials/jsonView', { content, layout: false }, (_err, html) => {
    res.send(html)
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
