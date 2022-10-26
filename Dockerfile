FROM python:3.9.10
WORKDIR .
COPY . .
RUN pip3 install -r utils/requirments.txt
EXPOSE 3000
CMD python3 app.py 