from pydantic import BaseModel


class CuvisSpectraRequest(BaseModel):
    x: int = 0
    y: int = 0
    radius: int = 1
