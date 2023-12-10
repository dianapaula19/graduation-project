# Graduation Project

View a demo of the project [here](https://youtu.be/sEHrhPenFeI)

## Running the application locally

### Running the app in a container

Prerequisites: docker & docker Compose

1. Run ```$ docker-compose up```
2. Access the client app on port 3000 and the server app on port 8000

### Running the client and server app separately

Prerequisites: node (latest version), python (version 3) & virtualenv

Running the client app

1. Switch to the frontend directory ```$ cd frontend```
2. Switch to the frontend directory and run ```$ npm install``` (you are only required to do this when running the application for the first time)
3. Run ```$ npm run start```

Running the server app

1. Switch to the backend directory ```$ cd backend```
2. Create a new virtual environment ```$ virtualenv venv```
3. Activate the virtual environment ```$ source venv/bin/activate```
4. Run ```pip install -r requirements.txt```
5. Run ```python3 manage.py runserver```

