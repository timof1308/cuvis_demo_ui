from pydantic import BaseModel


class CuvisMetaDataResponse(BaseModel):
    name: str = ""
    productName: str = ""
    integrationTime: str = ""
    processingMode: str = ""
    captureTime: str = ""
    wavelengths: list[int] = []
    isSession: bool = False
    sessionLength: int = 0
