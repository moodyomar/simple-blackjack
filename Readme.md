## Backed - Python (flask)

### Running the app on machine 

#### init python3 virtual enviroment

`python3 -m venv venv`

#### activate virtual enviroment on mac/linux

`source venv/bin/active`

#### install requirments using pip

`pip3 install -r ./utils/requirments.txt`

#### deactivate virtual enviroment on mac/linux

`deactivate`


### Running app on container

#### need docker installed on local machine

`docker run -d -p 3000:3000 blackjack-py`



## Frontend - Javascript (react)

### Running app on machine 

#### install dependinces/node modules 

`npm install`

#### starting the application

`npm start`

### Running app on container

#### need docker installed on local machine
##### run this inside the /client directory
`docker run -d -p 3000:3000 blackjack-py`



## Running backend & frontend with docker-compose

#### need docker-compose installed on local machine
`docker-compose up -d`
