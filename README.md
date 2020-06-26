# Slot Booking System
A simple Django React app to manage slot booking more effectively

## Table of Contents

* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Built With](#built-with)
* [Authors](#authors)
* [License](#license)


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

#### 1. Database Configuration
- Configure a postgres database before running the backend
- Navigate to `./backend/djreact_sbs/`
- Open *settings.py* file
- Replace the 'default' database settings in the python "DATABASES" dict with your server configuration. **NOTE:** If database is configured with the postgress default arguments only "NAME" and "PASSWORD" will have to be changed. Make sure that everything is enclosed in " " or ' ' as shown below
```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'yourdatabasename',
        'USER': 'postgres',
        'PASSWORD': 'yourpassword',
        'HOST': '127.0.0.1',
        'PORT':'5432',
    }
}
```

- Replace the default SMTP credentials with your credentials for a working OTP system.
**NOTE**: Make sure that everything is enclosed in " " or ' ' as shown below
```
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'emailhostaddress' #'smtp.gmail.com' for gmail
EMAIL_PORT = portnumber #587 for gmail
EMAIL_HOST_USER = 'email@address.com'
EMAIL_HOST_PASSWORD = 'password'
EMAIL_USE_TLS = True
EMAIL_USE_SSL = False
```


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
* [ReactJS](https://reactjs.org/)
* [Django](https://www.djangoproject.com/) and [Django Rest Framework](https://www.django-rest-framework.org/)

## Authors
* [**Jaimik Patel**](https://github.com/just-a-rookie-2001)
* **Moksh Doshi**

## License
This project is licensed under the MIT License - see the [LICENSE.md](/LICENSE.md) file for details
