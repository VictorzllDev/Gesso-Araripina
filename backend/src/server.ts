import fastify, { FastifyReply, FastifyRequest } from 'fastify'
import admin from 'firebase-admin'
import { ICreateProducts } from './types'

const app = fastify()

admin.initializeApp({
	credential: admin.credential.cert('serviceAccountKey.json'),
})

// Search all items from the collection products
app.get('/products', async (req: FastifyRequest, res: FastifyReply) => {
	try {
		const refCollectionProducts = admin.firestore().collection('products')
		const snapshop = await refCollectionProducts.get()
		const products = snapshop.docs.map((doc) => ({
			...doc.data(),
			uid: doc.id,
		}))
		res.send(products)
	} catch (error) {
		console.error(error)
		return res.send({ message: 'Error fetching products' })
	}
})

// creates a new product with name, price and stock
app.post('/products', async (req: FastifyRequest, res: FastifyReply) => {
	try {
		const { name, price, stock } = req.body as ICreateProducts

		// check if the types of variables are correct
		if (
			typeof name !== 'string' ||
			typeof price !== 'number' ||
			typeof stock !== 'number'
		) {
			throw new Error()
		}

		// making connection and adding data
		const refCollectionProducts = admin.firestore().collection('products')
		await refCollectionProducts.add({ name, price, stock })
		res.send({ message: 'create com sucess' })
	} catch {
		res.send({ mesage: 'error in creating the product' })
	}
})

// delete product
app.delete(
	'/products/:uid',
	async (
		req: FastifyRequest<{ Params: { uid: string } }>,
		res: FastifyReply,
	) => {
		const { uid } = req.params

		try {
			const refCollectionProducts = admin.firestore().collection('products')
			await refCollectionProducts.doc(uid).delete()
			res.send({ message: `uid document: ${uid}, deleted successfully` })
		} catch {
			res.send({ message: 'error in deleting document' })
		}
	},
)

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Run server ${address}`)
})
