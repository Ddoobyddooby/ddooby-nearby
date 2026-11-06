# API 계약 초안

기본 경로는 `/api/v1`이며 JSON을 사용한다. **M0 구현은 health 한 개뿐**이다. 아래 장소·추천 예시는 계약 설계를 위한 **가상 데이터**이며 실제 장소를 뜻하지 않는다. 날짜는 ISO 8601 UTC, ID는 UUID 문자열, 거리 단위는 m다. 오류 본문은 계획상 `{"error":{"code":"...","message":"..."}}`로 통일한다(M1 이후 구현).

## GET /api/v1/health — M0 구현

파라미터 없음. 200 예시: `{"status":"ok","app":"ddooby-nearby","environment":"development"}`. 프로세스 응답만 확인하며 DB 준비 상태를 뜻하지 않는다.

## GET /api/v1/places — M1 설계, M2 DB 연결

선택 query: `region`(등록된 지역 코드, 기본 `DEFAULT_REGION`), `category`(`cafe_bakery|restaurant|park_walk`), `lat`(-90~90)와 `lng`(-180~180), `radius_m`(100~10000, 기본 2000), `limit`(1~100, 기본 20), `cursor`(서버 발급). `lat`/`lng`는 둘 다 제공해야 한다. 좌표 미지정 시 검증된 지역 중심을 사용하며 중심 미등록이면 설정 오류를 반환한다. 공개 응답은 `published` 장소만 포함한다.

200 가상 예시:
```json
{"items":[{"id":"00000000-0000-4000-8000-000000000001","name":"가상 카페 A","category":"cafe_bakery","address":"가상 주소","latitude":null,"longitude":null,"verification_status":"unknown","checked_at":null,"is_mock":true}],"next_cursor":null}
```
mock의 위치는 검증 전이므로 `null`이며 지도에 표시하지 않는다. 실제 게시 장소는 유효한 좌표가 필수다. 422는 잘못된 범위·조합, 400은 미등록 지역, 503은 저장소 장애다.

## GET /api/v1/places/{place_id} — M1 설계

`place_id`는 UUID 형식. 200은 목록 필드에 `description`, `features`(각각 상태·근거 ID), `last_checked_at`을 추가한다. 공개 가능한 게시 장소가 없으면 404. 가상 예시: `{"id":"00000000-0000-4000-8000-000000000001","name":"가상 카페 A","category":"cafe_bakery","description":null,"features":[],"last_checked_at":null,"is_mock":true}`.

## GET /api/v1/places/{place_id}/evidence — M3 설계

`place_id`는 UUID. 200 예시: `{"items":[{"id":"00000000-0000-4000-8000-000000000011","claim":"가상 특징","status":"unknown","source_type":"example","source_url":null,"checked_at":null}],"place_id":"00000000-0000-4000-8000-000000000001"}`. 실제 공개 시 출처 권한·URL·확인 시각을 검증한다. 미존재/비공개 장소는 404.

## POST /api/v1/recommendations — M5 설계

요청 JSON: `{"query":"조용히 쉬기 좋은 곳","region":"dasan-jigeum","category":"cafe_bakery","limit":5}`. `query`는 공백 제거 후 2~300자, `limit`는 1~10, 지역·카테고리는 등록값만 허용한다. 개인식별정보는 입력하지 않도록 UI에서 안내한다.

근거가 없는 경우의 200 가상 예시: `{"items":[],"interpreted_query":{"category":"cafe_bakery"}}`. 실제 추천은 빈 근거를 장점으로 바꾸지 않으며 근거가 없으면 후보를 제외한다. 422는 입력 오류, 503은 검색/AI 의존성 장애다. 빈 결과는 200과 빈 `items`로 반환한다.

## 공통 검증

서버는 Pydantic으로 숫자 범위·열거형·UUID를 검증하고, 공개 상태·근거 접근 권한을 다시 확인한다. 클라이언트 입력을 SQL 문자열로 연결하지 않는다. API 버전 변경 시 계약과 프론트 타입을 함께 갱신한다.
