# PromoGPT Platform

PromoGPT combines a Django REST API with a React/Vite frontend to help African small businesses turn structured data into AI-generated marketing campaigns. This README documents how the backend, frontend, and campaign agent fit together and outlines deployment steps.

## Architecture overview

- **Backend** – Django REST Framework serves authentication, business management, data ingestion, and campaign generation APIs. CSV uploads are processed into `Product`, `SalesRecord`, and `Campaign` models.
- **Frontend** – A Vite-powered React single-page app handles onboarding, data uploads, and campaign review with responsive African-focused UI copy.
- **Agent** – The `CampaignGenerator` service analyses stored products and sales and returns localized campaign plans that the frontend renders.
- **Database** – Uses SQLite by default for development (`USE_SQLITE=true`) and can switch to PostgreSQL by setting the appropriate `POSTGRES_*` environment variables.

## Backend setup

1. Create and activate a Python 3.11 virtual environment.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Configure environment variables (copy `.env.example` if available) and set `USE_SQLITE=true` for local runs or provide PostgreSQL credentials.
4. Apply migrations:
   ```bash
   python manage.py migrate
   ```
5. Run the development server:
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

### Key API endpoints

- `POST /users/register/` – Register and receive JWT tokens.
- `POST /users/login/` – Authenticate and receive tokens.
- `POST /users/business/create/` – Create a business workspace.
- `GET /business/<slug>/products/` – List products per business.
- `POST /business/<slug>/products/upload/` – Upload product CSV data.
- `POST /business/<slug>/campaigns/` – Generate and store a campaign with the AI agent.

## Frontend setup

1. Install Node.js 18+.
2. Install packages and run the dev server:
   ```bash
   cd promogpt-frontend
   npm install
   npm run dev -- --host
   ```
3. Build for production when ready:
   ```bash
   npm run build
   ```

The frontend expects the backend at `http://localhost:8000`. Adjust `API_BASE` in `src/app.jsx` for other environments.

## Deployment notes

- Use PostgreSQL in production by setting `USE_SQLITE=false` and providing `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, and `POSTGRES_PORT`.
- Run `python manage.py collectstatic` before serving static files.
- Apply database migrations during deployment with `python manage.py migrate`.
- Build the frontend with `npm run build` and serve the `dist/` assets via a CDN or the backend (e.g., Django `whitenoise` or a reverse proxy).
- Docker users can adapt the existing `docker-compose.yml` by updating the `web` service command to run migrations and `runserver`.

## Testing checklist

- `python manage.py test` – Backend tests (add as the project grows).
- `npm run test` – Frontend unit tests (if configured).
- `npm run lint` – Recommended for static analysis of the frontend codebase.

## Troubleshooting

- If CSV uploads fail with a pandas error, install pandas via `pip install pandas`.
- If CORS requests fail in production, ensure `django-cors-headers` is installed and `corsheaders` is available so middleware loads.
- Verify JWT secrets and allowed hosts before exposing the API publicly.