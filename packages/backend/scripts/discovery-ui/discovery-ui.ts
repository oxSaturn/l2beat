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
  res.render('home4')
})

app.post('/greet', (req, res) => {
  const name = req.body.name || 'World'
  res.render('partials/greeting', { name }, (err, html) => {
    res.send(html)
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
