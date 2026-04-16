# EDS Multibrand boilerplate
EDS Multibrand is an innovative starter project that extends the Adobe AEM Boilerplate to provide comprehensive multi-brand support within a single AEM project.

## Environments
- Preview: https://main--eds-multi-brand--acs-ui.aem.page/
- Live: https://main--eds-multi-brand--acs-ui.aem.live/

## Documentation

### EDS Multibrand Project Documentation

📚 **[View Full Documentation](https://acs-ui.github.io/eds-multi-brand-docs/)**

Our comprehensive documentation covers:
- Getting started with EDS Multi-Brand
- Theme and brand management
- Block development
- Troubleshooting guide

### AEM Documentation

Before using the aem-boilerplate, we recommand you to go through the documentation on https://www.aem.live/docs/ and more specifically:
1. [Developer Tutorial](https://www.aem.live/developer/tutorial)
2. [The Anatomy of a Project](https://www.aem.live/developer/anatomy-of-a-project)
3. [Web Performance](https://www.aem.live/developer/keeping-it-100)
4. [Markup, Sections, Blocks, and Auto Blocking](https://www.aem.live/developer/markup-sections-blocks)

### Documentation Testing

The project includes automated documentation testing via GitHub Actions:

- **Trigger**: Pull requests with changes to `docs/` files
- **Scope**: Documentation-only validation
  - ✅ Documentation linting and type checking
  - ✅ Build verification
  - ✅ Internal documentation link validation (port 3030)
  - ❌ No application link validation (excludes port 3000)
- **Deployment**: Automatic deployment to GitHub Pages on merge to main

For detailed deployment rules, see [DEPLOYMENT-RULES.md](.github/workflows/DEPLOYMENT-RULES.md).

## Installation

```sh
npm i
```

## Start Dev Server

Start eds server and and serve merged CSS
```
npm start
```

## Theme Management

### Initiate new Brand Theme
Setup dev environment for a new brand theme
```
npm run scaffold:create
```

### Remove Brand Theme
Remove unwanted brand theme
```
npm run scaffold:remove
```

### Start Theme

Starts Gulp server to generate and serve merged CSS

```
npm run scaffold:start
```

### Build Theme

Generate and serve merged CSS

Configure BRANDS .env 
 BRANDS=brand1,brand2,brand3

```
npm run scaffold:build
```

## Environment Proxy
setup .env file to point to specific pages url

```
AEM_OPEN=/en/
AEM_PORT=3000
AEM_PAGES_URL=https://main--eds-multi-brand--acs-ui.aem.page/
```

## Linting

```sh
npm run lint
```

## Local development

1. Create a new repository based on the `aem-boilerplate` template and add a mountpoint in the `fstab.yaml`
2. Add the [AEM Code Sync GitHub App](https://github.com/apps/aem-code-sync) to the repository
3. Install the [AEM CLI](https://github.com/adobe/helix-cli): `npm install -g @adobe/aem-cli`
4. Start theme server and AEM Proxy: `npm start` (opens your browser at `http://localhost:3000`)
5. Open the `{repo}` directory in your favorite IDE and start coding :)
