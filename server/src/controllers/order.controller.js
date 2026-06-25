import { prisma } from '../lib/prisma.js'

/* ── Create order ── */
export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, notes } = req.body
    const { firstName, lastName, email, phone, street, city, state, zip, country } = shippingAddress

    if (!items?.length) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' })
    }

    // Validate all products exist and have stock
    const productIds = items.map(i => i.productId)
    const products   = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } })

    if (products.length !== productIds.length) {
      return res.status(400).json({ success: false, message: 'One or more products not found.' })
    }

    // Build order items and calculate totals
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.productId)
      if (!product) throw new Error(`Product ${item.productId} not found`)
      if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.title}`)

      const price = product.price * (1 - product.discountPercentage / 100)
      return {
        productId: product.id,
        title:     product.title,
        price,
        quantity:  item.quantity,
        thumbnail: product.thumbnail,
      }
    })

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)
    const shipping = subtotal > 100 ? 0 : 9.99
    const tax      = subtotal * 0.075
    const total    = subtotal + shipping + tax

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Decrease stock
      await Promise.all(
        orderItems.map(item =>
          tx.product.update({
            where: { id: item.productId },
            data:  { stock: { decrement: item.quantity } },
          })
        )
      )

      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId: req.user.id,
          firstName, lastName, email, phone,
          street, city, state, zip,
          country: country || 'Nigeria',
          subtotal, shipping, tax, total, notes,
          items: { create: orderItems },
        },
        include: { items: true },
      })

      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId: req.user.id } })

      return newOrder
    })

    res.status(201).json({
      success: true,
      message: 'Order created!',
      data: { order },
    })
  } catch (err) { next(err) }
}

/* ── Get user orders ── */
export const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const skip = (Number(page) - 1) * Number(limit)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: req.user.id },
        include: { items: true, payment: true },
        orderBy: { createdAt: 'desc' },
        skip, take: Number(limit),
      }),
      prisma.order.count({ where: { userId: req.user.id } }),
    ])

    res.json({
      success: true,
      data: { orders, pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) } },
    })
  } catch (err) { next(err) }
}

/* ── Get single order ── */
export const getOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true, payment: true },
    })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    res.json({ success: true, data: { order } })
  } catch (err) { next(err) }
}

/* ── Cancel order ── */
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: req.params.id, userId: req.user.id },
      include: { items: true },
    })
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' })
    if (!['PENDING', 'PAID'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage.' })
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({ where: { id: order.id }, data: { status: 'CANCELLED' } })
      // Restore stock
      await Promise.all(
        order.items.map(item =>
          tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } })
        )
      )
    })

    res.json({ success: true, message: 'Order cancelled.' })
  } catch (err) { next(err) }
}