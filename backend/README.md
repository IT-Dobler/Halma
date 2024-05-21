# Tutorials for the learners: 
- https://www.moesif.com/blog/technical/api-development/Django-REST-API-Tutorial/
- https://blog.logrocket.com/django-rest-framework-create-api/
- https://learndjango.com/tutorials/official-django-rest-framework-tutorial-beginners

Big brain websockets tutorial
- https://channels.readthedocs.io/en/latest/tutorial/part_2.html

Lets do this: https://stackoverflow.com/questions/9586346/virtualenv-and-source-version-control



# Setup

Create a virtual env
```shell
python -m venv myenv
```

Activate your virtual env
```shell
./venv/Scripts/activate
```

Install dependencies 
```shell
pip install -r requirements.txt
```

Run the migrations
```shell
python manage.py migrate
```

Start the application
```shell
python manage.py runserver
```

For the realtime gameplay, start the redis db like so:
```shell
docker run --rm -p 6379:6379 redis:7
```

After installing a new dependency
```shell
pip freeze > requirements.txt
```

Reset migrations
```shell
python manage.py migrate your_app zero
```

Followed by the usual
```shell
python manage.py makemigrations your_app
python manage.py migrate your_app
```
