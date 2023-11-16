#!/bin/bash

cd /app/client
echo "Starting React server on port 3000..."
serve -s build -l 3000 &
react_app_pid=$!

#cd /app
#echo "Starting Jupyter Lab server on port 8888..."
#jupyter lab --ip=0.0.0.0 --allow-root --no-browser &
#jupyter_pid=$!

cd /app/app
echo "Starting FastAPI development server on port 8000..."
uvicorn app:app --host 0.0.0.0 --port 8000 --reload &
fastapi_pid=$!

echo "Starting the cron daemon..."
cron -f
cron_pd=$!

# Wait for all services to finish
wait $react_app_pid
wait $fastapi_pid
wait $cron_pd
#wait $jupyter_pid