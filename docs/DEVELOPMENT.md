# 개발 가이드

이 문서는 `ddooby-nearby`를 로컬에서 실행하고 작업별 결과를 확인하는 실무 가이드다. 제품 요구사항은 [SPEC.md](../SPEC.md), 작업 상태는 [TASKS.md](TASKS.md)를 따른다. 명령을 실행하지 않았다면 검증 완료라고 기록하지 않는다.

## 1. 처음 한 번

저장소 루트에서 `node --version`, `python3 --version`, `uv --version`을 확인한다. `frontend/package.json`은 Node 20.19 이상, `backend/pyproject.toml`은 Python 3.12 이상 3.15 미만을 요구한다. DB까지 사용할 때는 Docker와 Compose가 필요하다.

```sh
cp .env.example .env
cp frontend/.env.example frontend/.env
cd frontend
npm ci
cd ../backend
uv sync
```

`.env` 파일은 Git에서 제외된다. M0 health와 기본 화면에는 외부 API 키가 필요하지 않다. `VITE_` 변수는 브라우저에 공개되므로 비밀키를 넣지 않는다. 루트 `.env`의 `DATABASE_URL`과 `POSTGRES_*`를 변경한다면 서로 일치시킨다.

## 2. 매일 쓰는 명령

서버별로 터미널을 분리한다. 명령은 표시된 디렉터리에서 실행한다.

| 디렉터리 | 명령 | 용도 |
|---|---|---|
| `frontend/` | `npm run dev -- --host 127.0.0.1` | Vite 개발 서버, 기본 5173 |
| `frontend/` | `npm run typecheck` | TypeScript strict 검사 |
| `frontend/` | `npm run lint` | ESLint 검사 |
| `frontend/` | `npm run test` | Vitest 한 번 실행 |
| `frontend/` | `npm run build` | 타입 검사와 배포용 빌드 |
| `backend/` | `uv run uvicorn app.main:app --host 127.0.0.1 --port 8000` | FastAPI 개발 서버 |
| `backend/` | `uv run pytest` | 백엔드 테스트 |
| `backend/` | `uv run ruff check .` | Python 린트 |
| `backend/` | `uv lock --check` | lockfile 최신 상태 확인 |
| 저장소 루트 | `docker compose up -d db` | 로컬 PostGIS 시작 |
| 저장소 루트 | `docker compose ps db` | DB health 상태 확인 |

`docker compose down`은 컨테이너를 멈추며 볼륨은 유지한다. 데이터를 지우는 볼륨 삭제 명령은 일상적인 종료 절차에 포함하지 않는다.

## 3. M0 실행 확인

1. 백엔드를 실행하고 `curl http://127.0.0.1:8000/api/v1/health`로 `status: ok`와 HTTP 200을 확인한다. 이 health는 DB 상태를 검사하지 않는다.
2. 프론트를 실행하고 터미널에 표시된 정확한 주소를 연다. 제목 `지금, 여기!`, 첫 탐색 지역 `다산 지금지구`, API 연결 상태가 보이는지 확인한다.
3. 프론트의 타입 검사·린트·테스트·빌드와 백엔드의 Ruff·pytest를 실행한다.
4. Docker가 있으면 `docker compose config`로 구성을 확인하고 `docker compose up -d db` 후 `docker compose ps db`에서 healthy 상태를 확인한다.

2026-11-06 M0 작업에서는 프론트 검사·빌드, Vitest 1개, 백엔드 Ruff·pytest 2개, API와 홈 HTML 응답이 통과했다. Docker 설치 후 Compose 구성·DB health·PostGIS 3.5·백엔드 호스트 연결을 확인해 [T-012](TASKS.md)를 완료했다. 세부 명령과 경고는 [README 검증 기록](../README.md)을 본다. 실제 브라우저 조작 검증은 아직 하지 않았다.

## 4. 작업별 확인 방법 기록

작업을 완료할 때마다 아래 형식으로 해당 태스크의 수동 확인 절차를 추가한다. 자동 테스트 결과만으로 사용자가 화면을 확인할 수 있다고 가정하지 않는다.

| 태스크 | 실행 방법 | 기대 결과 | 실제 확인 |
|---|---|---|---|
| M0 기본 화면 | 백엔드·프론트 기동 후 홈 열기 | 서비스명·초기 지역·API 상태 표시 | HTTP·컴포넌트 테스트 확인, 실제 브라우저 확인 대기 |
| M0 health | `curl http://127.0.0.1:8000/api/v1/health` | HTTP 200과 `status: ok` | 확인 완료 |
| M0 DB | `docker compose up -d db`, `docker compose ps db`, PostGIS 조회 | `healthy`와 PostGIS 연결 | 확인 완료. Apple Silicon에서는 `linux/amd64` 에뮬레이션 |
| M1 지도·장소 | 구현 후 모바일 너비에서 필터 → 마커/목록 → 상세 이동 | 가상 데이터 표시 유지, 장소 정보 일치 | 미구현 |

## 5. 자주 만나는 문제

- **5173 포트 점유:** 다른 프로젝트의 서버를 임의로 종료하지 않는다. Vite는 `strictPort`라 포트가 사용 중이면 실패한다. `npm run dev -- --host 127.0.0.1 --port 5180`처럼 별도 포트를 쓰고 루트 `.env`의 `CORS_ORIGINS`에 그 주소를 추가한 뒤 API를 재시작한다.
- **API 연결 오류:** API 서버가 8000에서 실행 중인지, `frontend/.env`의 `VITE_API_BASE_URL`과 루트 `.env`의 `CORS_ORIGINS`가 실제 주소와 맞는지 확인한다.
- **DB 연결 오류:** M0 health는 DB를 사용하지 않는다. M2부터 Docker 상태, `DATABASE_URL`, PostGIS 확장·마이그레이션을 함께 확인한다.
- **의존성 재현:** 프론트는 `npm ci`, 백엔드는 `uv sync`로 lockfile을 사용한다. 설치·해결 실패를 통과로 기록하지 않는다.
- **외부 API 키 누락:** M0에는 필요하지 않다. M1 지도 SDK 도입 시 Kakao JavaScript 키와 등록 도메인을 확인한다.

## 6. 학습 메모

새로운 Python 구조를 도입할 때 **무엇을 해결하는지, 왜 이 패턴이 필요한지, 더 단순한 방법과 어떤 차이가 있는지**를 3~5문장으로 기록한다. 예를 들어 현재 `create_app()`은 FastAPI 앱 설정을 한 곳에서 만들고, `get_settings()`는 환경변수 파싱 결과를 재사용한다. M2의 SQLAlchemy 모델·세션·Alembic 도입 시 각각의 역할과 데이터 흐름을 이 절에 추가한다. 자동 생성 코드는 이해하기 쉬운 크기로 유지한다.
