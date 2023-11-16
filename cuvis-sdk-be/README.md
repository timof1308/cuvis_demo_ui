# CUVIS SDK API

You have to serve this FastAPI application in a docker container as this requires the CUVIS software and the CUVIS SDK installed:

- `docker build -t cuvis-app .`
- `docker run --name cuvis-app -d --expose=8000 cuvis-app`

The Docker Container exposes the port 8000

For development purposes you can add a `uvicorn app:app --host 0.0.0.0 --port 8000 --reload` to the [`start.sh`](./start.sh) script. This will ensure to reload the Fast API application on file changes.
The sync the files with your Docker Container run make sure to add the volume tag: `-v ./cuvis-sdk-be:/app/app/`

The API Documentation is available using [this link](http://localhost:8000/redoc)


