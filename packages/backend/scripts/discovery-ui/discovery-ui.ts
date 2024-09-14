import path from 'path'
import express from 'express'
import { engine } from 'express-handlebars'
import { getSSEDiv, streamCLI } from './streamCLI'

export const app = express()
const port = 3000

// Set up Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
// Add views directory, but relative to current's file directory:
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (_, res) => {
  res.render('home')
})

app.get('/greet', (req, res) => {
  const { name } = req.query
  res.render('partials/greeting', { name }, (_err, html) => {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
