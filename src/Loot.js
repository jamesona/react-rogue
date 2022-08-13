import { Entity } from './Entity'

export class Loot extends Entity {
	static types = [
		{
			name: 'Treasure',
			color: 'yellow',
			ascii: {
				symbol: '$',
				offset: {
					x: 3,
					y: 3
				}
			},
			emoji: {
				symbol: '💰',
				offset: {
					x: -2,
					y: 3
				}
			},
			effect: (player) => ({
				score: 100
			})
		},
		{
			name: 'Health Potion',
			color: 'red',
			ascii: {
				symbol: '!',
				offset: {
					x: 6,
					y: 3
				}
			},
			emoji: {
				symbol: '🍖',
				offset: {
					x: -4,
					y: 3
				}
			},
			effect: (player) => ({
				maxHealth: 1,
				health: player.attributes.maxHealth * 0.25
			})
		},
		{
			name: 'Long Sword',
			color: 'darkgrey',
			ascii: {
				symbol: '/',
				offset: {
					x: 6,
					y: 3
				}
			},
			emoji: {
				symbol: '🗡️',
				offset: {
					x: -4,
					y: 3
				}
			},
			effect: (player) => ({
				attack: 1
			})
		},
		{
			name: 'Shield',
			color: 'lightgrey',
			ascii: {
				symbol: '#',
				offset: {
					x: 4,
					y: 3
				}
			},
			emoji: {
				symbol: '🛡️',
				offset: {
					x: -2,
					y: 3
				}
			},
			effect: (player) => ({
				defense: 1
			})
		}
	]

	action(verb, world) {
		if (verb === 'bump') {
			world.player.use(this, world)
			world.remove(this)
		}
		if (verb === 'drop') {
			console.log('drop', this)
		}
	}
}
