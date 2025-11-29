import { useState } from 'react'
import './Home.css'

function Home() {
    const [count, setCount] = useState<number>(0)

    return (
        <div className="home">
            <h1>Perficient Hackathon</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/pages/Home.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                React + Vite + Supabase + TypeScript
            </p>
        </div>
    )
}

export default Home
