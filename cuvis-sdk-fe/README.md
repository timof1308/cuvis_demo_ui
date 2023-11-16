# CUVIS SDK Viewer

- Ant Design UI Library: [LINK](https://ant.design/)
- Ant Design Chart Library: [LINK](https://charts.ant.design/)

## Development
1. Set the NODE_OPTIONS using `export NODE_OPTIONS=--openssl-legacy-provider`
2. Install packages using `npm install --legacy-peer-deps`
3. Run this command in one terminal to comile the scss styles: `npm run compile-scss`
4. At the same time run this command to run the React application: `npm start`

## Deployment
Build and start the Docker container using 
- `docker build -t cuvis-client .`
- `docker run --name cuvis-client -d --expose=3000 cuvis-client`
