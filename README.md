# 지금, 여기! — Ddooby Nearby

> 우리 동네의 몰랐던 좋은 곳을 발견하는 가장 쉬운 방법.

다산 지금지구에서 시작하는 모바일 우선 지역 발견 서비스다. 로그인 없이 지도를 탐색하고, 검증된 장소와 확인 가능한 근거를 바탕으로 추천을 제공하는 것이 목표다. **현재 M0**에는 서비스 소개 화면과 API health만 구현됐다. 지도·장소·AI 기능은 아직 없다.

## 기술과 구조

| 영역 | 기술 | 현재 상태 |
|---|---|---|
| 프론트 | React, TypeScript strict, Vite, Tailwind CSS, Router, TanStack Query | 기본 화면·API 상태 표시 |
| API | Python, FastAPI, Pydantic v2, uv | `/api/v1/health` |
| DB | PostgreSQL 17, PostGIS 3.5, Docker Compose | 로컬 컨테이너 healthy, 호스트 연결 확인 |
| 향후 데이터 | SQLAlchemy 2.x, Alembic, httpx, psycopg | 의존성 설치, 모델·마이그레이션은 M2 |
| 검사 | Vitest, ESLint, TypeScript, pytest, Ruff | 기본 검사 구성 |

`frontend/`는 UI와 npm lock, `backend/`는 API와 uv lock, `docs/`는 계획·작업·설계·개발 절차 문서다. 루트의 [CLAUDE.md](CLAUDE.md)와 [AGENTS.md](AGENTS.md)는 도구별 지침이다. 요구사항 기준은 [SPEC.md](SPEC.md), 순서는 [PLAN.md](docs/PLAN.md), 진행 상태는 [TASKS.md](docs/TASKS.md)다. 실행·확인 방법은 [DEVELOPMENT.md](docs/DEVELOPMENT.md), 탭별 협업은 [WORKFLOW.md](docs/WORKFLOW.md)를 따른다.

## 사전 요구사항

