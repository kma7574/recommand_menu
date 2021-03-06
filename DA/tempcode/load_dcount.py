import csv
from DeliverCount import DeliverCount
from Patient import Patient
from datetime import datetime
from db_connect import db

def put_data():
    with open('seoul_deliver_count.csv', encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)
        for row in reader:
            _date = datetime.strptime(row['date'], '%Y-%m-%d').date()
            delivery_count = DeliverCount(
                date=_date, gu=row['gu'], dong=row['dong'], delivery_count=int(row['deliver_count'])
            )
            db.session.add(delivery_count)
        db.session.commit()

    with open('seoul_patient_count.csv', encoding="utf-8-sig") as file:
        reader = csv.DictReader(file)
        for row in reader:
            _date = datetime.strptime(row['date'], '%Y-%m-%d').date()
            patient_count = Patient(
                date=_date, gu=row['gu'], patient_count=int(row['patient_count'])
            )
            db.session.add(patient_count)
        db.session.commit()
