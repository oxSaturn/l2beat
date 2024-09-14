import { spawn } from 'child_process'
import path from 'path'
import express from 'express'
import { engine } from 'express-handlebars'

const app = express()
const port = 3000

// Set up Handlebars
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
// Add views directory, but relative to current's file directory:
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.render('home')
})

app.get('/greet', (req, res) => {
  const { name } = req.query
  res.render('partials/greeting', { name }, (err, html) => {
    res.send(html)
  })
})

// Function to properly format SSE messages
function sendSSE(res: express.Response, data: string, event?: string) {
  data = data.replace(/[\r\n]+/g, '\n') // Normalize newlines
  const lines = data.split('\n')
  lines.forEach((line) => {
    res.write(`data: ${line}\n`)
  })
  res.write('\n')
  if (event) {
    res.write(`event: ${event}\n`)
    res.write('\n')
  }
}

// Endpoint to start the command and return the SSE connection div
app.get('/start-command', (req, res) => {
  // Return a div with SSE attributes
  res.send(`
      <div
          hx-ext="sse"
          sse-connect="/stream"
          sse-swap="message"
          sse-close="done"
          hx-swap="beforeend"
          id="output"
          style="white-space: pre-wrap; font-family: monospace;"
      ></div>
  `)
})

// SSE endpoint that runs the command and streams output
app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.flushHeaders()

  const cmd = 'ls'
  const args = ['-ll']

  const process = spawn(cmd, args)

  process.stdout.on('data', (data) => {
    const message = data.toString()
    sendSSE(res, message)
  })

  process.stderr.on('data', (data) => {
    const message = data.toString()
    sendSSE(res, message)
  })

  process.on('close', (code) => {
    // Send an event to indicate completion
    sendSSE(res, `Command exited with code ${code}`, 'done')
    // Do not call res.end(); let htmx handle the closure
  })

  // Handle client disconnection
  req.on('close', () => {
    console.log('Client disconnected')
    process.kill()
    res.end()
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
