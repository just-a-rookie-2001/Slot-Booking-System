# Slot Booking System

![Slots](/screenshots/slots.jpeg)
A simple Django React app to manage slot booking more effectively

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Built With](#built-with)
- [Authors](#authors)
- [License](#license)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. To deploy this type of app in production see this [video](https://www.youtube.com/watch?v=r0ECufCyyyw)

### Prerequisites

- [Python](https://www.python.org/downloads/)
- [NodeJS](https://nodejs.org/en/download/)
- [PostgreSQL](https://www.postgresql.org/download/)

### Installation

Download this repository or clone it using git

```
git clone https://github.com/just-a-rookie-2001/Slot-Booking-System
```

Navigate into the repository

```
cd Slot-Booking-System
```

#### 1. Database and SMTP server Configuration

- Configure a postgres database before running the backend
- Navigate to `./backend`
- Create a new **.env** file of the following format

```
# Django Configuration
export SECRET_KEY = "django secret key"


# Postgres Server Configuration (For database)
export NAME = "your database name"
export PASSWORD = "your database password"


# SMTP Server Configuration (For gmail)
export EMAIL_HOST_USER = "youremail@gmail.com"
export EMAIL_HOST_PASSWORD = "your email password"
```

- Replace the details with your system credentials. **NOTE**: Make sure that everything is enclosed in " " or ' ' as shown above
- To change other settings open `./djreact_sbs/settings.py`

#### 2. Backend Configuration

```
pip install pipenv
```

Then navigate to backend directory and launch virtual environment

```
cd backend
pipenv shell
```

Finally

```
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

#### 3. Frontend Configuration

Navigate to the frontend directory and install packages

```
cd frontend
npm install
```

Finally start the server

```
npm start
```

## Built With

- [ReactJS](https://reactjs.org/)
- [Django](https://www.djangoproject.com/) and [Django Rest Framework](https://www.django-rest-framework.org/)

## Authors

- [**Jaimik Patel**](https://github.com/just-a-rookie-2001)
- [**Moksh Doshi**](https://github.com/mokshdoshi007)

## License

This project is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details
