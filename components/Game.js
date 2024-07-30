import { useState, useEffect, useRef } from 'react'
import LeaderboardModal from './LeaderboardModal'

export default function Game() {
  const [score, setScore] = useState(0)
  const [speed, setSpeed] = useState(5) // Start with a higher speed
  const [gameOver, setGameOver] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  
  const canvasRef = useRef(null)
  const playerRef = useRef({ y: 0, yVelocity: 0, jumping: false, doubleJump: false })
  const coinsRef = useRef([])
  const barriersRef = useRef([])
  const groundYRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animationFrameId

    // Set canvas size to cover the screen
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const player = new Image()
    player.src = '/player.png'
    const coin = new Image()
    coin.src = '/coin.png'
    const barrier = new Image()
    barrier.src = '/barrier.png'

    groundYRef.current = canvas.height - 100 // Ground position
    playerRef.current.y = groundYRef.current - 50 // Initial player position

    const gameLoop = () => {
      ctx.fillStyle = '#1e1e1e'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw player
      ctx.drawImage(player, 50, playerRef.current.y, 50, 50)

      // Update and draw coins
      coinsRef.current.forEach((coinObj, index) => {
        coinObj.x -= speed
        ctx.drawImage(coin, coinObj.x, coinObj.y, 30, 30)
        
        // Check collision with player
        if (Math.abs(coinObj.x - 50) < 40 && Math.abs(coinObj.y - playerRef.current.y) < 40) {
          coinsRef.current.splice(index, 1)
          setScore(prevScore => prevScore + 10)
        }
      })

      // Update and draw barriers
      barriersRef.current.forEach((barrierObj, index) => {
        barrierObj.x -= speed
        ctx.drawImage(barrier, barrierObj.x, groundYRef.current - 100, 50, 100)
        
        // Check collision with player
        if (barrierObj.x < 100 && barrierObj.x > 0 && playerRef.current.y + 50 > groundYRef.current - 100) {
          setGameOver(true)
        }

        // Remove barriers that have gone off screen
        if (barrierObj.x < -50) {
          barriersRef.current.splice(index, 1)
        }
      })

      // Handle jumping
      playerRef.current.y += playerRef.current.yVelocity
      playerRef.current.yVelocity += 0.5 // Gravity

      if (playerRef.current.y > groundYRef.current - 50) {
        playerRef.current.y = groundYRef.current - 50
        playerRef.current.yVelocity = 0
        playerRef.current.jumping = false
        playerRef.current.doubleJump = false
      }

      // Display score and speed
      ctx.fillStyle = 'white'
      ctx.font = '20px Arial'
      ctx.fillText(`Score: ${score}`, 10, 30)
      ctx.fillText(`Speed: ${speed.toFixed(1)}`, canvas.width - 120, 30)

      if (!gameOver) {
        animationFrameId = requestAnimationFrame(gameLoop)
      } else {
        setShowLeaderboard(true)
      }
    }

    gameLoop()

    // Increase speed every 10 seconds
    const speedInterval = setInterval(() => {
      setSpeed(prevSpeed => prevSpeed + 0.5)
    }, 10000)

    // Generate coins and barriers
    const generateObjects = () => {
      if (Math.random() < 0.02) {
        coinsRef.current.push({ x: canvas.width, y: Math.random() * (canvas.height - 150) + 50 })
      }
      if (Math.random() < 0.01) {
        barriersRef.current.push({ x: canvas.width })
      }
    }

    const objectInterval = setInterval(generateObjects, 100)

    // Handle jump
    const handleJump = () => {
      if (!playerRef.current.jumping) {
        playerRef.current.yVelocity = -12
        playerRef.current.jumping = true
      } else if (!playerRef.current.doubleJump) {
        playerRef.current.yVelocity = -10
        playerRef.current.doubleJump = true
      }
    }

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        handleJump()
      }
    })

    canvas.addEventListener('touchstart', handleJump)

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      groundYRef.current = canvas.height - 100
      playerRef.current.y = groundYRef.current - 50
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(speedInterval)
      clearInterval(objectInterval)
      window.removeEventListener('keydown', handleJump)
      canvas.removeEventListener('touchstart', handleJump)
      window.removeEventListener('resize', handleResize)
    }
  }, [score, speed, gameOver])

  return (
    <div style={{backgroundColor: '#2e2e2e', padding: '0', margin: '0', height: '100vh', overflow: 'hidden'}}>
      <canvas ref={canvasRef} style={{display: 'block'}} />
      {showLeaderboard && (
        <LeaderboardModal score={score} onClose={() => {
          setShowLeaderboard(false)
          setGameOver(false)
          setScore(0)
          setSpeed(5)
          playerRef.current = { y: groundYRef.current - 50, yVelocity: 0, jumping: false, doubleJump: false }
          coinsRef.current = []
          barriersRef.current = []
        }} />
      )}
      <p style={{color: 'white', position: 'absolute', bottom: '10px', left: '10px'}}>
        Instructions: Press space to jump or tap the screen if you're on mobile. Double tap for double jump.
      </p>
    </div>
  )
}
