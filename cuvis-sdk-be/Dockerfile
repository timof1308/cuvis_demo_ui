FROM ubuntu:20.04

# Set Environment Variables
ENV TZ=Europe/Berlin
ENV DEBIAN_FRONTEND=noninteractive

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

#RUN apt-get update and install packages
RUN apt-get update \
    && apt install -y git wget unzip curl git gcc cron gnupg2 libgl1 nodejs npm \
        libopencv*4.2 libxerces-c3.2 libspatialite7 libcrypto++6 libgps26 libtiffxx5 libboost-locale-dev

RUN apt install -y python3.9-full
RUN apt install -y python3-pip
RUN apt install -y ipython3
RUN python3.9 -m pip install --upgrade pip 
RUN python3.9 -m pip install --upgrade wheel setuptools

# donwlod cuvis sdk
WORKDIR /app/
RUN git clone https://github.com/cubert-hyperspectral/cuvis.sdk.git && cd cuvis.sdk && git checkout v3.2.0
RUN wget -c -t 10 -O cuvis_sdk.zip --no-check-certificate --content-disposition https://cloud.cubert-gmbh.de/index.php/s/kKVtx0x2fmYqVgx/download?path=%2FUbuntu%2020.04 && unzip cuvis_sdk -d libcuvis

# install cuvis software
RUN dpkg --install /app/libcuvis/Ubuntu\ 20.04/cuviscommon_3.2.0-1.deb \
    && apt-get -f install

RUN dpkg --install --force-overwrite /app/libcuvis/Ubuntu\ 20.04/libcuvis_3.2.0-1.deb \
    && apt-get -f install

RUN dpkg --install --force-overwrite /app/libcuvis/Ubuntu\ 20.04/libcuvisxx_3.2.0-1.deb \
    && apt-get -f install

RUN cp /app/libcuvis/Ubuntu\ 20.04/_cuvis_pyil.so /app/libcuvis/Ubuntu\ 20.04/cuvis_il.py /app/cuvis.sdk/Python/src

RUN python3.9 -m pip install --upgrade /app/cuvis.sdk/Python/src
RUN python3.9 -m pip install --upgrade classificator jupyterlab notebook==6.5.5 ipykernel ipywidgets jupyter_contrib_nbextensions pandas matplotlib nodejs fastapi pydantic uvicorn

WORKDIR /app/app
# Copy the backend application files into the container
COPY . .
# Copy the bash scripts into the container
COPY start.sh /app/start.sh
COPY crawl_data.sh /app/crawl_data.sh

# Schedule the script to run every day at 10 and 15 o'clock from Monday to Friday
RUN echo "0 10,15 * * 1-5 /app/crawl_data.sh > /dev/null 2>&1" | crontab -

RUN python3.9 -m ipykernel install --user

RUN cp /app/libcuvis/Ubuntu\ 20.04/_cuvis_pyil.so /app/libcuvis/Ubuntu\ 20.04/cuvis_il.py /usr/local/lib/python3.9/dist-packages/cuvis/

RUN jupyter contrib nbextension install --user

# application
WORKDIR /app

# Expose application ports
EXPOSE 8000
EXPOSE 8888

# application start setup
RUN chmod +x /app/start.sh
RUN chmod +x /app/crawl_data.sh

# Download sample data
RUN mkdir /app/data
RUN mkdir /app/data/sample_data
RUN /app/crawl_data.sh

# Set the entry point to run the FastAPI application
CMD ["/app/start.sh"]