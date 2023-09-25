# Welcome to Project: Halma

For more information about the background and motivation for this project, check out the Wiki.

## Setup

The Wiki describes how to setup a development environment. (TODO link)

## Project Management

The Project is organized using a [GitHub Project](https://github.com/orgs/dobler-it/projects/2)

## CI/CD

We use GitHub Actions for CI/CD.
The following Jobs exist

| Name                                   | Trigger(s)                                          | Description                         | Link                                                                    |
|----------------------------------------|-----------------------------------------------------|-------------------------------------|-------------------------------------------------------------------------|
| azure-static-web-apps-build-and-deploy | Any pushed or pull requests to the `develop` branch | Builds and deploys a static website | [Show me](.github/workflows/azure-static-web-apps-build-and-deploy.yml) |

## Current deployments

| What    | Location         | How                  | Stage | Resource group  |
|---------|------------------|----------------------|-------|-----------------|
| Website | switzerlandnorth | Azure Static Web App | DEV   | halma-dev-group |

### Frontend

The frontend is deployed using [Azure Static Web Apps](https://learn.microsoft.com/en-gb/azure/static-web-apps) and the
following [tutorial1](https://learn.microsoft.com/en-gb/azure/static-web-apps/get-started-cli?tabs=react)
and [tutorial2](https://create-react-app.dev/docs/deployment/#azure).