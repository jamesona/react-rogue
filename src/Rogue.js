import React, { useRef, useEffect, useState } from 'react'
import { InputManager } from './InputManager'
import { World } from './World'
import { Spawner } from './Spawner'

export const Rogue = ({ width, height, tilesize, historyLines }) => {
	const canvasRef = useRef(null)
	const inputManager = new InputManager()

	const [world, setWorldState] = useState(new World(width, height, tilesize, historyLines))

	const handleInput = (action, data) => {
		if (world.ended) {
			if (action === 'reset') {
				init()
			}
			return
		}

		const newWorldState = Object.assign(new World(), world)

		if (action === 'move') {
			newWorldState.movePlayer(data.x, data.y)
		}
		
		setWorldState(newWorldState)
	}

	const init = () => {
		const newWorldState = new World(width, height, tilesize, historyLines)
		newWorldState.init()
		
		const spawner = new Spawner(newWorldState)
		spawner.spawnLoot(10)
		spawner.spawnMonster(10)
		spawner.spawnStairs()
		setWorldState(newWorldState)
	}

	useEffect(() => {
		init()
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		inputManager.bindKeys()
		inputManager.subscribe(handleInput)

		return () => {
			inputManager.unbindKeys()
			inputManager.unsubscribe(handleInput)
		}
	})

	useEffect(() => {
		const ctx = canvasRef.current.getContext('2d')

		if (!world.ended) {
			ctx.clearRect(0, 0, width * tilesize, height * tilesize)
			world.draw(ctx)
		} else {
			ctx.fillStyle = 'rgba(0,0,0,0.8)'
			ctx.fillRect(0, 0, width * tilesize, height * tilesize)
			ctx.textAlign = 'center'
			ctx.fillStyle = '#fff'
			ctx.fillText('Game Over', width * tilesize / 2, height * tilesize / 2 - tilesize)
			ctx.fillText('Press Enter to Try Again', width * tilesize / 2, height * tilesize / 2 + tilesize)
			world.printLog(ctx)
		}
	})

	return (
		<canvas
			ref={canvasRef}
			width={width * tilesize}
			height={height * tilesize + historyLines * tilesize}
			style={{ margin: '1px', background: '#3F3F3F' }}
		></canvas>
	)
}

export default Rogue
