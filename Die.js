import React from 'react'

export default function Die(props) {
	const styles = {
		backgroundColor: props.isHeld ? '#59E391' : 'white',
		cursor: props.active ? 'pointer' : 'default',
	}

	const dieDots = [
		[0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 1, 0, 1, 0, 0, 0],
		[1, 0, 0, 0, 1, 0, 0, 0, 1],
		[1, 0, 1, 0, 0, 0, 1, 0, 1],
		[1, 0, 1, 0, 1, 0, 1, 0, 1],
		[1, 0, 1, 1, 0, 1, 1, 0, 1],
	]

	const dotStyle = (dot) => {
		if (dot && props.isHeld) {
			return { backgroundColor: 'white' }
		} else if (dot) {
			return { backgroundColor: 'black' }
		} else {
			return { backgroundColor: 'transparent' }
		}
	}

	const dieDotsElements = dieDots[props.value - 1].map((dot, index) => (
		<div
			key={index}
			className={`die-dot`}
			style={dotStyle(dot)}></div>
	))

	return (
		<div
			className={`die-face ${props.active ? 'active' : ''} ${
				props.isHeld ? 'held' : ''
			}`}
			style={styles}
			onClick={props.holdDice}>
			{dieDotsElements}
		</div>
	)
}
