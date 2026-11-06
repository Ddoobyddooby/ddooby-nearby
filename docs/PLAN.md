# 개발 계획

M0는 6주 일정 이전의 사전 준비 단계다. M1~M6을 각 1주 목표로 계획하되 실제 진도와 외부 데이터 권한 확인 결과에 따라 조정한다.

| 단계 | 목표와 주요 작업 | 선행 조건 | 완료 기준 |
|---|---|---|---|
| M0 Project Bootstrap | 요구사항·설계 문서, React/FastAPI 최소 실행, health, uv/npm lock, PostGIS Compose, 기본 검사 | 빈 저장소 확인 | 로컬 실행·검사 결과 기록, 미검증 항목 명시 |
| M1 Map & Places (1주) | 지도 SDK, mock 10곳, 카테고리·목록·상세, 상태 UI | M0; Kakao 키·정확한 중심 좌표 확인 | 모바일 탐색 흐름과 mock 표시, 테스트 |
| M2 Real Place Data (2주) | 정식 DB·Alembic, PostGIS 검색, 공식 API/공공데이터 후보, 중복 검토 | M1; 데이터 이용 권한 | 검증된 장소 30곳 목표, 게시 승인 기록 |
| M3 Evidence Pipeline (3주) | 출처·확인 날짜·상태 저장, 상세 표시, 수정·숨김 절차 | M2; 출처별 저장/표시 권한 | 게시 장소의 사실 정보에 근거 연결 |
| M4 AI Feature Extraction (4주) | 허용 자료 입력, 구조화 출력·Pydantic 검증, 인간 검토 | M3; AI 처리 권한 | 근거 없는 특징 배제, 평가 샘플 통과 |
| M5 AI Search & Recommendation (5주) | 자연어 조건 파싱, SQL 후보, 규칙 점수, 근거 기반 설명 | M4 | 존재 장소만 추천, 이유·출처 추적 가능 |
| M6 Stabilization & Release (6주) | 접근성·성능·오류 처리·기기 검증, 배포·운영 점검 | M1~M5 | SPEC 출시 조건과 회귀 검사 충족 |

각 단계 시작 시 [TASKS.md](TASKS.md)를 실제 작업 단위로 세분화한다. 데이터 권한이 확인되지 않으면 해당 수집·AI 처리 작업을 보류하고 허용된 출처로 대체한다.
