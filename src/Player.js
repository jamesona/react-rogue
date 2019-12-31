import { Entity } from './Entity'
import { Loot } from './Loot'

export class Player extends Entity {
	attributes = {
		name: 'Player',
		color: '#f00',
		ascii: {
			symbol: '@',
			offset: {
				x: 4,
				y: 2
			}
		},
		emoji: {
			symbol: '🧙',
			offset: {
				x: -4,
				y: 3
			}
		},
		maxHealth: 10,
		health: 10,
		attack: 1,
		defense: 1,
		points: 0
	}

	use(item) {
		const type = Loot.types.findIndex(
			definition => definition.name === item.attributes.name
		)

		switch (type) {
			case 0: {
				this.attributes.points += 100
				break
			}
			case 1: {
				this.attributes.maxHealth += 1
				this.attributes.health += this.attributes.maxHealth * 0.25
				this.attributes.health = Math.min(
					this.attributes.health,
					this.attributes.maxHealth
				)
				break
			}
			case 2: {
				this.attributes.attack += 1
				break
			}
			case 3: {
				this.attributes.defense += 1
				break
			}
			default:
				break
		}
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

		return 'HP [' + segments + ']'
	}

	get score() {
		return 'Score: ' + this.attributes.points
	}

	get attackLevel() {
		return 'ATT: ' + this.attributes.attack
	}

	get defenseLevel() {
		return 'DEF: ' + this.attributes.defense
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
