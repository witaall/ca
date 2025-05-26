import express from 'express'
import 'reflect-metadata'
import container from '../../infrastructure/inversify/inversify.config'
import { TYPES } from '../../infrastructure/inversify/types'
import { type AuthController } from '../controllers/authController'
import { type OrderController } from '../controllers/orderController'

const router = express.Router()

router.post('/orders', container.get<OrderController>(TYPES.OrderController).createOrder)
router.get('/orders', container.get<OrderController>(TYPES.OrderController).getOrderList)

router.post('/auth/register', container.get<AuthController>(TYPES.AuthController).register)

export default router
