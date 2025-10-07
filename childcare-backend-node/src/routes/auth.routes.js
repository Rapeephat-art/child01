// src/routes/auth.routes.js
import { Router } from 'express'
import * as auth from '../controllers/auth.controller.js'
import { authRequired } from '../middleware/auth.js'

const r = Router()

r.post('/register', auth.register)
r.post('/login', auth.login)
r.post('/logout', authRequired, auth.logout)

export default r
