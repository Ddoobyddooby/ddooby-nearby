# 작업 목록

체크는 실제로 완료·확인한 작업에만 한다. 검증 명령과 결과는 [README.md](../README.md)의 M0 검증 기록을 따른다.

## M0 — Project Bootstrap

- [x] T-001 기존 저장소와 Git 상태 확인
- [x] T-002 핵심·설계 문서 작성
- [x] T-003 공통 설정 파일 작성
- [x] T-004 React/Vite/TypeScript/Tailwind 초기화
- [x] T-005 FastAPI 애플리케이션 초기화
- [x] T-006 Python uv 설정과 lockfile 생성
- [x] T-007 Docker Compose/PostGIS 구성 작성
- [x] T-008 `/api/v1/health` 구현
- [x] T-009 한국어 프론트 기본 화면 구현
- [x] T-010 API 클라이언트 기본 구성
- [x] T-011 ESLint/Ruff/테스트 설정 및 실행 확인
- [x] T-012 프론트·백엔드·DB 개발 환경 실행 검증
- [x] T-013 README 실행 방법과 실제 검증 결과 업데이트
- [x] T-014 M1 작업 목록 준비

## M1 — Map & Places (준비 목록)

- [x] Kakao Maps JavaScript 키와 `http://localhost:5180` SDK 도메인 인증 확인
- [ ] Kakao Maps 최신 이용약관·쿼터·과금 조건 확인
- [x] 다산 지금지구 지도 중심 주소 지점 좌표와 기본 2km 반경을 확인해 프론트 환경 설정에 등록
- [ ] 지도 화면에서 지역 설정값을 읽어 초기 중심을 적용하고 직접 확인
- [ ] 가상 mock 10곳 작성 및 화면에 mock 표시
- [ ] 지도·마커, 목록 전환, 세 카테고리 필터 구현
- [ ] 장소 상세와 로딩·빈 결과·오류 상태 구현
- [ ] 모바일·키보드 접근성 및 핵심 흐름 테스트
