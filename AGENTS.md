# Codex 프로젝트 지침

사용자가 `/graphify`를 입력하면 설치된 graphify 스킬 지침을 먼저 따른다. 이 파일은 Codex용이다. Claude Code용 [CLAUDE.md](CLAUDE.md)와 별도로 관리하되 제품·코드·검증·Git 규칙을 일치시킨다.

## 역할과 문서

- 기본 협업은 `codex-main`이 제품 요구사항·수용 기준과 독립 리뷰를, `codex-디자이너`가 요청받은 시각 작업을, `claude-PL`이 기술 계획·구현 조정을, `claude-1·2`가 담당 코드·테스트를 맡는다. 사용자가 Codex에 직접 수정 작업을 지시하면 그 요청을 수행한다. 탭 ID와 순서는 [docs/WORKFLOW.md](docs/WORKFLOW.md)를 따른다.
- 디자이너 요청에는 사용처·크기·접근성·결과물 경로를 명시한다. 실제 장소 사진으로 오인될 수 있는 생성 이미지를 장소 정보로 쓰지 않으며, 사용자가 선택한 자산만 Claude 개발팀이 코드에 연결한다.
- 리뷰 요청만 받았다면 대상 커밋·브랜치·파일을 **읽기 전용**으로 검토한다. 구현 탭의 worktree와 미커밋 변경은 수정하지 않는다. 예외로 지시받은 `.codex-out/<태스크ID>-review.md` 결과 파일 하나는 작성할 수 있다. 결과는 `통과` 또는 `지적 있음`으로 시작하고, 지적마다 심각도·파일:줄·근거·재현 조건·제안을 적는다. 확신이 없으면 `확인 필요`로 표시한다.
- 작업 전 `git status`와 관련 코드·문서를 읽는다. [SPEC.md](SPEC.md)가 제품 요구사항의 기준이며, [docs/PLAN.md](docs/PLAN.md)는 개발 순서, [docs/TASKS.md](docs/TASKS.md)는 현재 작업이다. 제품 문서가 충돌하면 **SPEC → PLAN → TASKS** 순으로 해석한다. 중요한 기술 결정은 [docs/DECISIONS.md](docs/DECISIONS.md)의 ADR을 확인·갱신한다.
- 실행·사용자 확인 방법은 [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md), 데이터 권한은 [docs/data-policy.md](docs/data-policy.md)를 따른다.

## 직접 구현을 맡았을 때

1. 현재 마일스톤에서 선행 조건이 충족된 작은 태스크를 진행한다. 기존 사용자 작업을 덮어쓰지 않는다.
2. 제품 규칙·수용 기준이 바뀌면 SPEC을 먼저 갱신한다. 계획·태스크 변경은 PLAN·TASKS에, 중요한 설계 선택은 DECISIONS에 반영한다.
3. 구현 후 해당 타입 검사·린트·테스트와 필요한 화면/API 확인을 실행한다. 미실행·실패 검사를 성공으로 보고하지 않는다. 완료 기준을 확인한 태스크만 `[x]`로 바꾼다.
4. `docs/DEVELOPMENT.md` 4절에 사용자가 직접 확인할 절차와 실제 상태를 적는다. 새 Python 패턴은 6절에 선택 이유와 관련 파일을 설명한다. 새 명령은 2절에 추가한다.

## 코드와 제품 원칙

- 불필요한 추상화·의존성을 피한다. Python 타입 힌트와 TypeScript strict mode를 유지한다. UI와 설계 문서는 한국어, 코드 식별자는 영어로 작성한다.
- 프론트는 React 화면·상태를 담당하고, API는 FastAPI `/api/v1`와 Pydantic 검증을 담당한다. 지역·반경은 설정/데이터로 관리하며 검증되지 않은 중심 좌표를 추측하지 않는다.
- 미확인 장소·후기를 실제 데이터처럼 표시하지 않는다. mock은 가상 데이터로 구분한다. `published` 실제 장소만 공개하고 미확인 속성은 `unknown`으로 처리한다.
- AI는 DB에 없는 장소나 근거 없는 특징·추천 이유를 생성하지 않는다. 사실·추천에는 출처와 확인 날짜를 연결한다. 데이터 저장·표시·AI 처리 권한을 출처별로 확인하며, 권한이 미확인인 네이버 블로그 본문을 수집·분석하지 않는다.
- 비밀키와 `.env`를 커밋하지 않는다. `VITE_` 값에는 공개 가능한 정보만 둔다. 현재 마일스톤 밖의 기능을 구현하지 않는다.

## 검증과 Git

- 프론트(`frontend/`): `npm run typecheck`, `npm run lint`, `npm run test`, 필요 시 `npm run build`와 모바일 화면 확인.
- 백엔드(`backend/`): `uv run ruff check .`, `uv run pytest`, 변경한 API 직접 호출. DB는 Docker가 있을 때 `docker compose config`와 health를 확인한다.
- worktree·브랜치 상태를 가정하지 말고 작업 전 다시 확인한다. 첫 커밋 후 필요하면 별도 worktree를 사용한다. 커밋 메시지는 `[feat] ...`, `[fix] ...`, `[docs] ...`처럼 목적을 드러낸다. 자동 push, force push, reset, rebase를 하지 않는다.

## 학습을 돕는 구현

개발자는 Python 기초 문법을 알고 Python 백엔드·AI 애플리케이션 역량을 키우고 있다. 새로운 Python 패턴이나 복잡한 구조를 도입할 때 선택 이유를 설명하고, 과도한 자동 생성·추상화를 피한다.
