import React, { useRef, useEffect, useState } from 'react'
import { InputManager } from './InputManager'
import { World } from './World'
import { Spawner } from './Spawner'

export const Rogue = ({ width, height, tilesize }) => {
	const canvasRef = useRef(null)
	const inputManager = new InputManager()

	const [world, setWorldState] = useState(new World(width, height, tilesize))

	const handleInput = (action, data) => {
		console.log(`handle input: ${action}:${JSON.stringify(data)}`)

		const newWorldState = Object.assign(new World(), world)

		newWorldState.movePlayer(data.x, data.y)

		setWorldState(newWorldState)
	}

	useEffect(() => {
		console.log('Generate Map')
		const newWorldState = Object.assign(new World(), world)
		newWorldState.createCellularMap()
		newWorldState.moveToValidSpace(newWorldState.player)
		const spawner = new Spawner(newWorldState)
		spawner.spawnLoot(10)
		spawner.spawnMonster(10)
		spawner.spawnStairs()
		setWorldState(newWorldState)
		// eslint-disable-next-line
	}, [])

	useEffect(() => {
		console.log('Bind input')

		inputManager.bindKeys()
		inputManager.subscribe(handleInput)

		return () => {
			inputManager.unbindKeys()
			inputManager.unsubscribe(handleInput)
		}
	})

	useEffect(() => {
		console.log('Updating canvas')

		const ctx = canvasRef.current.getContext('2d')

		ctx.clearRect(0, 0, width * tilesize, height * tilesize)
		world.draw(ctx)
	})

	return (
		<canvas
			ref={canvasRef}
			width={width * tilesize}
			height={height * tilesize}
			style={{ border: '1px solid black', background: '#3F3F3F' }}
		></canvas>
	)
}

export default Rogue
