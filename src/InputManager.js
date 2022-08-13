export class Action {
	static createAction(type) {
		return data => new Action(type, data)
	}

	constructor(type, data = {}) {
		this.type = type.toString() || 'Null Action'
		this.data = { ...data }
	}
}

export class InputManager {
	observers = []

	subscribe(fn) {
		this.observers.push(fn)
	}

	unsubscribe(fn) {
		this.observers = this.observers.filter(subscriber => subscriber !== fn)
	}

	broadcast({ type, data }) {
		this.observers.forEach(subscriber => subscriber(type, data))
	}

	handleKeys = e => {
		const move = Action.createAction('move')
		const reset = Action.createAction('reset')

		const left = 37
		const up = 38
		const right = 39
		const down = 40
		const enter = 13

		e.preventDefault()
		switch (e.keyCode) {
			case left: {
				return this.broadcast(move({ x: -1, y: 0 }))
			}

			case up: {
				return this.broadcast(move({ x: 0, y: -1 }))
			}

			case right: {
				return this.broadcast(move({ x: 1, y: 0 }))
			}

			case down: {
				return this.broadcast(move({ x: 0, y: 1 }))
			}

			case enter: {
				return this.broadcast(reset())
			}

			default:
				break
		}
	}

	bindKeys() {
		document.addEventListener('keydown', this.handleKeys)
	}

	unbindKeys() {
		document.removeEventListener('keydown', this.handleKeys)
	}
}
