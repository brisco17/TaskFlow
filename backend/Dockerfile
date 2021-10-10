# syntax=docker/dockerfile:1
FROM python:3.8-alpine
ENV PYTHONUNBUFFERED=1
WORKDIR /root

RUN apk update \
    && apk add postgresql-dev gcc python3-dev musl-dev libffi-dev
    
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .