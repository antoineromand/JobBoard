import pymysql
from flask import request, jsonify
from app import app, MySql


@app.route('/api/job/add/<int:idUser>', methods=['POST'])
def addAd(idUser):
    try:
        connection = MySql.connect()
        cursor = connection.cursor()
        myAd = request.get_json()
        poste = myAd['poste']
        type_emploi = myAd['type_emploi']
        secteur_activite = myAd['secteur_activite']
        ville = myAd['ville']
        salaire = myAd['salaire']
        description = myAd['description']
        entreprise = myAd['entreprise']
        idUserEntreprise = idUser
        sql = "INSERT INTO `advertisements`( `poste`, `type_emploi`, `secteur_activite`, `ville`, `salaire`, `description`, `entreprise`, `idUserCompany`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
        cursor.execute(sql, (poste, type_emploi, secteur_activite, ville, salaire, description, entreprise, idUserEntreprise))
        connection.commit()
        response = 'Annonce ajouté !'
    except Exception as e:
        print(e)
        response = 'Erreur'
    finally:
        return jsonify(response)
        cursor.close()
        connection.close()

@app.route('/api/job/delete/<int:idUser>/<int:id>', methods=['DELETE'])
def deleteAdFromOwner(id, idUser):
    try:
        connection = MySql.connect()
        Pointer = connection.cursor(pymysql.cursors.DictCursor)
        Pointer.execute("DELETE FROM job_application WHERE idOffreEmploi=%s", (id))
        Pointer.execute("DELETE FROM advertisements WHERE id=%s and idUserCompany = %s", (id,idUser))
        connection.commit()
        msg = "annonce supprimé par son auteur"
    except Exception as e:
        print(e)
    finally:
        return jsonify(msg)
        Pointer.close()
        connection.close()

@app.route('/api/job/update/<int:idUser>/<int:id>', methods=['POST'])
def updateAdFromOwner(id, idUser):
    try:
        myForm = request.get_json()
        poste = myForm['poste']
        type_emploi = myForm['type_emploi']
        secteur_activite = myForm['secteur_activite']
        ville = myForm['ville']
        salaire = myForm['salaire']
        description = myForm['description']
        connection =MySql.connect()
        Pointer = connection.cursor()
        sql ="UPDATE `advertisements` SET `poste`=%s,`type_emploi`=%s,`secteur_activite`= %s,`ville`=%s,`salaire`= %s,`description`= %s WHERE id = %s and `idUserCompany`= %s"
        data = (poste, type_emploi,secteur_activite, ville, salaire, description, id, idUser)
        Pointer.execute(sql, data)
        connection.commit()
    except Exception as e:
        print(e)
    finally:
        return jsonify('Annonce n~' + str(id) + ' modifiées')
        Pointer.close()
        connection.close()

@app.route('/api/job/getall/<int:idUser>', methods=['GET'])
def listAllAdbyOwner(idUser):
    try:
        connection = MySql.connect()
        Pointer = connection.cursor()
        sql = "SELECT * FROM `advertisements` WHERE idUserCompany = %s"
        Pointer.execute(sql, idUser)
        result = Pointer.fetchall()
        connection.commit()
    except Exception as e:
        print(e)
    finally:
        return jsonify(result)

@app.route('/api/job/count/<int:id>', methods=['GET'])
def countCandidatsPerAd(id):
    try:
        connection = MySql.connect()
        Pointer = connection.cursor()
        Pointer.execute("SELECT COUNT(*) FROM job_application WHERE idOffreEmploi = %s", id)
        resultat = Pointer.fetchone()
        connection.commit()
    except Exception as e:
        print(e)
    finally:
        return jsonify(resultat)
        Pointer.close()
        connection.close()

@app.route('/api/job/list', methods=['GET'])
def getlistJob():
    try:
        connection = MySql.connect()
        pointer = connection.cursor()
        pointer.execute("SELECT * FROM `advertisements` ORDER BY date_ajout DESC")
        result = pointer.fetchall()
    except Exception as e:
        print(e)
    finally:
        return jsonify(result)
        pointer.close()
        connection.close()

@app.route('/api/job/candidats/<int:id>', methods=['GET'])
def getCandidatByAd(id):
    try:
        connection = MySql.connect()
        pointer = connection.cursor()
        sql = "SELECT users.nom, users.prenom, users.tel, users.mail, job_application.message, job_application.date_postule FROM `job_application`, `users`, `advertisements` WHERE job_application.idUtilisateur = users.id AND job_application.idOffreEmploi = advertisements.id AND job_application.idOffreEmploi = %s"
        pointer.execute(sql, id)
        res = pointer.fetchall()
        return jsonify(res)
    except Exception as e:
        print(e)
    finally:
        pointer.close()
        connection.close()


