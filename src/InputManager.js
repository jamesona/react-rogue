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

		const left = 37
		const up = 38
		const right = 39
		const down = 40

		e.preventDefault()
		switch (e.keyCode) {
			case left: {
				this.broadcast(move({ x: -1, y: 0 }))
				break
			}

			case up: {
				this.broadcast(move({ x: 0, y: -1 }))
				break
			}

			case right: {
				this.broadcast(move({ x: 1, y: 0 }))
				break
			}

			case down: {
				this.broadcast(move({ x: 0, y: 1 }))
				break
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
