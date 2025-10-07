// src/index.js
import 'dotenv/config'
import app from './app.js'

const PORT = process.env.PORT || 5174
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
