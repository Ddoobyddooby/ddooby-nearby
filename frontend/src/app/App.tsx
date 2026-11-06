import { Route, Routes } from 'react-router-dom'
import { HomePage } from './HomePage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="*" element={<main className="mx-auto max-w-xl p-6"><h1 className="text-2xl font-bold">페이지를 찾을 수 없습니다</h1></main>} />
    </Routes>
  )
}
