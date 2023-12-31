import React from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Stats from './Stats'

export default function App() {
	const [dice, setDice] = React.useState(allNewDice(false))
	const [startTime, setStartTime] = React.useState(null)
	const [tenzies, setTenzies] = React.useState(false)
	const [currentStats, setCurrentStats] = React.useState({
		rolls: null,
		secondPassed: null,
	})
	const [bestStats, setBestStats] = React.useState(
		JSON.parse(localStorage.getItem('bestStats')) || {
			rolls: null,
			secondPassed: null,
		}
	)
	const [newBest, setNewBest] = React.useState(false)
	const [gameInProgress, setGameInProgress] = React.useState(false)

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

		if (!tenzies && gameInProgress) {
			intervalId = setInterval(() => {
				setCurrentStats((oldStats) => ({
					rolls: oldStats.rolls,
					secondPassed: Date.now() - startTime,
				}))
			}, 100)
		}

		return () => clearInterval(intervalId)
	}, [tenzies, startTime])

	function updateStats() {
		let newBest = false
		if (bestStats.rolls === null && bestStats.secondPassed === null) {
			newBest = true
		} else if (bestStats.rolls > currentStats.rolls) {
			newBest = true
		} else if (
			bestStats.rolls === currentStats.rolls &&
			bestStats.secondPassed > currentStats.secondPassed
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

	React.useEffect(() => {
		if (tenzies) {
			updateStats()
			setGameInProgress(false)
			setDice((oldDice) =>
				oldDice.map((die) => Object.assign({}, die, { isActive: false }))
			)
		}
	}, [tenzies])

	function generateNewDie(activeVal) {
		return {
			value: Math.ceil(Math.random() * 6),
			isHeld: false,
			isActive: activeVal,
			id: nanoid(),
		}
	}

	function allNewDice(activeVal) {
		const newDice = []
		for (let i = 0; i < 10; i++) {
			newDice.push(generateNewDie(activeVal))
		}
		return newDice
	}

	function resetGame() {
		setTenzies(false)
		setCurrentStats({ rolls: 1, secondPassed: 0 })
		setNewBest(false)
		setStartTime(Date.now())
	}

	function rollDice() {
		if (gameInProgress) {
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie(true)
				})
			)
			setCurrentStats((oldStats) => ({
				rolls: oldStats.rolls + 1,
				secondPassed: oldStats.secondPassed,
			}))
		} else if (!gameInProgress) {
			setDice(allNewDice(true))
			setGameInProgress(true)
			resetGame()
		}
	}

	function holdDice(id) {
		setDice((oldDice) =>
			oldDice.map((die) => {
				return die.id === id && die.isActive
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
			active={die.isActive}
		/>
	))

	let buttonText = ''

	if (!gameInProgress && !tenzies) {
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
