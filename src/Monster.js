import { Entity } from './Entity'

export class Monster extends Entity {
	static types = [
		{
			name: 'Ogre',
			color: 'lightgrey',
			ascii: {
				symbol: 'O',
				offset: { x: 2, y: 3 }
			},
			emoji: {
				symbol: '👹',
				offset: {
					x: -4,
					y: 3
				}
			},

			health: 60
		},
		{
			name: 'Skeleton',
			color: 'gray',
			ascii: {
				symbol: 'S',
				offset: { x: 3, y: 2 }
			},
			emoji: {
				symbol: '☠️',
				offset: {
					x: -5,
					y: 3
				}
			},

			health: 20
		},
		{
			name: 'Kobold',
			color: 'darkgreen',
			ascii: {
				symbol: 'k',

				offset: { x: 4, y: 3 }
			},
			emoji: {
				symbol: '🐲',
				offset: {
					x: -3,
					y: 3
				}
			},

			health: 30
		},
		{
			name: 'Bat',
			color: 'brown',
			ascii: {
				symbol: 'B',
				offset: { x: 2, y: 3 }
			},
			emoji: {
				symbol: '🦇',
				offset: {
					x: -3,
					y: 4
				}
			},
			health: 10
		},
		{
			name: 'Rat',
			color: 'brown',
			ascii: {
				symbol: 'r',
				offset: { x: 2, y: 3 }
			},
			emoji: {
				symbol: '🐀',
				offset: {
					x: 0,
					y: 0
				}
			},

			health: 10
		}
	]

	get definition() {
		return Monster.types.find(type => type.name === this.attributes.name)
	}

	action(verb, world) {
		if (verb === 'bump') {
			const damageDealtByPlayer = world.player.attributes.attack
			this.takeDamage(damageDealtByPlayer)
			world.addToHistory(`You attack ${this.attributes.name} for ${damageDealtByPlayer} damage`)

			if (this.attributes.health <= 0) {
				const points = this.definition.health * 10
				world.addToHistory(`${this.attributes.name} was slain (Score +${points})`)
				world.player.attributes.score += points
				world.remove(this)
			} else {
				const {damageReduction} = world.player
				const damageDealtToPlayer = Math.floor(this.definition.health / 2 * damageReduction) || 1
				world.player.takeDamage(damageDealtToPlayer)
				world.addToHistory(`${this.attributes.name} attacks you for ${damageDealtToPlayer} HP`)

				if (world.player.attributes.health <= 0) {
					world.addToHistory('You died')
					world.end()
				}
			}
		}
	}
}
