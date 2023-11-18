import os
from typing import Union
from config import CONFIG
import numpy as np
from PIL import Image
import xml.etree.ElementTree as ET

os.environ["CUVIS"] = "/lib/cuvis"
import cuvis

cuvis_settings = cuvis.General(CONFIG["settings_path"])
cuvis_settings.setLogLevel("info")

def get_user_plugin(processing_mode: str, plugin_name: str) -> str:
    processing_mode_mapper = {
        "Reflectance": "ref",
        "SpectralRadiance": "sprad",
        "Raw": "raw",
        "DarkSubtract": "ds"
    }

    with open(f"{CONFIG['plugin_path']}/{processing_mode_mapper[processing_mode]}/{plugin_name}") as f:
        user_plugin: list[str] = f.readlines()
    return "".join(user_plugin)

def get_measurement_attributes(mesu: cuvis.Measurement) -> dict:
    attributes: dict = {}
    for attribute in dir(mesu):
        if type(getattr(mesu, attribute)).__name__ not in ['builtin_function_or_method', 'method'] and '__' not in attribute:
            attributes[attribute] = f"{getattr(mesu, attribute)}"
            
    return attributes

def average_spectra(data: list[list[int]], radius: int, x: int, y: int) -> np.array:
    min_x = x-radius if x-radius > 0 else 0
    min_y = y-radius if y-radius > 0 else 0
    sample = data[min_x:x+radius,min_y:y+radius,:]
    sample = sample.reshape(sample.shape[0]*sample.shape[1],sample.shape[2])
    return (np.mean(sample,axis=0) / 10_000) * 100  # 10.000 == 100%

def raster_data_to_image(raster_data: list[list[int]]) -> Image:
    # Get the number of dimensions in the input array
    num_dims = raster_data.shape[-1]

    # Determine the amount of padding needed
    pad_width = [(0, 0), (0, 0), (0, 0)]  # Padding for all three dimensions
    if num_dims < 3:
        pad_width[2] = (0, 3 - num_dims)  # Pad the third dimension if needed

    # Pad the array with zeros
    padded_arr = np.pad(raster_data, pad_width, mode='constant')
    data_rgb = np.array(np.clip(padded_arr / 10000, 0, 1) * 255).astype(np.uint8)

    # Create and return the PIL.Image
    return Image.fromarray(data_rgb)

def get_configuration_name(user_plugin: str) -> Union[str, None]:
    # Parse the XML string
    root = ET.fromstring(user_plugin)
    # Define the XML namespace
    namespace = {'ns': 'http://cubert-gmbh.de/user/plugin/userplugin.xsd'}
    # Access the "configuration name"
    return root.find('ns:configuration', namespace).get('name')

def tiff_to_jpeg(input_tiff_path: str, output_jpeg_path: str):
    # Open the TIFF image
    tiff_image = Image.open(input_tiff_path)

    # Convert to RGB if the image is not already in RGB mode
    if tiff_image.mode != 'RGB':
        tiff_image = tiff_image.convert('RGB')

    # Save as JPEG
    tiff_image.save(output_jpeg_path, 'JPEG')

def create_equal_bins(start, end, num_bins):
    bins_array = np.linspace(start, end, num_bins)
    return bins_array.astype(int)