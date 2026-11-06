# Claude Code 프로젝트 지침

**지금, 여기!**는 검증 가능한 정보로 동네 장소를 발견하는 모바일 우선 웹 서비스다. 주 개발 도구는 Claude Code다. 응답·UI·설계 문서는 한국어, 코드 식별자는 영어로 작성한다.

## 문서와 우선순위

작업 전에 `git status`와 관련 파일을 읽는다. 문서가 충돌하면 **제품 요구사항은 SPEC → PLAN → TASKS** 순으로 해석하고, 중요한 기술 결정은 DECISIONS의 채택된 ADR을 확인한다.

| 문서 | 역할 |
|---|---|
| [SPEC.md](SPEC.md) | 무엇을 왜 만드는지, 기능·화면·수용 기준 |
| [docs/PLAN.md](docs/PLAN.md) | M0~M6 구현 순서와 완료 기준 |
| [docs/TASKS.md](docs/TASKS.md) | 현재 작업과 실제 완료 상태 |
| [docs/DECISIONS.md](docs/DECISIONS.md) | 중요한 설계 선택과 결과 |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) | 실행 명령, 직접 확인 방법, 학습 메모 |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Claude 탭·Codex 역할과 위임·리뷰 절차 |
| [docs/data-policy.md](docs/data-policy.md) | 출처 권한, 최신성, AI 처리 기준 |

## 현재 팀

`codex-main`은 제품 요구사항·독립 리뷰, `codex-디자이너`는 요청받은 시각 작업, `claude-PL`은 기술 계획·구현 조정, `claude-1·2`는 담당 코드·테스트를 맡는다. 정확한 `orcaTabId`와 전달 절차는 `docs/WORKFLOW.md`의 표를 단일 기준으로 사용한다. 사용자가 특정 탭에 직접 지시한 일은 그 지시를 우선한다.

## 작업 방식

- `docs/TASKS.md`에서 현재 마일스톤의 미완료 태스크를 확인하고 한 번에 작은 범위를 진행한다. 선행 조건이 해결되지 않았으면 다른 독립 작업을 진행하고 이유를 기록한다.
- 제품 규칙·수용 기준을 바꿔야 하면 SPEC을 먼저 갱신한다. 구현 순서나 태스크가 달라지면 PLAN·TASKS를 맞추고 중요한 설계 변경은 ADR로 남긴다.
- 완료 기준을 **실제로 확인한 뒤에만** `[x]`로 바꾼다. 미실행·실패 검사를 통과로 보고하지 않는다.
- 완료 시 `docs/DEVELOPMENT.md` 4절에 사용자가 직접 확인할 절차와 실제 상태를 추가한다. 새로운 Python 패턴은 6절에 선택 이유와 관련 파일을 짧게 설명한다. 새 명령은 2절에 반영한다.
- 같은 파일을 두 탭이 동시에 수정하지 않는다. 지시문은 다른 탭이 대화 맥락을 몰라도 실행할 수 있게 쓴다. 디자인 시안은 사용자가 선택한 뒤 제품 코드에 연결한다. 세부 순서는 `docs/WORKFLOW.md`를 따른다.
- `AGENTS.md`는 Codex용 별도 지침이다. 두 파일의 제품·코드·검증·Git 규칙을 일치시킨다.

## 아키텍처와 데이터 규칙

- 프론트는 React·strict TypeScript의 화면과 API 상태를 담당한다. 서버 데이터는 TanStack Query, 화면 이동은 React Router를 사용한다. 지도 SDK 연결은 M1 범위다.
- 백엔드는 FastAPI `/api/v1`와 Pydantic 검증을 담당한다. Python 타입 힌트를 쓰고 서비스·DB 구조는 실제 필요가 생길 때 작게 추가한다.
- 장소 UUID와 외부 서비스 ID를 분리하고 지역·반경은 설정/데이터로 관리한다. 검증 전 중심 좌표를 추측해 넣지 않는다.
- 미검증 장소·후기를 실제처럼 표시하지 않는다. mock은 가상 데이터로 명시한다. `published` 실제 장소만 공개하고 미확인 속성은 `unknown`으로 처리한다.
- AI는 DB 후보 안에서만 장소를 다루고, 특징·추천 이유는 근거 ID와 확인 날짜로 추적할 수 있어야 한다. 권한이 확인되지 않은 네이버 블로그 본문을 수집·분석하지 않는다.
- `.env`와 비밀키를 커밋하지 않는다. 브라우저의 `VITE_` 변수에는 공개 가능한 값만 둔다. 과도한 추상화와 범위 밖 기능을 추가하지 않는다.

## 검증 명령

- 프론트(`frontend/`): `npm run typecheck`, `npm run lint`, `npm run test`, 화면 변경 시 `npm run build`와 모바일 화면 확인.
- 백엔드(`backend/`): `uv run ruff check .`, `uv run pytest`, 변경한 API의 직접 호출.
- DB(저장소 루트): Docker가 있을 때 `docker compose config`, `docker compose ps db`. M0 health는 DB 연결 상태를 뜻하지 않는다.
- 검사 결과와 미실행 이유를 태스크 보고에 적는다. 다른 프로젝트의 실행 서버와 미커밋 변경은 건드리지 않는다.

## Git

worktree 사용 전 Git 상태를 다시 확인한다. 병렬 작업은 파일 소유를 나누고 필요하면 첫 커밋 후 별도 worktree에서 진행한다. 커밋 메시지는 `[feat] ...`, `[fix] ...`, `[docs] ...`처럼 목적을 드러낸다. 자동 push, force push, reset, rebase를 하지 않는다. 사용자가 특정 탭에 직접 맡긴 작업은 그 지시를 우선한다.
