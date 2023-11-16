from functools import lru_cache
import os
from typing import Union

os.environ["CUVIS"] = "/lib/cuvis"

from config import CONFIG

import numpy as np
import cuvis
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import tempfile

from utils.cuvis_settings import *

from schemas.CuvisImageDataRequest import CuvisImageDataRequest
from schemas.CuvisSpectraRequest import CuvisSpectraRequest
from schemas.CuvisSpectraResponse import CuvisSpectraResponse
from schemas.CuvisMetaDataResponse import CuvisMetaDataResponse
from schemas.CuvisFileListResponse import CuvisFileListResponse
from schemas.PluginViewResponse import PluginViewResponse

app = FastAPI()

@lru_cache(maxsize=32)
def get_measurement(file_name: str, session_id: str) -> tuple[cuvis.Measurement, cuvis.SessionFile]:
    file_path: str = f"{CONFIG['data_path']}/{file_name}"
    session: cuvis.SessionFile = None
    mesu: cuvis.Measurement = None
    
    if file_name.endswith('cu3s'):
        session = cuvis.SessionFile(file_path)
        mesu = session.getMeasurement(int(session_id))
    else:
        mesu = cuvis.Measurement(file_path)
    return mesu, session

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/files")
def get_spectral_files() -> CuvisFileListResponse:
    return CuvisFileListResponse(
        files=sorted([file for file in os.listdir(CONFIG["data_path"]) if file.lower().endswith(('cu3', 'cu3s'))])
    )

@app.get("/files/{file_name}/attributes")
def get_spectral_attributes(file_name: str) -> dict:
    mesu, session = get_measurement(file_name)
    return get_measurement_attributes(mesu)


@app.get("/files/{file_name}/{session_id}/metadata")
def get_metadata(file_name: str, session_id: str) -> CuvisMetaDataResponse:
    mesu, session = get_measurement(file_name, session_id)

    return CuvisMetaDataResponse(
        name = mesu.Name,
        productName = mesu.ProductName,
        integrationTime = str(mesu.IntegrationTime),
        processingMode = mesu.ProcessingMode,
        captureTime = f"{mesu.CaptureTime.strftime('%Y-%m-%d')}",
        wavelengths = mesu.Data["cube"].wavelength,
        isSession = file_name.endswith('cu3s'),
        sessionLength = session.getSize() if session is not None else 1
    )


@app.post("/files/{file_name}/{session_id}/image")
def get_spectra_image(file_name: str, session_id: str, request: CuvisImageDataRequest) -> FileResponse:
    mesu, session = get_measurement(file_name, session_id)
    
    if request.channels is not None:
        channels: list[int] = [index for index, value in enumerate(mesu.Data["cube"].wavelength) if value in request.channels]
        
        img: Image = raster_data_to_image(mesu.Data["cube"].array[:,:,channels[:3]])
        
        # Save the image to a temporary file
        with tempfile.NamedTemporaryFile(delete=False) as temp_file:
            img.save(temp_file, format='JPEG')
            temp_file.seek(0)

            return FileResponse(temp_file.name, media_type="image/jpeg")
    else:
        config_name: Union[str, None]  = get_configuration_name(get_user_plugin(request.processingMode, request.plugin))
        
        file_name = file_name.split('.')[0]
        
        userplugin = get_user_plugin(request.processingMode, request.plugin)

        export_path: str = os.path.join(CONFIG["data_path"], "export")

        view_export_settings = cuvis.ViewExportSettings(ExportDir=export_path, Userplugin=userplugin)
        tiff_iamge_path = os.path.join(export_path, f"{mesu.Name}_{config_name}.tiff")
        jpeg_image_path = os.path.join(export_path, f"{mesu.Name}_{config_name}.jpeg")

        viewExporter = cuvis.ViewExporter(view_export_settings)
        viewExporter.apply(mesu)
        
        tiff_to_jpeg(tiff_iamge_path, jpeg_image_path)
        
        return FileResponse(jpeg_image_path, media_type="image/jpeg")


@app.post("/files/{file_name}/{session_id}/spectra")
def get_spectra_data(file_name: str, session_id: str, request: CuvisSpectraRequest) -> CuvisSpectraResponse:
    mesu, session = get_measurement(file_name, session_id)
    
    return CuvisSpectraResponse(
        x = request.x,
        y = request.y,
        radius=request.radius,
        averageSpectra = average_spectra(
            data=mesu.Data["cube"].array[:,:,:],
            radius=request.radius,
            x=request.y,
            y=request.x
        ),
        wavelengths = mesu.Data["cube"].wavelength,
    )

@app.get("/views/{processing_mode}")
def get_processing_plugin_views(processing_mode: str) -> list[PluginViewResponse]:
    result_plugin_views = []
    
    processing_mode_mapper = {
        "Reflectance": "ref",
        "SpectralRadiance": "sprad",
        "Raw": "raw",
        "DarkSubtract": "ds"
    }
    
    # Iterate over all files in the directory
    for filename in os.listdir(os.path.join(CONFIG["plugin_path"], processing_mode_mapper[processing_mode])):
        if filename.endswith(".xml"):
            # Parse the XML file and get the "name" attribute
            name_attribute = get_configuration_name(get_user_plugin(processing_mode, filename))

            # Add the result to the dictionary
            if name_attribute is not None:
                result_plugin_views.append(PluginViewResponse(name=name_attribute, key=filename))
                
    return result_plugin_views

@app.get("/files/{file_name}/download")
def download_file(file_name: str) -> FileResponse:
    return FileResponse(f"{CONFIG['data_path']}/{file_name}")
