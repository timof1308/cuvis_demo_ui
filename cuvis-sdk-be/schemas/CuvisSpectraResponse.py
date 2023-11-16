from pydantic import BaseModel


class CuvisSpectraResponse(BaseModel):
    x: int = 0
    y: int = 0
    radius: int = 1
    averageSpectra: list[float] = []
    wavelengths: list[int] = []
