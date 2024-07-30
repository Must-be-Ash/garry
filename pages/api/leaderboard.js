import { supabase } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(10)
    
    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json(data)
    }
  } else if (req.method === 'POST') {
    const { name, score } = req.body
    const { data, error } = await supabase
      .from('leaderboard')
      .insert({ name, score })
      .select()
    
    if (error) {
      res.status(500).json({ error: error.message })
    } else {
      res.status(200).json(data)
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}