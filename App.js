import React from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Stats from './Stats'

export default function App() {
	const [dice, setDice] = React.useState(allNewDice())
	const [startTime, setStartTime] = React.useState(null)
	const [tenzies, setTenzies] = React.useState(false)
	const [currentStats, setCurrentStats] = React.useState({
		rolls: null,
		time: null,
	})
	const [bestStats, setBestStats] = React.useState(
		JSON.parse(localStorage.getItem('bestStats')) || { rolls: null, time: null }
	)
	const [newBest, setNewBest] = React.useState(false)
	const [firstStart, setFirstStart] = React.useState(true)

	React.useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every((die) => die.value === firstValue)
		if (allHeld && allSameValue) {
			setTenzies(true)
		}
	}, [dice])

	React.useEffect(() => {
		let intervalId = null

		if (!tenzies && !firstStart) {
			intervalId = setInterval(() => {
				setCurrentStats((oldStats) => ({
					rolls: oldStats.rolls,
					time: Date.now() - startTime,
				}))
			}, 100)
		}

		return () => clearInterval(intervalId)
	}, [tenzies, startTime])

	React.useEffect(() => {
		if (tenzies) {
			let bestRolls = bestStats.rolls
			let bestTime = bestStats.time
			let newBest = false
			if (bestRolls === null && bestTime === null) {
				newBest = true
			} else if (bestRolls > currentStats.rolls) {
				newBest = true
			} else if (
				bestRolls === currentStats.rolls &&
				bestTime > currentStats.time
			) {
				newBest = true
			}
			setNewBest(newBest)
			if (newBest) {
				localStorage.setItem(
					'bestStats',
					JSON.stringify(Object.assign({}, currentStats))
				)
				setBestStats(Object.assign({}, currentStats))
			}
		}
	}, [tenzies])

	function generateNewDie() {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			id: nanoid(),
		}
	}

	function allNewDice() {
		const newDice = []
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie())
		}
		return newDice
	}

	function resetGame() {
		setTenzies(false)
		setDice(allNewDice())
		setCurrentStats({ rolls: 1, time: 0 })
		setNewBest(false)
		setStartTime(Date.now())
	}

	function rollDice() {
		if (!tenzies && !firstStart) {
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie()
				})
			)
			setCurrentStats((oldStats) => ({
				rolls: oldStats.rolls + 1,
				time: oldStats.time,
			}))
		} else if (firstStart) {
			setFirstStart(false)
			resetGame()
		} else {
			resetGame()
		}
	}

	function holdDice(id) {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id
					? Object.assign({}, die, { isHeld: !die.isHeld })
					: die
			})
		)
	}

	const diceElements = dice.map((die) => (
		<Die
			key={die.id}
			value={die.value}
			isHeld={die.isHeld}
			holdDice={() => holdDice(die.id)}
			active={!firstStart}
		/>
	))

	let buttonText = ''

	if (firstStart) {
		buttonText = 'Start'
	} else if (tenzies) {
		buttonText = 'New Game'
	} else {
		buttonText = 'Roll'
	}

	return (
		<main>
			{tenzies && <Confetti />}
			<h1 className='title'>Tenzies</h1>
			<p className='instructions'>
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			{newBest && <h3>New Best!</h3>}
			<Stats
				currentStats={currentStats}
				bestStats={bestStats}
			/>
			<div className='dice-container'>{diceElements}</div>
			<button
				className='roll-dice'
				onClick={rollDice}>
				{buttonText}
			</button>
		</main>
	)
}
