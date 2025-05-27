'use client'

import { useState } from 'react'
import './globals.css'

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

  // Derive winner from current board state
  const getDerivedWinner = board => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // columns
      [0, 4, 8],
      [2, 4, 6] // diagonals
    ]

    for (const combination of winningCombinations) {
      const [a, b, c] = combination
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        const winningPlayer = players.find(p => p.symbol === board[a])
        return winningPlayer?.name || board[a]
      }
    }

    if (board.every(cell => cell !== null)) {
      return 'tie'
    }

    return null
  }

  // Derive all current game state
  const board = getDerivedBoard()
  const currentPlayer = getDerivedCurrentPlayer()
  const winner = getDerivedWinner(board)
  const gameOver = winner !== null

  const handlePlayerNameChange = (index, name) => {
    const newPlayers = [...players]
    newPlayers[index].name = name
    setPlayers(newPlayers)
  }

  const startGame = () => {
    if (players[0].name.trim() && players[1].name.trim()) {
      setGameStarted(true)
    }
  }

  const resetGame = () => {
    setTurnLog([])
  }

  const backToStart = () => {
    setGameStarted(false)
    setTurnLog([])
  }

  const handleCellClick = index => {
    if (board[index] || gameOver) return

    const row = Math.floor(index / 3)
    const column = index % 3

    const newTurn = {
      player: currentPlayer,
      row: row + 1, // 1-indexed for display
      column: column + 1 // 1-indexed for display
    }

    setTurnLog([...turnLog, newTurn])
  }

  const getCurrentPlayerName = () => {
    return players.find(p => p.symbol === currentPlayer)?.name || currentPlayer
  }

  if (!gameStarted) {
    return (
      <div className='container'>
        <div className='start-page'>
          <h1>Tic Tac Toe</h1>
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
          <h1>Tic Tac Toe</h1>
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
                  onClick={() => handleCellClick(index)}
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
