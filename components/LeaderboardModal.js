import { useState, useEffect } from 'react'

export default function LeaderboardModal({ score, onClose }) {
  const [name, setName] = useState('')
  const [leaderboard, setLeaderboard] = useState([])

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(res => res.json())
      .then(data => setLeaderboard(data))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, score })
    })
    if (res.ok) {
      const updatedLeaderboard = await res.json()
      setLeaderboard(updatedLeaderboard)
      setName('')
    }
  }

  return (
    <div className="modal">
      <h2>Game Over</h2>
      <p>Your score: {score}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button type="submit">Submit Score</button>
      </form>
      <h3>Leaderboard</h3>
      <ul>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.name}: {entry.score}</li>
        ))}
      </ul>
      <button onClick={onClose}>Restart Game</button>
    </div>
  )
}
