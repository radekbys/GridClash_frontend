'use client'

import { useState } from 'react'
import './globals.css'

URL = 'https://grid-clash-backend-326356427471.europe-west1.run.app'

let gameId = null
let winner = null

export default function TicTacToeGame () {
  const [gameStarted, setGameStarted] = useState(false)
  const [players, setPlayers] = useState([
    { name: '', symbol: 'X' },
    { name: '', symbol: 'O' }
  ])
  const [turnLog, setTurnLog] = useState([])

  // Derive board state from turn log
  const getDerivedBoard = () => {
    const board = Array(9).fill(null)
    turnLog.forEach(turn => {
      const index = (turn.row - 1) * 3 + (turn.column - 1)
      board[index] = turn.player
    })
    return board
  }

  // Derive current player from turn log length
  const getDerivedCurrentPlayer = () => {
    return turnLog.length % 2 === 0 ? 'X' : 'O'
  }

  // Derive all current game state
  const board = getDerivedBoard()
  const currentPlayer = getDerivedCurrentPlayer()
  const gameOver = winner !== null

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players]
    newPlayers[index].name = name
    setPlayers(newPlayers)
  }

  const resetGame = async () => {
    const res = await fetch(URL + '/start')
    const obj = await res.json()
    gameId = obj.id
    setTurnLog(obj.log)
    winner = null
  }

  const backToStart = () => {
    setGameStarted(false)
    setTurnLog([])
  }

  const startGame = () => {
    if (players[0].name.trim() && players[1].name.trim()) {
      setGameStarted(true)
      resetGame()
    }
  }

  const handleCellClick = async index => {
    if (board[index] || gameOver) return

    const row = Math.floor(index / 3)
    const column = index % 3

    const newTurn = {
      player: currentPlayer,
      row: row + 1, // 1-indexed for display
      column: column + 1 // 1-indexed for display
    }

    const res = await fetch(URL + '/nextTurn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameId: gameId,
        turn: newTurn
      })
    })

    const obj = await res.json()

    if (obj.game.winner && obj.game.winner !== 'unddefined') {
      if (obj.game.winner === 'X') {
        winner = players[0].name
      } else if (obj.game.winner === 'O') {
        winner = players[1].name
      } else winner = 'tie'
    }

    setTurnLog([...obj.game.log])
  }

  const getCurrentPlayerName = () => {
    return players.find(p => p.symbol === currentPlayer)?.name || currentPlayer
  }

  if (!gameStarted) {
    return (
      <div className='container'>
        <div className='start-page'>
          <h1>Grid Clash</h1>
          <div className='player-inputs'>
            <div className='input-group'>
              <label htmlFor='playerX'>Player X Name:</label>
              <input
                id='playerX'
                type='text'
                value={players[0].name}
                onChange={e => handlePlayerNameChange(0, e.target.value)}
                placeholder='Enter name for X'
                maxLength={20}
              />
            </div>
            <div className='input-group'>
              <label htmlFor='playerO'>Player O Name:</label>
              <input
                id='playerO'
                type='text'
                value={players[1].name}
                onChange={e => handlePlayerNameChange(1, e.target.value)}
                placeholder='Enter name for O'
                maxLength={20}
              />
            </div>
          </div>
          <button
            className='start-button'
            onClick={startGame}
            disabled={!players[0].name.trim() || !players[1].name.trim()}
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='container'>
      <div className='game-page'>
        <header className='game-header'>
          <h1>Grid Clash</h1>
          <div className='players-info'>
            <div
              className={`player-info ${currentPlayer === 'X' ? 'active' : ''}`}
            >
              <span className='player-symbol'>X</span>
              <span className='player-name'>{players[0].name}</span>
            </div>
            <div
              className={`player-info ${currentPlayer === 'O' ? 'active' : ''}`}
            >
              <span className='player-symbol'>O</span>
              <span className='player-name'>{players[1].name}</span>
            </div>
          </div>
          {!gameOver && (
            <div className='current-turn'>
              Current Turn:{' '}
              <span className='highlight'>{getCurrentPlayerName()}</span>
            </div>
          )}
          {gameOver && (
            <div className='game-result'>
              {winner === 'tie' ? "It's a tie!" : `${winner} wins!`}
            </div>
          )}
        </header>

        <div className='game-content'>
          <div className='game-board-section'>
            <div className='game-board'>
              {board.map((cell, index) => (
                <button
                  key={index}
                  className='cell'
                  onClick={async () => await handleCellClick(index)}
                  disabled={!!cell || gameOver}
                >
                  {cell}
                </button>
              ))}
            </div>
            <div className='game-controls'>
              <button className='control-button' onClick={resetGame}>
                New Game
              </button>
              <button
                className='control-button secondary'
                onClick={backToStart}
              >
                Change Players
              </button>
            </div>
          </div>

          <div className='turn-log-section'>
            <h3>Turn Log</h3>
            <div className='turn-log'>
              {turnLog.length === 0 ? (
                <p className='no-moves'>No moves yet</p>
              ) : (
                <ul className='turn-list'>
                  {turnLog.map((turn, index) => (
                    <li key={index} className='turn-item'>
                      <span className='turn-number'>#{index + 1}</span>
                      <span className='turn-player'>{turn.player}</span>
                      <span className='turn-position'>
                        Row {turn.row}, Col {turn.column}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
