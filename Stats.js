import React from 'react'

export default function Stats(props) {
	return (
		<div className='stats'>
			<div className='stats-rolls'>
				<div className='titles'>
					<div>
						<h3>Current Rolls</h3>
					</div>
					<div>
						<h3>Best Rolls</h3>
					</div>
				</div>
				<div className='numbers'>
					<div>{props.currentRolls}</div>
					<div>{!props.bestRolls ? '--' : props.bestRolls}</div>
				</div>
			</div>
			<div className='stats-time'>
				<div className='titles'>
					<div>
						<h3>Current Time</h3>
					</div>
					<div>
						<h3>Best Time</h3>
					</div>
				</div>
				<div className='numbers'>
					<div>{(props.currentTime / 1000).toFixed(2)}s</div>
					<div>
						{!props.bestTime ? '--' : `${(props.bestTime / 1000).toFixed(2)}s`}
					</div>
				</div>
			</div>
		</div>
	)
}
