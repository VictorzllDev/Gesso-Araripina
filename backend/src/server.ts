import fastify from 'fastify'

const app = fastify()

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err)
		process.exit(1)
	}
	console.log(`Run server ${address}`)
})
