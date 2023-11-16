from pydantic import BaseModel


class PluginViewResponse(BaseModel):
    name: str
    key: str
