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

			health: 6
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

			health: 2
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

			health: 3
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
			health: 1
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

			health: 1
		}
	]

	get definition() {
		return Monster.types.find(type => type.name === this.attributes.name)
	}

	action(verb, world) {
		if (verb === 'bump') {
			world.addToHistory(`You attack ${this.attributes.name}`)

			this.attributes.health -= Math.pow(
				1.0233,
				world.player.attributes.attack
			)

			if (this.attributes.health <= 0) {
				world.remove(this)
				debugger
				world.player.attributes.points += this.definition.health * 10
			} else {
				world.addToHistory(
					`${this.attributes.name}'s HP: ${this.attributes.health}`
				)
				world.addToHistory(`${this.attributes.name} attacks you`)

				world.player.attributes.health -=
					1 / Math.pow(1.001, world.player.attributes.defense)

				if (world.player.attributes.health <= 0) {
					world.addToHistory('You died')
				} else {
					world.addToHistory(
						`You have ${world.player.attributes.health} HP`
					)
				}
			}
		}
	}
}
