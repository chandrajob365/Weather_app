const express = require('express')
const app = express()

app.use(express.static('public'))

app.listen(process.env.PORT || 9000, () => {
  console.log('server listening @ ', 9000)
})
