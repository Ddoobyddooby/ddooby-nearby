# 데이터 모델 설계 (M2 구현 예정)

M0에는 DB 모델과 마이그레이션이 없다. PostgreSQL 17/PostGIS 3.5 개발용 컨테이너만 정의했다. 아래는 M2에서 검토·구현할 정규 스키마 초안이다. PK는 UUID, 시각은 `timestamptz`, 좌표는 WGS84 `geography(Point,4326)`를 사용한다.

| 테이블 | 주요 컬럼 | 제약과 인덱스 |
|---|---|---|
| `places` | `id` PK, `name`, `category`, `address`, `location`, `region_code`, `status`, `verification_status`, `last_checked_at`, `created_at`, `updated_at` | `status`는 `pending/published/hidden/closed`; `verification_status`는 `verified/reported/unknown`; 위치 GiST, `(region_code,status,category)` B-tree. 게시 시 이름·주소·위치·확인 시각 필수 |
| `place_external_ids` | `id` PK, `place_id` FK, `provider`, `external_id`, `source_url`, `created_at` | `(provider,external_id)` 유일, `place_id` 인덱스. 공급자 ID를 내부 UUID와 분리 |
| `evidence_sources` | `id` PK, `place_id` FK, `source_type`, `source_url`, `claim`, `verification_status`, `checked_at`, `usage_scope`, `created_at` | `(place_id,checked_at)` 인덱스. 권한·확인 시각을 기록하고 삭제/숨김 정책 검토 |
| `place_features` | `id` PK, `place_id` FK, `feature_code`, `value`, `verification_status`, `evidence_source_id` FK, `checked_at` | `(place_id,feature_code)` 인덱스. 검증된 특징은 근거 FK 필수, 미확인은 `unknown` |
| `collection_runs` | `id` PK, `source_type`, `started_at`, `finished_at`, `status`, `candidate_count`, `error_summary` | `(source_type,started_at)` 인덱스. 수집 실행의 성공·실패·검토 수를 추적 |

## 정합성·상태 정책

- 외부 ID의 유일성과 장소 FK로 중복을 제어한다. 같은 주소·좌표 후보는 자동 게시하지 않고 사람이 확인한다.
- `published`만 공개 API에 노출한다. `reported`는 재검토 대상으로, `unknown`은 확인된 사실처럼 설명하지 않는다.
- 폐업 정보가 확인되면 `closed`, 오류·권한 문제는 `hidden`으로 전환한다. 기록 보존·삭제 요구는 데이터 정책에 따라 처리한다.
- 근거의 원문 저장 여부는 출처별 권한으로 결정한다. URL만 보관해도 권리·개인정보 문제가 없는지 확인한다.
- 좌표는 공식/허용 소스와 현장 확인으로 검증한다. 임의 좌표를 채우지 않는다.
- Alembic 첫 마이그레이션에서 확장 설치 권한, CHECK/ENUM, FK 삭제 동작, 공간 인덱스와 검색 성능을 함께 검증한다.
