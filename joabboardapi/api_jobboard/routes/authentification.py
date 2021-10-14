import pymysql
from flask import jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, MySql



@app.route('/api/register', methods=['POST'])
def add_user():
    try:
        connection = MySql.connect()
        cursor = connection.cursor()
        myform = request.get_json()
        nom = myform['nom']
        prenom = myform['prenom']
        mail = myform['mail']
        mdp = myform['mdp']
        role = myform['role']
        tel = myform['tel']
        hash_mdp = generate_password_hash(mdp)
        cursor.execute("SELECT mail FROM users WHERE mail = %s", (mail))
        num = cursor.fetchone()
        if num == None:
            SQL_Query = "INSERT INTO `users`(`nom`, `prenom`, `mail`, `mdp`, `role`, `tel`) VALUES (%s,%s,%s,%s,%s,%s)"
            cursor.execute(SQL_Query, (nom, prenom, mail, hash_mdp, role, tel))
        else:
            print('Email déjà utilisé')
    except Exception as e:
        print(e, " error")
        response = jsonify('Failed to add user.')
    finally:
        idUser = cursor.lastrowid
        if role == 1:
            print("id", idUser)
            nomEntreprise = myform['nomEntreprise']
            secteur = myform['secteur']
            ville = myform['ville']
            description = myform['description']
            siteweb = myform['site_web']
            queryEntreprise = "INSERT INTO `companies`(`nom`, `secteur`, `ville`, `description`, `site_web`, `idUser`) VALUES (%s,%s,%s,%s,%s,%s)"
            cursor.execute(queryEntreprise, (nomEntreprise, secteur, ville, description, siteweb, idUser))
        connection.commit()
        cursor.close()
        connection.close()
        return jsonify(id = idUser, role= role)


@app.route('/api/login', methods=['POST'])
def login():
    myForm = request.get_json()
    _email = myForm['mail']
    _password = myForm['mdp']
    # validate the received values
    if _email and _password and request.method == 'POST':
        # check user exists
        conn = MySql.connect()
        cursor = conn.cursor()
        sql = "SELECT id, role, mdp FROM users WHERE mail=%s"
        sql_where = (_email,)
        cursor.execute(sql, sql_where)
        row = cursor.fetchone()
        if row:
            if check_password_hash(row[2], _password):
                cursor.close()
                conn.close()
                return jsonify(id=row[0], role=row[1])
            """else:
                return jsonify('Mot de passe incorrect')"""
        else:
            return jsonify('Mot de passe ou Email incorrect')
    """connection = MySql.connect()
    cursor = connection.cursor()
    myform = request.get_json()
    mail = myform['mail']
    mdp = myform['mdp']
    print(mail)
    data = cursor.execute('SELECT *  FROM users WHERE mail = % s', mail)
    hash_mdp = generate_password_hash(mdp)
    if check_password_hash(hash_mdp, mdp):
        print(data)
        return jsonify(data)
    else:
        print("erreur mdp")
        return jsonify('Mot de passe / Email incorrecte')"""
