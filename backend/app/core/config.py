from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    app_name: str = "ddooby-nearby"
    app_env: str = "development"
    log_level: str = "INFO"
    database_url: str = "postgresql+psycopg://nearby:nearby@localhost:5432/nearby"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    use_mock_data: bool = True
    default_region: str = "dasan-jigeum"
    default_search_radius_m: int = 2000

    @property
    def cors_origin_list(self) -> list[str]:
        return [
            origin.strip() for origin in self.cors_origins.split(",") if origin.strip()
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
