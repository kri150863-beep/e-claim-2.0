Puis exécuter la commande pour créer la base

```bash
php  bin/console doctrine:database:create
```

Exécuter les migrations

```bash
php  bin/console doctrine:migrations:migrate
```

Exécuter la fixture

```bash
php bin/console d:f:l --append
`

Lancer le build en temps réel de yarn

```bash
yarn encore dev --watch
```

Lancer le serveur local s'il n'y a pas de virtual host

```bash
php  -S localhost:8000 -t public

ou

symfony serve 


3.	Génération des entités (étape cruciale)
# Génère le mapping depuis la base
php bin/console doctrine:mapping:import "App\Entity" annotation --path=src/Entity --force

# Génère les classes d'entités
php bin/console doctrine:mapping:convert annotation ./src/Entity

# Crée les getters/setters
php bin/console make:entity --regenerate App\\Entity


4.	Configuration spécifique SQL Server (config/packages/doctrine.yaml)
doctrine:
    dbal:
        driver: 'sqlsrv'
        mapping_types:
            datetime: datetime
            varbinary: string
        options:
            # Important pour les procédures stockées
            MultipleActiveResultSets: false
            # Si vous utilisez des schémas SQL Server
            # schema_filter: ~^(?!sys)~ 

    orm:
        auto_generate_proxy_classes: true
        naming_strategy: doctrine.orm.naming_strategy.underscore
        auto_mapping: true
        mappings:
            App:
                is_bundle: false
                type: annotation
                dir: '%kernel.project_dir%/src/Entity'
                prefix: 'App\Entity'
=====================================================================
POUR SANTATRA : 
-------------
Manaova composer update
dia micreer migration : php bin/console doctrine:migrations:diff
dia miexectute : php  bin/console doctrine:migrations:migrate

Dia ty ny path refresh token atao am postman hitestena azy: 
    ------------------
POST  http://localhost:8000/api/token/refresh

body et Content-Type: application/json: 
{
  "refresh_tokens": "XXXDX.XXXX.XXXXXXXXX"  
}
  => Ireo xxx io soloina le refreshToken valiny azo avy am auth/login

POST  http://localhost:8000/api/auth/login

Résultat : 
    {
    "status": "success",
    "code": 200,
    "message": "Authentification réussie.",
    "data": {
        "accessToken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTIwOTkzODAsImV4cCI6MTc1MjEwNjU4MCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJ0b2pvQGdtYWlsLmNvbSIsImlkIjoxLCJidXNpbmVzc19uYW1lIjoiQnJvbmRvbiJ9.nb6fPUcEI5u_fIhr3EAbRrk6COJBT8Iy57WZqQoZwR7anIYFcvggnnSv4A2C5WuCDkUHtqV8Ll4TH819snjUENg3ZVqlq3FuwwnG-NAcFA3LGkIK3dQwLNU7FnpbMYDKi91sQYIOEsh0S7_RSEXCarKgW5PoCfC9ltKsALAwvzf2eZzFGnUbF1iNFhyRTq-L95Zev4wkooYSsysGahVfouENYoTnHVtlE0lK4RBHLK4MVawmVcDRnlUfGqmL8BEFV0BvOvTXZUydj9hu84YiLTbYbKy7euGacR_evjSPWLuvlvkNm3Jc0qpTgg_z-v3ni3N7zaNyhOPbojZ98wNDJDXiXe2TTpjCUsmXKI_-V2i6RJZlqHpD3R8fxfikN7RaRuc1KYumAqjN-o8vm3YzrmVFb7BQZrrTHSLKXYV9R5pWiQKOJnnBtTXrvgG7K3QPOfByaBuyWdRjUDs_sdULaT-alz0V-d3WKyzOICshahWvXgXEHZuHU2EOq0-OdE-uTIq4Nj5Ou9ih3jLblXIWye4OmLFGCk3g_CV9yMPE-C6btqSt7FYcFhkQoRDSuS8QTjZyw_P05hdCtQOESOuEniizHZTFQ5KHxMR-kNdpGdhbEQxW0VwKXXTEyfovZ1BwwVWoZlYwXwWdKizAXJLilIgBwI7xKVKO1-SUy3jX7dg",
        "refreshToken": "d596f94c-d25e-424b-b92e-d0d086d279d6",
        "user": {
            "id": 1,
            "email": "tojo@gmail.com",
            "roles": [
                "surveyor"
            ],
            "business_name": "Brondon"
        }
    }
}
   ====> SOLOINA VALEURN IO : 
          "refreshToken": "d596f94c-d25e-424b-b92e-d0d086d279d6",


DIA RESULTAT AZO AM REFRESH TOKEN TOKONY : 
    -------------------
    TOKEN VOA2 DIA FRESHTOKEN VAO2

{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTIwOTk0NTcsImV4cCI6MTc1MjEwNjY1Nywicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJ0b2pvQGdtYWlsLmNvbSIsImlkIjoxLCJidXNpbmVzc19uYW1lIjoiQnJvbmRvbiJ9.Unl_ivSAvVeo_McLLM81MHRJJFyO_DW_pwQUoDkvUGO20ow4rj4Ia_4fuEoh4Ly-ekgzlabYXz4v8EUrqQCLDUh9wJp1kQQriiVL-ZraR81bu3vloCsxBjF2V4ZnQZjufiO63gaGaAmEuBlxGcV-b8jW61N_SNkF67wnPoNBKCHuUjjAjxi4T14lenUP03-GcDkZBwKg749W2l0P-dKkPwhOxrF_nj14r9B9ZPEqOpP76ZYDUZcxvTR4OU8vlm6E8DZtqhmhx77VWc9ZUmEUQu1nzq6OHTO9_8DVS7VsdVAvBmlfm45wYiztWttnH-UBXc1Z-n4rwFcT5pfCEmYWyzAwozvIGADauPwaVzFoAnCkcAYmMeyhrTdZIXf9mCV8Gh8_siiq2fcolyCfuRlU_gCEt45wm_b2Th6lFl-hq6rRn40Mw6jpMQB6D2pGFhgduBhgEuN_mpwja4AKvBnt62GIxKqAAe7p0y-JI32-izZ399Xktyd36uxS24g5SAajCIfEsBsw3xkfUTX2xwnUEbqOSa9CwBOFKIZl_Bz79yq3l0pn_Xjbk4e-dfJV62907iea-TW7Y4rKHCZWrwheVW7qjn4PLKryXTHjD-0lsj79X_RnJV0v_HbVUkuwH4PNPR9-I3aP4T69feFb5GLqo4EgVTM7ev7T36QGcSpkOfE",
    "refresh_tokens": "7e47660f4b114deda9e6569e6419c261f5c818de91624a0f30430763cf5e146279530225d4d854e5d9c2c4b9955e322561570a23e814c856af6c2333e003ca88"
}

===============================
LOGOUT
------
Blacklist token

php bin/console doctrine:migrations:diff --em=claim_user_db
php bin/console doctrine:migrations:migrate --em=claim_user_db
   ou
php bin/console doctrine:schema:update --force --em=claim_user_db