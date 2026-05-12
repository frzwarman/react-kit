# UI
  
  <a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>
  
 ## Overview
 
 This repository is an Nx + pnpm workspace for K3Mart UI. It currently contains a single React component library with Storybook:
 
 - `libs/react-kit/` — `@universe-react-kit/react-kit`
   - Storybook config in `libs/react-kit/.storybook/`
   - Vite setup in `libs/react-kit/vite.config.ts`
   - Dockerfile to serve Storybook static: `libs/react-kit/Dockerfile.storybook`
 
 ## Prerequisites
 
 - Node.js (LTS recommended)
 - pnpm (via Corepack)
 - Docker (optional; for serving Storybook static with Nginx)
 
 ## Install
 
 ```sh
 corepack enable
 pnpm install
 ```
 
 ## Development (Storybook for @universe-react-kit/react-kit)
 
 Run Storybook (dev):
 
 ```sh
 pnpm nx run @universe-react-kit/react-kit:storybook
 # or
 pnpm react-kit:storybook:run
 ```
 
 Unit tests (Vitest):
 
 ```sh
 pnpm nx test @universe-react-kit/react-kit
 ```
 
 Lint:
 
 ```sh
 pnpm nx lint @universe-react-kit/react-kit
 ```
 
 ## Build
 
 Build the component library:
 
 ```sh
 pnpm nx build @universe-react-kit/react-kit
 ```
 
 Build Storybook static site:
 
 ```sh
 pnpm nx run @universe-react-kit/react-kit:build-storybook
 # or
 pnpm react-kit:storybook:build
 # Output: libs/react-kit/storybook-static/
 ```
 
 ## Docker: serve Storybook static
 
 ```sh
 # 1) Build Storybook static output
 pnpm nx run @universe-react-kit/react-kit:build-storybook
 
 # 2) Build and run the Nginx image
 docker build -f libs/react-kit/Dockerfile.storybook -t react-kit-storybook libs/react-kit
 docker run --rm -p 8080:80 react-kit-storybook
 ```
 
 ## CI/CD (GitLab)
 
 See `.gitlab-ci.yml` for configured jobs:
 
 - build:react-kit — builds the library (`libs/react-kit/dist/`)
 - build:storybook — builds Storybook static (`libs/react-kit/storybook-static/`)
 - publish:react-kit — publishes `@universe-react-kit/react-kit` to the GitLab NPM registry
   - Triggers on git tags or when `PUBLISH_REACT_KIT=true`
   - If running on a tag `vX.Y.Z`, the package version is set to `X.Y.Z`
 - storybook:docker-image — builds and pushes `react-kit-storybook` image to GitLab Container Registry
 
 ## Workspace layout
 
 ```text
 libs/
 └─ react-kit/
    ├─ .storybook/
    ├─ src/
    ├─ Dockerfile.storybook
    ├─ package.json
    └─ vite.config.ts
 ```
 
 ## Helpful Nx commands
 
 ```sh
 pnpm nx show project @universe-react-kit/react-kit
 pnpm nx graph
 ```
  
  ## Useful links
  
  Learn more:
