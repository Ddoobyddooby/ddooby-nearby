import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HomePage } from './HomePage'

test('서비스 이름과 초기 지역을 표시한다', () => {
  render(<QueryClientProvider client={new QueryClient()}><HomePage /></QueryClientProvider>)
  expect(screen.getByRole('heading', { name: '지금, 여기!' })).toBeTruthy()
  expect(screen.getByRole('heading', { name: '다산 지금지구' })).toBeTruthy()
})
