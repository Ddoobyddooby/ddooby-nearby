import { useQuery } from '@tanstack/react-query'
import { getHealth } from '../lib/api'

export function HomePage() {
  const health = useQuery({ queryKey: ['health'], queryFn: getHealth, retry: false })

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-8 sm:px-8">
      <header className="border-b border-emerald-900/10 pb-6">
        <p className="text-sm font-semibold text-emerald-700">Ddooby Nearby</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">지금, 여기!</h1>
        <p className="mt-3 text-slate-600">우리 동네의 몰랐던 좋은 곳을 발견하는 가장 쉬운 방법.</p>
      </header>
      <section className="mt-8 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm" aria-labelledby="region-title">
        <p className="text-sm text-emerald-700">첫 탐색 지역</p>
        <h2 id="region-title" className="mt-1 text-2xl font-semibold">다산 지금지구</h2>
        <p className="mt-4 text-slate-600">지도와 검증된 장소 정보는 M1부터 순차적으로 제공됩니다.</p>
      </section>
      <section className="mt-6 text-sm text-slate-600" aria-live="polite">
        {health.isPending && <p>서비스 연결 상태를 확인하고 있습니다.</p>}
        {health.isError && <p>API에 연결할 수 없습니다. 백엔드 실행 상태를 확인해 주세요.</p>}
        {health.isSuccess && <p>API 연결됨 · {health.data.status}</p>}
      </section>
    </main>
  )
}