- Node.js **20.19 이상**과 npm. 이 저장소의 Vite lock은 Node 24.22.2에서 생성·검증했다.
- Python **3.12 이상, 3.15 미만**과 [uv](https://docs.astral.sh/uv/). lock은 Python 3.14.2에서 생성·검증했다.
- DB를 사용할 때 Docker Desktop/Engine과 Compose 플러그인. 이 Mac의 Docker Engine 29.9.2·Compose 5.6.1에서 실행을 확인했다.

패키지의 정확한 해결 버전은 `frontend/package-lock.json`과 `backend/uv.lock`에 기록됐다. `package.json`/`pyproject.toml`은 호환 범위를 선언한다.

## 최초 실행

저장소 루트에서 `.env.example`을 `.env`로 복사한다. `.env`는 백엔드·Compose의 로컬 설정이고 Git에서 제외된다. 프론트는 `frontend/.env.example`을 `frontend/.env`로 복사한다. `VITE_` 값은 브라우저 번들에 포함되므로 공개 가능한 값만 넣는다. **M0 health만 확인할 때는 기본값으로도 실행된다.** 실제 API 키는 필요하지 않다.

### 백엔드

```sh
cd backend
uv sync
uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
```

별도 터미널에서 `curl http://127.0.0.1:8000/api/v1/health`를 실행하면 `{"status":"ok","app":"ddooby-nearby","environment":"development"}`가 반환된다. 이 health는 DB 연결 상태를 검사하지 않는다.

### 프론트엔드

```sh
cd frontend
npm ci
npm run dev -- --host 127.0.0.1
```

브라우저에서 `http://127.0.0.1:5173/`을 연다. API가 실행 중이면 화면 하단에 연결 상태가 표시된다. API가 없으면 연결 오류 안내가 표시된다. `VITE_API_BASE_URL`의 기본값은 `http://localhost:8000/api/v1`이다.

다른 앱이 5173을 사용 중이면 Vite는 포트를 임의 변경하지 않고 실패한다. 그 앱을 유지하려면 `npm run dev -- --host 127.0.0.1 --port 5180`처럼 별도 포트를 지정하고, 루트 `.env`의 `CORS_ORIGINS`에 `http://127.0.0.1:5180`을 추가한 뒤 API를 재시작한다.

### 로컬 DB

```sh
docker compose up -d db
docker compose ps db
docker compose down
```

DB는 호스트 `127.0.0.1:5432`에만 바인딩되며 `nearby-postgres` 볼륨에 보존된다. 개발 기본 계정은 `nearby/nearby`, DB명은 `nearby`다. 변경 시 루트 `.env`의 `POSTGRES_*`와 `DATABASE_URL`을 함께 수정한다. DB가 없어도 M0 API와 프론트는 실행된다. Apple Silicon에서는 이 PostGIS 태그에 arm64 이미지가 없어 Compose가 `linux/amd64`로 실행한다. 에뮬레이션 때문에 네이티브 이미지보다 느릴 수 있다. 새로 설치한 Docker CLI가 기존 터미널의 `PATH`에 없다면 새 터미널을 열거나 `~/.docker/bin`을 `PATH`에 추가한다.

## 검사 명령

```sh
cd frontend
npm run typecheck
npm run lint
npm run test
npm run build
```

```sh
cd backend
uv run ruff check .
uv run pytest
```

## M0 검증 기록 (2026-11-06 KST)

| 항목 | 실제 명령 | 결과 |
|---|---|---|
| 프론트 의존성 | `npm install ...`, `npm install -D ...` | 성공, `package-lock.json` 생성 |
| 백엔드 의존성 | `uv sync` | 성공, `uv.lock` 생성 |
| 타입·린트·테스트 | `npm run typecheck`, `npm run lint`, `npm run test` | 모두 통과, Vitest 1개 통과 |
| 빌드 | `npm run build` | 통과 |
| 백엔드 검사 | `uv run ruff check .`, `uv run pytest`, `uv lock --check` | 통과, pytest 2개 통과. TestClient의 httpx 폐기 예정 경고 1개 |
| 서버·HTTP | `uv run uvicorn ...`, `npm run dev -- --host 127.0.0.1 --port 5180`, `curl -i .../health`, `curl -i ...:5180/` | API health JSON 200, 이 프로젝트 홈 HTML 제목 `지금, 여기!`와 200 확인 |
| DB | `docker compose config --quiet`, `docker compose up -d db`, `docker compose up --wait db`, `docker compose ps db`, 컨테이너 `psql` 및 백엔드 `psycopg` 조회 | Compose 구성 통과, 컨테이너 healthy, 양쪽에서 `nearby`와 PostGIS 3.5 확인. 이 터미널에서는 Docker CLI의 절대 경로와 임시 `PATH`를 사용 |
| 의존성 보안 | `npm audit --omit=dev --audit-level=moderate`, `npm audit --audit-level=moderate` | 런타임 0건, 개발 의존성 10건 moderate (`minimatch` 계열). 자동 수정은 ESLint 10→9 강제 변경을 요구해 적용하지 않음 |

초기 검사에서 백엔드 `pytest` import 경로와 Ruff 줄 길이 오류가 있었고 수정 후 재실행해 통과했다. 샌드박스에서 로컬 포트 바인딩이 막혀 서버·HTTP 검사는 허용된 로컬 실행으로 재시도했다. **5173은 기존 Ddooby-Pang 서버가 사용 중**이어서 첫 `curl -I ...:5173/` 결과는 이 프로젝트 검증에서 제외했다. 별도 5180 포트에서 이 프로젝트 HTML 제목을 확인했다. HTTP 200은 HTML과 health 응답 확인이며 실제 브라우저 화면 조작 검증은 아직 하지 않았다. Docker 설치 후에는 처음 `PATH`에서 인증 도우미를 찾지 못했고, 다음에는 PostGIS 이미지의 arm64 manifest가 없어 실패했다. CLI 경로와 Compose 플랫폼을 수정한 뒤 DB 검증을 완료했다.

## 환경변수와 데이터 원칙

루트 `.env.example`에는 서버 설정, DB 연결, 지역 코드·반경과 미래 외부 API 키 이름을 문서화했다. 실제 키는 커밋하지 않는다. 프론트 `.env.example`에는 공개 API URL, Kakao JavaScript 키 자리, M1의 검증된 초기 지도 중심과 2km 반경을 둔다. 실제 JavaScript 키는 Git에서 제외된 `frontend/.env`에 설정한다. 좌표의 근거는 [개발 가이드](docs/DEVELOPMENT.md)에 기록했다.

미확인 장소·후기를 실제 데이터처럼 표시하지 않는다. M1의 mock은 가상 데이터로 명시한다. 출처·확인일 없이 AI가 장소나 장점을 생성하지 않게 한다. 네이버 블로그 검색 결과 등의 저장·재가공·AI 처리 권한은 최신 약관 확인 전에는 가정하지 않는다. 자세한 기준은 [데이터 정책](docs/data-policy.md)에 있다.

## 다음 단계

M1에서 설정한 다산 지금지구 주소 지점 좌표를 Kakao 지도 초기 중심으로 읽고, 이 프로젝트 화면에서 지도·마커를 확인한다. JavaScript 키와 `http://localhost:5180` 도메인의 SDK 로드·지도 객체 생성은 별도 브라우저 검사로 확인했다. 이어 가상 mock 10곳으로 지도·카테고리·상세·상태 UI를 구현한다. M2~M6은 실제 장소 데이터, 근거, AI 특징, 자연어 추천, 안정화 순서다. DB 컨테이너는 M0 검증 후 실행 상태로 두었으며, 개발을 다시 시작할 때는 `docker compose ps db`로 health를 확인한다.
