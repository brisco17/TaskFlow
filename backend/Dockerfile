# pull official base image
FROM python:3.9.6-alpine

# set environment variables
ENV PYTHONUNBUFFERED=1
ENV DEBUG 0
WORKDIR /root

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev

# install dependencies
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .

#run app
CMD python manage.py runserver 0.0.0.0:$PORT
