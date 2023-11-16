from pydantic import BaseModel

class CuvisFileListResponse(BaseModel):
    files: list[str] = []