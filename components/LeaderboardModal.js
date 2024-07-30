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
    <div style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0,0,0,0.8)',
      padding: '20px',
      borderRadius: '10px',
      color: 'white',
      textAlign: 'center'
    }}>
      <h2>Game Over</h2>
      <p>Your score: {score}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{margin: '10px 0'}}
        />
        <button type="submit" style={{margin: '0 10px'}}>Save Score</button>
        <button onClick={onClose}>Restart Game</button>
      </form>
      <h3>Leaderboard</h3>
      <ul style={{listStyle: 'none', padding: 0}}>
        {leaderboard.map((entry, index) => (
          <li key={index}>{entry.name}: {entry.score}</li>
        ))}
      </ul>
    </div>
  )
}