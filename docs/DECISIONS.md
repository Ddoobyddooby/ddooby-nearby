# 설계 결정 기록

형식: **Status / Context / Decision / Consequences**. 현재 채택된 결정은 구현 단계에서 재검토할 수 있다.

## ADR-001 Monorepo
**Status:** 채택. **Context:** 프론트와 API의 스키마·문서를 함께 관리해야 한다. **Decision:** `frontend/`, `backend/`, `docs/`를 한 저장소에 둔다. **Consequences:** 변경 추적이 쉽지만 패키지 설치와 검사는 각 디렉터리에서 수행한다.

## ADR-002 React + TypeScript
**Status:** 채택. **Context:** 모바일 우선 지도 UI에 컴포넌트와 타입 검사가 필요하다. **Decision:** React, Vite, strict TypeScript, React Router, TanStack Query, Tailwind를 사용한다. **Consequences:** 프론트 전용 npm lock을 관리한다.

## ADR-003 Python FastAPI
**Status:** 채택. **Context:** 명확한 API 스키마와 Python 기반 AI 작업이 필요하다. **Decision:** FastAPI/Pydantic v2, uv를 사용한다. **Consequences:** 타입 힌트와 Pydantic 검증을 기본으로 하고 과도한 프레임워크를 피한다.

## ADR-004 PostgreSQL + PostGIS
**Status:** 채택. **Context:** 실제 장소의 반경·위치 검색이 필요하다. **Decision:** PostgreSQL/PostGIS와 SQLAlchemy 2.x/Alembic을 사용한다. 개발용 `postgis/postgis:17-3.5` 이미지에 arm64 manifest가 없어 Compose에서 `linux/amd64`를 명시한다. **Consequences:** Apple Silicon에서는 에뮬레이션으로 느려질 수 있다. 정식 모델·마이그레이션은 M2에서 만든다.

## ADR-005 Kakao Maps SDK
**Status:** 채택. **Context:** 한국 지역 지도 경험이 필요하다. **Decision:** M1부터 Kakao Maps JavaScript SDK를 연결한다. **Consequences:** 앱 키·도메인·이용 조건을 확인해야 하며 M0에는 연결하지 않는다.

## ADR-006 초기 AI 프레임워크 미도입
**Status:** 채택. **Context:** 초기 추천은 출처 통제와 설명 가능성이 우선이다. **Decision:** M4 이후 구조화 LLM 출력, Pydantic, SQL 후보, 규칙 점수로 시작한다. **Consequences:** 필요할 때만 pgvector·추가 프레임워크를 평가한다.

## ADR-007 공식 API 및 권한 있는 데이터만 사용
**Status:** 채택. **Context:** 검색 결과·게시물의 저장/재가공/AI 분석 권한은 서로 다르다. **Decision:** 출처별 최신 약관과 승인 조건을 확인하기 전에는 본문 수집·분석을 하지 않는다. **Consequences:** 일부 데이터가 늦어질 수 있으나 무단 크롤링과 권리 침해를 줄인다.

## ADR-008 다산 지금지구 초기 지역
**Status:** 채택. **Context:** 좁은 생활권에서 품질을 검증해야 한다. **Decision:** 첫 대상은 다산 지금지구로 하되 지역·반경을 설정으로 관리한다. **Consequences:** 중심 좌표를 검증해 등록하기 전에는 임의 좌표를 사용하지 않는다.

## ADR-009 Mock data first
**Status:** 채택. **Context:** 실데이터 권한·검증 이전에 UX를 구현해야 한다. **Decision:** M1까지 명시적으로 가상인 mock 10곳을 사용한다. **Consequences:** 일반 사용자에게 실제 장소처럼 노출하지 않으며 M2의 정식 데이터와 분리한다.
