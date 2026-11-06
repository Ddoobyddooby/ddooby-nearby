from fastapi.testclient import TestClient

from app.main import app


def test_health() -> None:
    response = TestClient(app).get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "app": "ddooby-nearby",
        "environment": "development",
    }


def test_development_cors() -> None:
    response = TestClient(app).get(
        "/api/v1/health", headers={"Origin": "http://127.0.0.1:5173"}
    )
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:5173"
