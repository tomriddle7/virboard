import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <h1 className="text-4xl font-bold text-blue-600">
        Tailwind CSS v4 + React + TypeScript + Vite 🎉
      </h1>
    </div>
  )
}

export default App
