import { Map } from 'rot-js'
import { Player } from './Player'

export const buildGrid = (width, height) =>
	new Array(width).fill(null).map(() => new Array(height).fill(null))

export class World {
	constructor(width, height, tileSize, historyLines) {
		this.width = width
		this.height = height
		this.tileSize = tileSize
		this.player = new Player(0, 0, tileSize)
		this.entities = [this.player]
		this.history = ['You have entered a dungeon']
		this.historyLines = historyLines
		this.map = buildGrid(width, height)
		this.floor = 1
	}

	add(entity) {
		this.entities.push(entity)
	}

	remove(entity) {
		this.entities = this.entities.filter(e => e !== entity)
	}

	iterateTiles(fn, sx = 0, sy = 0) {
		for (let x = sx; x < this.width; x++) {
			for (let y = sy; y < this.height; y++) {
				if (fn(x, y, this.getTile(x, y))) return
			}
		}
	}

	createRandomMap() {
		this.map = buildGrid(this.width, this.height)
		this.iterateTiles(
			(x, y) => (this.map[x][y] = Math.round(Math.random()))
		)
	}

	createCellularMap() {
		this.map = buildGrid(this.width, this.height)
		const cellGenerator = new Map.Cellular(this.width, this.height, {
			connected: true
		})
		cellGenerator.randomize(0.475)

		const userCallback = (x, y, value) => {
			const isBorderTile =
				x === 0 ||
				y === 0 ||
				x >= this.width - 1 ||
				y >= this.height - 1
			const isGeneratedWall = value === 0

			this.map[x][y] = isGeneratedWall || isBorderTile ? 1 : 0
		}

		cellGenerator.create(userCallback)
		cellGenerator.connect(userCallback, 1)
	}

	init() {
		this.createCellularMap()
		this.moveToValidSpace(this.player)
	}

	getEntityAtLocation(x, y) {
		return this.entities.find(
			entity => entity.x === x && entity.y === y && entity !== this.player
		)
	}

	applyPositionDelta(entity, dx, dy) {
		return [entity.x + dx, entity.y + dy]
	}

	moveToValidSpace(entity) {
		const spaceIsValid = (x, y) =>
			this.tileExists(x, y) &&
			!this.isWall(x, y) &&
			!this.getEntityAtLocation(x, y)

		let spacesTried = 0
		let dx = 0,
			dy = 0,
			x = 0,
			y = 0

		while (
			!spaceIsValid(
				...([x, y] = this.applyPositionDelta(
					entity,
					...([dx, dy] = getSpiralCoord(spacesTried++))
				))
			)
		) {
			if (spacesTried > this.height * this.width) {
				console.log('Failed to place, something is wrong')
				debugger
				return [entity.x, entity.y]
			}
		}

		console.log(`placing ${entity.attributes.name} at [${x}, ${y}]`)

		return entity.move(dx, dy)
	}

	movePlayer(dx, dy) {
		const { player } = this
		const [x, y] = player.locationFromVector(dx, dy)
		const targetTile = this.getTile(x, y)

		if (targetTile === 1) return

		const entity = this.getEntityAtLocation(x, y)

		if (entity) {
			entity.action('bump', this)
		}

		if (!entity?.definition?.health) {
			player.move(dx, dy)
		}
	}

	getTile(x, y) {
		return this.map[x] && this.map[x][y]
	}

	tileExists(x, y) {
		return this.getTile(x, y) !== undefined
	}

	isWall(x, y) {
		return this.getTile(x, y) === 1
	}

	printLog(context) {
		context.fillStyle = '#000'
		context.fillRect(0, this.height * this.tileSize, this.width * this.tileSize, this.historyLines * this.tileSize)
		context.fillStyle = '#fff'
		context.textAlign = 'start'
		this.history.slice(-this.historyLines).forEach((line, lineNumber) => {
			context.fillText(line, this.tileSize, (this.height + lineNumber) * this.tileSize)
		})
	}

	draw(context) {
		if (this.ended) return

		this.drawMap(context)
		this.processEntities(context)
		this.printLog(context)
	}

	drawMap(context) {
		this.iterateTiles((x, y) => {
			if (this.map[x][y] === 1) {
				this.drawWall(context, x, y)
			}
		})
	}

	processEntities(context) {
		this.entities.forEach((entity, i) => {
			try {
				entity.draw(context, this)
			} catch (e) {
				debugger
			}
		})
	}

	drawWall(context, x, y) {
		context.fillStyle = '#000'
		context.fillRect(
			x * this.tileSize,
			y * this.tileSize,
			this.tileSize,
			this.tileSize
		)
	}

	addToHistory(message) {
		this.history.push(message)
	}

	end() {
		this.ended = true
	}
}

function getSpiralCoord(indexFromCenter) {
	if (indexFromCenter === 0) return [0, 0]

	let radius = Math.floor((Math.sqrt(indexFromCenter + 1) - 1) / 2) + 1

	let p = (8 * radius * (radius - 1)) / 2

	let sideLength = radius * 2

	let a = (1 + indexFromCenter - p) % (radius * 8)

	let dx = 0
	let dy = 0

	switch (Math.floor(a / (radius * 2))) {
		case 2: {
			dx = a - radius
			dy = -radius
			break
		}
		case 3: {
			dx = radius
			dy = (a % sideLength) - radius
			break
		}
		case 0: {
			dx = radius - (a % sideLength)
			dy = radius
			break
		}
		case 1: {
			dx = -radius
			dy = radius - (a % sideLength)
			break
		}

		default:
			break
	}
	return [dx, dy]
}
