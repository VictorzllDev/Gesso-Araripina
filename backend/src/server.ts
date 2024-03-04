import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import admin from 'firebase-admin'
import { ICreateProducts } from './types'

const app = fastify()

admin.initializeApp({
	credential: admin.credential.cert('serviceAccountKey.json'),
})

// Search all items from the collection products
app.get('/products', async (req: FastifyRequest, res: FastifyReply) => {
	const refCollectionProducts = admin.firestore().collection('products')
	const snapshop = await refCollectionProducts.get()
	const products = snapshop.docs.map((doc) => ({
		...doc.data(),
		uid: doc.id,
	}))
	res.send(products)
})

// creates a new product with name, price and stock
app.post('/products', async (req: FastifyRequest, res: FastifyReply) => {
	const { name, price, stock } = req.body as ICreateProducts
	const body = {
		name: String(name),
		price: Number(price),
		stock: Number(stock),
	}

	try {
		const refCollectionProducts = admin.firestore().collection('products')
		await refCollectionProducts.add(body)

		res.send({ message: 'create com sucess' })
	} catch {
		res.send({ mesage: 'error in creating the product' })
	}
})

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Run server ${address}`)
})
