# Intégration du compte client

Le formulaire d'inscription appelle les endpoints décrits dans la PR PMB License #6 :
- `POST /api/account/register` avec `displayName`, `email`, `password` et `turnstileToken`.
- `POST /api/account/email/verify` avec le jeton de la query string `?verify=`.
- `POST /api/account/email/resend` avec `email` et un nouveau `turnstileToken`.

L'inscription ne connecte pas automatiquement l'utilisateur. Un message neutre demande de consulter sa boîte e-mail. La connexion affiche une action de renvoi lorsque l'API retourne `403 EMAIL_NOT_VERIFIED`.

## Clé publique Turnstile

Le Worker sert `/account-config.js` avec le binding public `TURNSTILE_SITE_KEY`. Créez/configurez le widget Cloudflare Turnstile pour le hostname de la page de compte, puis ajoutez sa **Site Key publique** comme variable du Worker Cloudflare. La clé secrète reste uniquement côté API et ne doit jamais être ajoutée à ce dépôt.

La page affiche une erreur explicite tant que la Site Key publique n'est pas configurée. Le renvoi de lien et l'inscription exigent chacun une nouvelle validation Turnstile.

## Ordre de mise en service

1. Configurer la Site Key publique dans le Worker.
2. Déployer le site depuis la PR approuvée.
3. Déployer séparément l'API avec la clé secrète Turnstile et la clé API Brevo.
4. Tester création, mail de confirmation, connexion avant/après vérification et renvoi.

Cette PR ne configure ni le VPS ni Caddy et ne lance aucun déploiement.
