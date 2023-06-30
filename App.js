import React from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Stats from './Stats'

export default function App() {
	const [dice, setDice] = React.useState(allNewDice())
	const [tenzies, setTenzies] = React.useState(false)
	const [currentStats, setCurrentStats] = React.useState({ rolls: 1, time: 0 })
	const [bestStats, setBestStats] = React.useState({
		rolls: Number(localStorage.getItem('bestRoll')) || null,
		time: Number(localStorage.getItem('bestTime')) || null,
	})

	React.useEffect(() => {
		const allHeld = dice.every((die) => die.isHeld)
		const firstValue = dice[0].value
		const allSameValue = dice.every((die) => die.value === firstValue)
		if (allHeld && allSameValue) {
			setTenzies(true)
		}
	}, [dice])

	React.useEffect(() => {
		if (!tenzies) {
			setTimeout(() => {
				setCurrentStats((oldStats) => ({
					rolls: oldStats.rolls,
					time: oldStats.time + 100,
				}))
			}, 100)
		}
	}, [currentStats.time])

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

	function rollDice() {
		if (!tenzies) {
			setDice((oldDice) =>
				oldDice.map((die) => {
					return die.isHeld ? die : generateNewDie()
				})
			)
			setCurrentStats((oldStats) => ({
				rolls: oldStats.rolls + 1,
				time: oldStats.time,
			}))
		} else {
			let bestRolls = bestStats.rolls
			let bestTime = bestStats.time
			if (bestRolls === null || currentStats.rolls < bestRolls) {
				bestRolls = currentStats.rolls
			}
			if (bestTime === null || currentStats.time < bestTime) {
				bestTime = currentStats.time
			}

			const newBestStats = { rolls: bestRolls, time: bestTime }
			localStorage.setItem('bestStats', newBestStats)
			setBestStats(newBestStats)

			setTenzies(false)
			setDice(allNewDice())
			setCurrentStats({ rolls: 1, time: 0 })
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
		/>
	))

	return (
		<main>
			{tenzies && <Confetti />}
			<h1 className='title'>Tenzies</h1>
			<p className='instructions'>
				Roll until all dice are the same. Click each die to freeze it at its
				current value between rolls.
			</p>
			<Stats
				currentStats={currentStats}
				bestStats={bestStats}
			/>
			<div className='dice-container'>{diceElements}</div>
			<button
				className='roll-dice'
				onClick={rollDice}>
				{tenzies ? 'New Game' : 'Roll'}
			</button>
		</main>
	)
}
