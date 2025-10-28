# e-claim (API + Client)

Monorepo contenant :
- `api-e-claim-2.0` — Symfony API (API Platform)
- `client-e-claim-2.0` — Angular client
- `docker-compose.yml` — configuration pour dev (MySQL, phpMyAdmin, API, client)

> NOTE : configuration et instructions orientées pour un environnement de développement (Windows + Docker Desktop).

## Ports exposés (par défaut)
- API (Symfony / Apache) : http://localhost:8000
- API Platform UI (Swagger) : http://localhost:8000/api
- Angular dev server : http://localhost:4200
- phpMyAdmin : http://localhost:8080
- MySQL container port : 3306 (exposé sur l'hôte 3307)

## Prérequis
- Docker Desktop (démon Docker démarré)
- Docker Compose v2 (commande `docker compose`)
- (Optionnel pour dev local sans Docker) PHP >= 8.1, Composer, Node 18, npm

## Lancement rapide (Docker, recommandé pour dev)
1. Depuis la racine du repo :
   ```
   docker compose up --build -d
   ```

2. Si le front a des problèmes de modules natifs (erreurs `lightningcss` / `rollup`), exécutez :
   ```
   # supprimez node_modules windows (optionnel)
   # puis installez les dépendances Linux à l'intérieur du conteneur (remplit le volume nommé)
   docker compose run --rm client npm ci --unsafe-perm
   docker compose up -d
   ```

3. Réinitialiser la BDD d'initialisation (exécute les scripts sous ./docker/mysql) :
   ```
   docker compose down -v
   docker compose up --build -d
   ```

## Accès
- API Platform (Swagger) : http://localhost:8000/api
- Angular dev : http://localhost:4200
- phpMyAdmin : http://localhost:8080
  - Exemple login : `root` / `root` ou `symfony` / `symfony` selon `docker-compose.yml` et initialisation.
- MySQL (depuis conteneur) :
  ```
  docker compose exec db mysql -uroot -proot -e "SHOW DATABASES;"
  ```

## Variables d'environnement utiles
Exemples (définies pour le service API dans `docker-compose.yml`):
```
DATABASE_URL='mysql://symfony:symfony@db:3306/e_claim'
CLAIM_USER_DATABASE_URL='mysql://symfony:symfony@db:3306/claim_user_db'
APP_ENV=dev
```

## Développement local sans Docker
API :
```
cd api-e-claim-2.0
composer install
cp .env.local.example .env.local   # adapter si nécessaire
# ajuster DATABASE_URL pour pointer sur votre MySQL
php bin/console doctrine:migrations:migrate
symfony serve # ou php -S 127.0.0.1:8000 -t public
```

Client :
```
cd client-e-claim-2.0
npm ci
npm run start -- --host 0.0.0.0
```

## Problèmes fréquents & résolutions
- PSR-4 / casse namespaces (Symfony DebugClassLoader errors)
  - Assurez-vous que les namespaces PHP correspondent exactement au mapping PSR‑4.
  - Régénérer l'autoload & vider cache :
    ```
    composer dump-autoload -o
    php bin/console cache:clear
    php bin/console cache:warmup
    ```
  - Sous Windows, pour renommer un dossier en changeant seulement la casse : renommez en un nom temporaire puis au nom final.

- Modules natifs (ex: `lightningcss`, `rollup` errors) dans Docker :
  - Ne montez pas les node_modules Windows dans le conteneur. Utilisez un volume nommé :
    ```yaml
    - ./client-e-claim-2.0:/app:delegated
    - client_node_modules:/app/node_modules
    ```
  - Recréez les modules Linux :
    ```
    docker compose run --rm client npm ci --unsafe-perm
    ```

- Port déjà utilisé (ex: 3306) :
  - Soit arrêter le service local occupant le port, soit changer le mapping hôte:container (ex. `3307:3306`) dans `docker-compose.yml`.

- Scripts d'initialisation MySQL :
  - Placez vos fichiers SQL dans `./docker/mysql/` ; Docker MySQL exécutera les scripts seulement à la création du volume DB. Si vous changez les scripts, supprimez le volume `db_data` (docker compose down -v) puis relancez.

## Structure principale
```
d:\e-claim-2.0
├─ api-e-claim-2.0/    # Symfony + API Platform
├─ client-e-claim-2.0/ # Angular client
└─ docker-compose.yml
```

## Commandes utiles
```
# rebuild et relancer tout
docker compose down -v
docker compose up --build -d

# logs
docker compose logs -f api client db phpmyadmin

# exécuter une commande dans un service
docker compose exec api bash
docker compose exec client bash
```

## Notes de sécurité / production
- Ne laissez jamais `MYSQL_ALLOW_EMPTY_PASSWORD` ni un compte `root` sans mot de passe en production.
- Configurez secrets et variables d'environnement en CI/CD ou via Docker secrets.
- Pour production, préférez PHP-FPM + nginx pour l'API et build statique pour le client servi par nginx.

---

Si vous voulez, je peux :
- Générer ce fichier README.md dans votre workspace.
- Adapter les instructions pour un autre mapping de ports / utilisateur DB.
- Ajouter exemples de commandes pour exécuter migrations/fixtures.// filepath: d:\e-claim-2.0\README.md

# e-claim (API + Client)

Monorepo contenant :
- `api-e-claim-2.0` — Symfony API (API Platform)
- `client-e-claim-2.0` — Angular client
- `docker-compose.yml` — configuration pour dev (MySQL, phpMyAdmin, API, client)

> NOTE : configuration et instructions orientées pour un environnement de développement (Windows + Docker Desktop).

## Ports exposés (par défaut)
- API (Symfony / Apache) : http://localhost:8000
- API Platform UI (Swagger) : http://localhost:8000/api
- Angular dev server : http://localhost:4200
- phpMyAdmin : http://localhost:8080
- MySQL container port : 3306 (exposé sur l'hôte 3307)

## Prérequis
- Docker Desktop (démon Docker démarré)
- Docker Compose v2 (commande `docker compose`)
- (Optionnel pour dev local sans Docker) PHP >= 8.1, Composer, Node 18, npm

## Lancement rapide (Docker, recommandé pour dev)
1. Depuis la racine du repo :
   ```
   docker compose up --build -d
   ```

2. Si le front a des problèmes de modules natifs (erreurs `lightningcss` / `rollup`), exécutez :
   ```
   # supprimez node_modules windows (optionnel)
   # puis installez les dépendances Linux à l'intérieur du conteneur (remplit le volume nommé)
   docker compose run --rm client npm ci --unsafe-perm
   docker compose up -d
   ```

3. Réinitialiser la BDD d'initialisation (exécute les scripts sous ./docker/mysql) :
   ```
   docker compose down -v
   docker compose up --build -d
   ```

## Accès
- API Platform (Swagger) : http://localhost:8000/api
- Angular dev : http://localhost:4200
- phpMyAdmin : http://localhost:8080
  - Exemple login : `root` / `root` ou `symfony` / `symfony` selon `docker-compose.yml` et initialisation.
- MySQL (depuis conteneur) :
  ```
  docker compose exec db mysql -uroot -proot -e "SHOW DATABASES;"
  ```

## Variables d'environnement utiles
Exemples (définies pour le service API dans `docker-compose.yml`):
```
DATABASE_URL='mysql://symfony:symfony@db:3306/e_claim'
CLAIM_USER_DATABASE_URL='mysql://symfony:symfony@db:3306/claim_user_db'
APP_ENV=dev
```

## Développement local sans Docker
API :
```
cd api-e-claim-2.0
composer install
cp .env.local.example .env.local   # adapter si nécessaire
# ajuster DATABASE_URL pour pointer sur votre MySQL
php bin/console doctrine:migrations:migrate
symfony serve # ou php -S 127.0.0.1:8000 -t public
```

Client :
```
cd client-e-claim-2.0
npm ci
npm run start -- --host 0.0.0.0
```

## Problèmes fréquents & résolutions
- PSR-4 / casse namespaces (Symfony DebugClassLoader errors)
  - Assurez-vous que les namespaces PHP correspondent exactement au mapping PSR‑4.
  - Régénérer l'autoload & vider cache :
    ```
    composer dump-autoload -o
    php bin/console cache:clear
    php bin/console cache:warmup
    ```
  - Sous Windows, pour renommer un dossier en changeant seulement la casse : renommez en un nom temporaire puis au nom final.

- Modules natifs (ex: `lightningcss`, `rollup` errors) dans Docker :
  - Ne montez pas les node_modules Windows dans le conteneur. Utilisez un volume nommé :
    ```yaml
    - ./client-e-claim-2.0:/app:delegated
    - client_node_modules:/app/node_modules
    ```
  - Recréez les modules Linux :
    ```
    docker compose run --rm client npm ci --unsafe-perm
    ```

- Port déjà utilisé (ex: 3306) :
  - Soit arrêter le service local occupant le port, soit changer le mapping hôte:container (ex. `3307:3306`) dans `docker-compose.yml`.

- Scripts d'initialisation MySQL :
  - Placez vos fichiers SQL dans `./docker/mysql/` ; Docker MySQL exécutera les scripts seulement à la création du volume DB. Si vous changez les scripts, supprimez le volume `db_data` (docker compose down -v) puis relancez.

## Structure principale
```
d:\e-claim-2.0
├─ api-e-claim-2.0/    # Symfony + API Platform
├─ client-e-claim-2.0/ # Angular client
└─ docker-compose.yml
```

## Commandes utiles
```
# rebuild et relancer tout
docker compose down -v
docker compose up --build -d

# logs
docker compose logs -f api client db phpmyadmin

# exécuter une commande dans un service
docker compose exec api bash
docker compose exec client bash
```

## Notes de sécurité / production
- Ne laissez jamais `MYSQL_ALLOW_EMPTY_PASSWORD` ni un compte `root` sans mot de passe en production.
- Configurez secrets et variables d'environnement en CI/CD ou via Docker secrets.
- Pour production, préférez PHP-FPM + nginx pour l'API et build statique pour le client servi par nginx.

---

Si vous voulez, je peux :
- Générer ce fichier README.md dans votre workspace.
- Adapter les instructions pour un autre mapping de ports / utilisateur DB.
- Ajouter exemples de commandes pour exécuter migrations/fixtures.