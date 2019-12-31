import { Entity } from './Entity'

export class Loot extends Entity {
	static types = [
		{
			name: 'Gold Coin',
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
			}
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
			}
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
			}
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
			}
		}
	]

	action(verb, world) {
		if (verb === 'bump') {
			world.player.use(this)
			world.remove(this)
		}
		if (verb === 'drop') {
			console.log('drop', this)
		}
	}
}
