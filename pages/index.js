import Head from 'next/head'
import Game from '../components/Game'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Dino Runner</title>
        <meta name="description" content="Dino running game" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Game />
      </main>

      <Footer />
    </div>
  )
}
