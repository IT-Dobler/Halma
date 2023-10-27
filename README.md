# Welcome to Project: Halma

Do you ever find yourself wanting to play a game of (Star-)Halma? Or perhaps the awefully similar "Chinese Checkers"
that is indeed identical and solely called differently for marketing purposes? So you load up your app / play store /
browser and type in "Halma". What you will find are a few very brightly colored apps, most of which focus more on
gamifying an otherwise below average user experience instead of providing actually useful features.

This is where this project comes in, heavily inspired by the tried and tested application lichess and the standard that
we've come used to through the various chess resources. For example quickly and easily jumping into games, puzzles and
analysis boards to hone your skills as well as a plathora of statistics, various game modes, rating and time controls.

Step by step, completely opensource from the start this project aims to provide the Halma world with a user friendly,
professional application to play, practice, analyze and improve your Halma.

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