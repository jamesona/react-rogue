export class Entity {
	constructor(x, y, size, attributes) {
		this.x = x
		this.y = y
		this.size = size
		this.attributes = { ...attributes }
	}

	move(dx, dy) {
		const [x, y] = this.locationFromVector(dx, dy)
		Object.assign(this, {
			x,
			y
		})

		return [this.x, this.y]
	}

	locationFromVector(dx, dy) {
		return [this.x + dx, this.y + dy]
	}

	draw(context) {
		context.fillStyle = this.attributes.color || '#fff'
		context.textBaseline = 'hanging'
		context.font = `${this.size}px monospace`

		if (this.attributes.emoji) {
			const { symbol, offset: {x, y} } = this.attributes.emoji || {symbol: '', offset: { x: 0, y: 0 }}
			context.fillText(
				symbol,
				this.x * this.size + x,
				this.y * this.size + y
			)
		} else {
			const { symbol, offset: {x, y} } = this.attributes.ascii || {symbol: '', offset: { x: 0, y: 0 }}
			context.fillText(
				symbol,
				this.x * this.size + x,
				this.y * this.size + y
			)
		}
		
	}

	takeDamage(amount) {
		if (this.attributes && this.attributes.health)
			this.attributes.health -= amount
	}

	action(verb, world) {
		console.log(verb)
	}
}
