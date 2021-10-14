from flask import jsonify, request
from sqlalchemy.dialects.mysql import pymysql

from app import app, MySql

@app.route('/api/company/get/<int:id>', methods=['GET'])
def get_company_user(id):
    try:
        connection =MySql.connect()
        Pointer = connection.cursor()
        Pointer.execute("SELECT * FROM companies WHERE idUser=%s", id)
        record = Pointer.fetchone()
        return jsonify(record)
    except Exception as e:
        print(e)
    finally:
        Pointer.close()
        connection.close()


@app.route('/api/company/update/<int:id>', methods=['POST'])
def update_company_user(id):
    try:
        myForm = request.get_json()
        nom = myForm['nom']
        secteur = myForm['secteur']
        ville = myForm['ville']
        description = myForm['description']
        site_web = myForm['site_web']
        connection =MySql.connect()
        Pointer = connection.cursor()
        sql ="UPDATE `companies` SET `nom`= %s,`secteur`= %s,`ville`= %s,`description`= %s,`site_web`= %s WHERE idUser= %s"
        data = (nom, secteur, ville, description, site_web, id)
        Pointer.execute(sql, data)
        connection.commit()
    except Exception as e:
        print(e)
    finally:
        return jsonify('Informations entreprise modifiées')
        Pointer.close()
        connection.close()