from typing import Union
from pydantic import BaseModel
from pydantic import Field


class CuvisImageDataRequest(BaseModel):
    channels: Union[list[int], None] = Field(default=None, description='choose up to 3 channels')
    processingMode: Union[str, None] = Field(default='Reflectance', description='Reflectance, SpectralRadiance, Raw, DarkSubtract')
    plugin: Union[str, None] = Field(default=None, description='cuvis (user-)plugin to use')
