# filmilox-code



## Getting started using Docker

To get started, you need to install [Docker](https://docs.docker.com/get-docker/) or have it installed already.  

### Clone the repo to a directory of your choice.
```
git clone https://git.oth-aw.de/filmilox/filmilox-code.git
``` 

### Automatically set up the Docker environment for local development using Docker Compose
Navigate to the directory you cloned the repo to:  
```
cd filmilox-code
```  
Run docker-compose up to start the Docker development environment:  
```
docker-compose up -d
```

Open your browser of choice and navigate to http://localhost:3000/ to see the frontend in action.  

Please note that you can use the mongo-express instance that should be running at http://localhost:8081/ to inspect the database.

## Getting started without Docker

To get started without Docker, you need to install the [Node.js](https://nodejs.org/en/download/), [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) and [MongoDB](https://www.mongodb.com/docs/manual/installation/).  
Then clone the repo to a directory of your choice.  
```
git clone https://git.oth-aw.de/filmilox/filmilox-code.git
```  
After you have installed these required applications in your local environment and cloned the repo, you can start backend by running the following commands:
```
cd filmilox-code/sys-src/server
yarn install && yarn dev
```

Then navigate to the client directory to start the frontend, by running the following commands:
```
cd ../client 
yarn install && yarn dev
```
Open your browser of choice and navigate to http://localhost:3000/ to see the frontend in action.

## Running tests
### Testing the backend

To run the backend tests with coverage, navigate to the `sys-src/server` directory and run the following commands:
```
yarn install
yarn test
```
Note that this requires you to have Node.js and Yarn installed. If you don't have these installed and are using our 
docker-compose environment, you can run `yarn test` in the backend docker container.
```
docker exec -it filmilox-server yarn test
```
### Testing the frontend

To run the frontend tests with coverage, navigate to the `sys-src/client` directory and run the following commands:
```
yarn install
yarn test --watchAll --coverage 
```
Note that this requires you to have Node.js and Yarn installed. If you don't have these installed and are using our
docker-compose environment, you can run `yarn test` in the frontend docker container.
```
docker exec -it filmilox-client yarn test --watchAll --coverage
```