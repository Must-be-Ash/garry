import { useState, useEffect, useRef } from 'react'
import LeaderboardModal from './LeaderboardModal'

export default function Game() {
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  
  const canvasRef = useRef(null)
  const playerRef = useRef({ y: 0, jumping: false })
  const coinsRef = useRef([])
  const barriersRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    const player = new Image()
    player.src = '/player.png'
    const coin = new Image()
    coin.src = '/coin.png'
    const barrier = new Image()
    barrier.src = '/barrier.png'

    const gameLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw player
      ctx.drawImage(player, 50, playerRef.current.y)

      // Update and draw coins
      coinsRef.current.forEach((coinObj, index) => {
        coinObj.x -= speed
        ctx.drawImage(coin, coinObj.x, coinObj.y)
        
        // Check collision with player
        if (Math.abs(coinObj.x - 50) < 30 && Math.abs(coinObj.y - playerRef.current.y) < 30) {
          coinsRef.current.splice(index, 1)
          setScore(prevScore => prevScore + 1)
        }
      })

      // Update and draw barriers
      barriersRef.current.forEach((barrierObj) => {
        barrierObj.x -= speed
        ctx.drawImage(barrier, barrierObj.x, barrierObj.y)
        
        // Check collision with player
        if (Math.abs(barrierObj.x - 50) < 30 && Math.abs(barrierObj.y - playerRef.current.y) < 30) {
          setGameOver(true)
        }
      })

      // Handle jumping
      if (playerRef.current.jumping) {
        playerRef.current.y -= 5
        if (playerRef.current.y <= 100) {
          playerRef.current.jumping = false
        }
      } else if (playerRef.current.y < 200) {
        playerRef.current.y += 5
      }

      // Display score and speed
      ctx.font = '20px Arial'
      ctx.fillText(`Score: ${score}`, 10, 30)
      ctx.fillText(`Speed: ${speed.toFixed(1)}`, 10, 60)

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop)
      } else {
        setShowLeaderboard(true)
      }
    }

    gameLoop()

    // Increase speed every 10 seconds
    const speedInterval = setInterval(() => {
      setSpeed(prevSpeed => prevSpeed + 0.1)
    }, 10000)

    // Generate coins and barriers
    const generateObjects = () => {
      if (Math.random() < 0.02) {
        coinsRef.current.push({ x: canvas.width, y: Math.random() * (canvas.height - 50) })
      }
      if (Math.random() < 0.01) {
        barriersRef.current.push({ x: canvas.width, y: 200 })
      }
    }

    const objectInterval = setInterval(generateObjects, 100)

    // Handle jump
    const handleJump = () => {
      if (playerRef.current.y === 200) {
        playerRef.current.jumping = true
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        handleJump()
      }
    })

    canvas.addEventListener('touchstart', handleJump)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(speedInterval)
      clearInterval(objectInterval)
      window.removeEventListener('keydown', handleJump)
      canvas.removeEventListener('touchstart', handleJump)
    }
  }, [score, speed, gameOver])

  return (
    <div>
      <canvas ref={canvasRef} width={800} height={400} />
      {showLeaderboard && (
        <LeaderboardModal score={score} onClose={() => {
          setShowLeaderboard(false)
          setGameOver(false)
          setScore(0)
          setSpeed(1)
          playerRef.current = { y: 200, jumping: false }
          coinsRef.current = []
          barriersRef.current = []
        }} />
      )}
      <p>Instructions: Press space to jump or tap the screen if you're on mobile.</p>
    </div>
  )
}
