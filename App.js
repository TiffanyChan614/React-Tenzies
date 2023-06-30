import React from 'react'
import Die from './Die'
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'
import Stats from './Stats'

export default function App() {
	const [dice, setDice] = React.useState(allNewDice())
	const [tenzies, setTenzies] = React.useState(false)
	const [rolls, setRolls] = React.useState(1)
	const [time, setTime] = React.useState(0)
	const [bestRolls, setBestRolls] = React.useState(
		Number(localStorage.getItem('bestRoll')) || null
	)
	const [bestTime, setBestTime] = React.useState(
		Number(localStorage.getItem('bestTime')) || null
	)

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
				setTime((oldTime) => oldTime + 100)
			}, 100)
		}
	}, [time])

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
			setRolls((oldRoll) => oldRoll + 1)
		} else {
			if (bestRolls === null || rolls < bestRolls) {
				localStorage.setItem('bestRolls', rolls)
				setBestRolls(rolls)
			}
			if (bestTime === null || time < bestTime) {
				localStorage.setItem('bestTime', time)
				setBestTime(time)
			}
			setTenzies(false)
			setDice(allNewDice())
			setRolls(1)
			setTime(0)
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
				currentRolls={rolls}
				currentTime={time}
				bestRolls={bestRolls}
				bestTime={bestTime}
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
