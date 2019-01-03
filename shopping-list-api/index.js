const Koa = require('koa')
const router = require('koa-router')()
const body = require('koa-body')
const cors = require('@koa/cors')

const uuid = require('uuid/v4')

const state ={
	userShoppingLists: {}
}

const app = new Koa()

// get shopping lists for a user
router.get('/shopping-lists/', (ctx, next) => {
	const user = ctx.request.headers.authorization
	console.log(`list shopping lists for user ${user}`)
	if (!user) {
		ctx.status = 401
		return
	}
	if (state.userShoppingLists[user]) {
		ctx.body = Object.values(state.userShoppingLists[user])
		ctx.status = 200
	} else {
		ctx.body = []
		ctx.status = 200
	}
})

router.post('/shopping-lists/', body(), (ctx, next) => {
	const user = ctx.request.headers.authorization
	if (!user) {
		ctx.status = 401
		return
	}
	if (!state.userShoppingLists[user]) {
		state.userShoppingLists[user] = {}
	}
	const shoppingList = ctx.request.body
	shoppingList.id = uuid()
	state.userShoppingLists[user][shoppingList.id] = shoppingList
	ctx.status = 201
	ctx.body = shoppingList
	console.log(`created shopping list for user ${user}:`, JSON.stringify(ctx.request.body))
})

router.get('/shopping-lists/:id', (ctx, next) => {
	const user = ctx.request.headers.authorization
	if (!user) {
		ctx.status = 401
		return
	}
	const id = ctx.params.id
	if (!state.userShoppingLists[user] || !state.userShoppingLists[user][id]) {
		ctx.status = 404
		return
	}
	const shoppingList = state.userShoppingLists[user][id]
	ctx.status = 200
	ctx.body = shoppingList
	console.log(`get shopping list for user ${user}:`, id)
})

router.patch('/shopping-lists/:id', body(), (ctx, next) => {
	const user = ctx.request.headers.authorization
	if (!user) {
		ctx.status = 401
		return
	}
	const id = ctx.params.id
	if (!state.userShoppingLists[user] || !state.userShoppingLists[user][id]) {
		ctx.status = 404
		return
	}
	const shoppingList = state.userShoppingLists[user][id]
	Object.assign(shoppingList, ctx.request.body)
	ctx.status = 200
	ctx.body = shoppingList
	console.log(`updated shopping list for user ${user}:`, JSON.stringify(ctx.request.body))
})

app
	.use(cors())
	.use(router.routes())
	.use(router.allowedMethods())

app.listen(3000)
