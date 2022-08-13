import { Entity } from './Entity'

const uppercaseFirstChar = (str) => str[0].toUpperCase() + str.slice(1)
const toTitleCase = (camelStr) => {
	return  uppercaseFirstChar(camelStr.replace(/([A-Z])/g, ' $1'))
}

export class Player extends Entity {
	attributes = {
		name: 'Player',
		color: '#f00',
		ascii: {
			symbol: '@',
			offset: {
				x: 3,
				y: 1
			}
		},
		emoji: {
			symbol: '🧙',
			offset: {
				x: -4,
				y: 3
			}
		},
		maxHealth: 100,
		health: 100,
		attack: 5,
		defense: 1,
		score: 0
	}

	use(item, world) {
		let logMessage = `Picked up ${item.attributes.name}`
		const delta = item.attributes.effect(this)
		Object.entries(delta).forEach(([attribute, change], i, a) => {
			if (this.attributes[attribute]) {
				this.attributes[attribute] += change
				
				const maxAttr = 'max' + uppercaseFirstChar(attribute)
				if (this.attributes[maxAttr]) {
					this.attributes[attribute] = Math.min(this.attributes[attribute], this.attributes[maxAttr])
				}
			} else {
				this.attributes[attribute] = change
			}

			if (i === 0) logMessage += ' ('
			else logMessage += ', '
			logMessage += `${toTitleCase(attribute)} ${change > 0 ? '+' : ''}${change}`
			
			if (i === a.length - 1) logMessage += ')'
		})
		world.addToHistory(logMessage)
	}

	get hpBar() {
		const length = 10
		const percent = this.attributes.health / this.attributes.maxHealth
		const segments = Array(length)
			.fill(null)
			.map((v, i) => {
				const thisBarPercent = (i + 1) / length
				const isFilled = percent >= thisBarPercent
				return isFilled ? '■' : ' '
			})
			.join('')

		return `HP: [${segments}] ${this.attributes.health}/${this.attributes.maxHealth}`
	}

	get score() {
		return `Score: ${this.attributes.score}`
	}

	get attackLevel() {
		return `ATT: ${this.attributes.attack}`
	}

	get defenseLevel() {
		return `DEF: ${this.attributes.defense} (${Math.floor((1 - this.damageReduction) * 100)}%)`
	}

	get damageReduction() {
		return 1 - (Math.log(Math.max(this.attributes.defense), 1) / 10)
	}

	printLeft(context, ...items) {
		context.fillStyle = this.attributes.color = '#fff'
		context.fillText(items.join(' '), this.size, 0)
	}

	printRight(context, ...items) {
		context.fillStyle = this.attributes.color = '#fff'
		context.fillText(
			items.join(' '),
			context.canvas.width - items.join(' ').length * this.size,
			0
		)
	}

	draw(context) {
		super.draw(context)

		this.printLeft(context, this.hpBar, this.attackLevel, this.defenseLevel)
		this.printRight(context, this.score)
	}
}
