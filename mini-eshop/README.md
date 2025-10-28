# Mini E-Shop Website – CI/CD Pipeline using Jenkins

A beginner-friendly project that builds, tests, containerizes, and deploys a simple Node.js + Express website using Jenkins and Docker.

## Tech Stack
- Frontend: HTML, CSS, JavaScript (static in `views/` and `public/`)
- Backend: Node.js (Express)
- Version Control: Git + GitHub
- CI/CD: Jenkins (Declarative Pipeline)
- Deployment: Docker container on port 8080

## Project Structure
```
mini-eshop/
├── server.js
├── package.json
├── views/
│   ├── index.html
│   ├── products.html
│   └── about.html
├── public/
│   ├── style.css
│   └── script.js
├── __tests__/server.test.js
├── Dockerfile
├── Jenkinsfile
├── .dockerignore
└── .gitignore
```

## Local Setup
1. Install Node.js 18+ and Docker.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Create a `.env` (see `.env.example`) with your Mongo connection (or skip to use fallback):
   ```env
   PORT=8080
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB=mini_eshop
   ```
4. Run dev server:
   ```bash
   npm run dev
   # open http://localhost:8080
   ```
5. Run tests:
   ```bash
   npm test
   ```

## Docker
Build and run locally:
```bash
docker build -t mini-eshop:local .
docker run -d --name mini-eshop -p 8080:8080 mini-eshop:local
```

## Jenkins CI/CD
### Prerequisites
- Jenkins with Docker CLI available on the agent.
- Jenkins plugins: Git, Pipeline, Credentials Binding.
- GitHub repo with a webhook to your Jenkins (optional but recommended).

### Credentials
Create a Jenkins credential of type Username with Password:
- ID: `dockerhub-dh-creds`
- Username: your Docker Hub username
- Password: your Docker Hub access token/password

### Pipeline Setup
1. In Jenkins, create a new Multibranch Pipeline or Pipeline pointing to your GitHub repo.
2. Ensure the Jenkinsfile at repo root is used.
3. On pushes, Jenkins will:
   - Install deps (npm ci)
   - Lint (non-blocking)
   - Test with Jest
   - Build Docker image
   - On `main` branch: push to Docker Hub and deploy a container mapping `8080:8080`.
   - Optional Mongo: use `docker-compose.yml` on the agent or an external MongoDB service; the app reads `MONGODB_URI`.

### Deploy Target
The `Deploy` stage runs `docker run` on the Jenkins agent itself. If you deploy to a remote host, replace that step with an SSH step to your server, or use an agent on the target host.

## Endpoints
- `GET /` → Home page
- `GET /products` → Products page
- `GET /about` → About page
- `GET /health` → JSON health check `{ status: 'ok' }`

## Notes
- Port is fixed at 8080; override with `PORT` env if you self-run the app.
- Lint step is non-blocking to keep the pipeline beginner-friendly.
