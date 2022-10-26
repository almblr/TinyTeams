<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://stackedit.io/style.css" />
</head>

<body class="stackedit">
  <div class="stackedit__html"><h1 id="présentation">Présentation</h1>
<p><strong>Groupomania</strong> est un réseau social privé visant à améliorer les conditions de travail des employés de l’entreprise en leur proposant une plateforme où échanger.<br>
Il s’agit également d’un projet étudiant OpenClassrooms dans le cadre de la formation développeur web.</p>
<h1 id="comment-installer-groupomania">Comment installer Groupomania</h1>
<p>Attention, Groupomania fonctionne avec une base de données relationnelle utilisant le langage SQL. Dans le cadre de la soutenance, un fichier <strong>.sql</strong> étant la base de données avec un utilisateur disposant de droits administrateur, a été fournie dans les livrables.<br>
Pour importer ce fichier, il faut vous rendre dans votre terminal et saisir la commande suivante :</p>
<pre><code>mysql -u votre_username -p database_name &lt; file.sql
</code></pre>
<p><strong>database_name</strong> étant votre base de données actuelle, de préférence vide, tandis que <strong>file.sql</strong> est le nom du fichier à importer. Pour ce dernier, notez qu’il est préférable de renseigner le chemin complet.</p>
<p><em>Identifiants de l’utilisateur administrateur de Groupomania :</em><br>
email : <a href="mailto:admin@admin.com">admin@admin.com</a><br>
password : Admintest22*</p>
<p><strong>BACK</strong><br>
Depuis la racine du projet, exécutez la commande <code>cd back</code> suivie de <code>npm install</code> dans votre terminal. Une fois l’installation des packages faite, n’oubliez pas de renommer le fichier .env.example en <strong>.env</strong>. et de le remplir comme suit :</p>
<p>PASSWORD=“votre_valeur”<br>
TOKEN=“EJAZ1KL5MR45EJZM1RRE976JKLM”<br>
DB=“groupomania”<br>
USER_NAME=“votre_valeur”<br>
HOST=“votre_valeur”<br>
ADMINPASSWORD=“Admintest22*”</p>
<p>Une fois cela fait, vous pourrez exécuter la commande <code>npm run dev</code>.</p>
<p><strong>FRONT</strong><br>
Retournez à la racine du projet et exécutez la commande <code>cd front</code> suivie de <code>npm install</code>.<br>
Une fois les packages installés, vous pourrez exécuter la commande <code>npm run dev</code> et vous rendre sur le lien généré dans votre console.</p>
<h1 id="fonctionnalités-disponibles">Fonctionnalités disponibles</h1>
<p>Il est possible de :</p>
<ul>
<li>créer un compte</li>
<li>se connecter</li>
<li>créer un post contenant soit du texte, soit une image ou bien les deux</li>
<li>consulter tous les posts créés</li>
<li>modifier un post que avez créé pour changer ou retirer son texte (si celui-ci possède une image)</li>
<li>supprimer un post que vous avez créé</li>
<li>modifier et supprimer n’importe quel post si vous êtes administrateur</li>
<li>réagir à un post en cliquant sur l’emoji ❤ (appuyer à nouveau retire votre réaction)</li>
<li>consulter le nombre de like total d’un post</li>
<li>se déconnecter</li>
</ul>
</div>
</body>

</html>
