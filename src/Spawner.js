import { Loot } from './Loot'
import { Monster } from './Monster'
import { Stairs } from './Stairs'

export class Spawner {
	constructor(world) {
		this.world = world
	}

	randomCoords() {
		return [
			randomInt(this.world.width - 1),
			randomInt(this.world.height - 1)
		]
	}

	spawn(count, createEntity) {
		for (let i = 0; i < count; i++) {
			let entity = createEntity()
			this.world.add(entity)
			this.world.moveToValidSpace(entity)
		}
	}

	spawnLoot(count) {
		this.spawn(count, () => {
			const [x, y] = this.randomCoords()
			const loot = new Loot(
				x,
				y,
				this.world.tileSize,
				Loot.types[randomInt(Loot.types.length)]
			)
			return loot
		})
	}

	spawnMonster(count) {
		this.spawn(count, () => {
			const [x, y] = this.randomCoords()
			const loot = new Monster(
				x,
				y,
				this.world.tileSize,
				Monster.types[randomInt(Loot.types.length)]
			)
			return loot
		})
	}

	spawnStairs() {
		this.spawn(1, () => {
			const [x, y] = this.randomCoords()
			const stairs = new Stairs(x, y, this.world.tileSize)
			return stairs
		})
		// this.world.add(stairs)
		// this.world.moveToValidSpace(stairs)
	}
}

function randomInt(max, min = 0) {
	return Math.floor(Math.random() * Math.floor(max) + min)
}
