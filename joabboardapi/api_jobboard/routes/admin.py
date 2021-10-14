import pymysql
from flask import jsonify

from app import app, MySql


@app.route('/api/admin/listjobseeker', methods=['GET'])
def list0UserForAdmin():
    try:
        connection = MySql.connect()
        Pointer = connection.cursor(pymysql.cursors.DictCursor)
        Pointer.execute("SELECT * FROM users WHERE role = 0")
        record = Pointer.fetchall()
        response = jsonify(record)
        return response
    except Exception as e:
        print(e)
    finally:
        Pointer.close()
        connection.close()

@app.route('/api/admin/listcompanyuser', methods=['GET'])
def listcompanyuser():
    try:
        connection =MySql.connect()
        Pointer = connection.cursor()
        Pointer.execute("SELECT u.id, c.nom , c.secteur, c.ville, c.description, c.site_web, u.nom AS representant_nom, u.prenom AS representant_prenom, u.mail AS mail_entreprise, u.tel AS tel_enterprise FROM companies as c, users as u WHERE u.id = c.idUser")
        record = Pointer.fetchall()
        response = jsonify(record)
        return response
    except Exception as e:
        print(e)
    finally:
        Pointer.close()
        connection.close()

@app.route('/api/admin/user/delete/<int:id>', methods=['DELETE'])
def deleteUserFromAdmin(id):
    try:
        connection = MySql.connect()
        Pointer = connection.cursor(pymysql.cursors.DictCursor)
        Pointer.execute("SELECT * FROM users WHERE id=%s", id)
        record = Pointer.fetchone()
        response = jsonify(record)
        response.status_code = 200
    except Exception as e:
        print(e)
    finally:
        if record['role'] == 0:
            Pointer.execute("DELETE FROM job_application WHERE idUtilisateur=%s", id)
            connection.commit()
            Pointer.execute("DELETE FROM users WHERE id=%s", id)
            connection.commit()
            msg = "Utilisateur supprimé"
        elif record['role'] == 1:
            Pointer.execute("DELETE FROM job_application WHERE idOffreEmploi in (SELECT id FROM advertisements WHERE idUserCompany = %s)", id)
            connection.commit()
            Pointer.execute("DELETE FROM advertisements WHERE idUserCompany = %s", id)
            Pointer.execute("DELETE FROM companies WHERE idUser=%s", id)
            connection.commit()
            Pointer.execute("DELETE FROM users WHERE id=%s", id)
            connection.commit()
            msg = "Utilisateur et entreprise supprimé"
        return jsonify(msg)
        Pointer.close()
        connection.close()

@app.route('/api/admin/ad/delete/<int:id>', methods=['DELETE'])
def deleteAdFromAdmin(id):
    try:
        connection = MySql.connect()
        Pointer = connection.cursor(pymysql.cursors.DictCursor)
        Pointer.execute("DELETE FROM job_application WHERE idOffreEmploi = %s", id)
        connection.commit()
        Pointer.execute("DELETE FROM advertisements WHERE id=%s", id)
        connection.commit()
        msg = "annonce supprimé"
    except Exception as e:
        print(e)
    finally:
        return jsonify(msg)
        Pointer.close()
        connection.close()

@app.route('/api/admin/joblist', methods=['GET'])
def getlistjob():
    try:
        connection = MySql.connect()
        pointer = connection.cursor()
        pointer.execute("SELECT * FROM `advertisements`")
        result = pointer.fetchall()
    except Exception as e:
        print(e)
    finally:
        return jsonify(result)
        pointer.close()
        connection.close()