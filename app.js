const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.send('index')
})
app.listen(8000, () => {
  console.log('server listening @ ', 8000)
})
