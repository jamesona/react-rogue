import { Entity } from './Entity'
import { Spawner } from './Spawner'

export class Stairs extends Entity {
	attributes = {
		name: 'Stairs',
		color: 'black',
		ascii: {
			symbol: '<',
			offset: {
				x: 2,
				y: 2
			}
		},
		emoji: {
			symbol: '🚪',
			offset: { x: 0, y: 4 }
		}
	}

	action(verb, world) {
		if (verb === 'bump') {
			const points = world.floor * 100
			world.player.attributes.score += points
			world.floor += 1
			world.addToHistory(`You go down the stairs (Score +${points})`)
			world.createCellularMap()
			world.moveToValidSpace(world.player)
			world.entities = [world.player]
			const spawner = new Spawner(world)
			spawner.spawnLoot(10)
			spawner.spawnMonster(10)
			spawner.spawnStairs()
		}
	}
}
