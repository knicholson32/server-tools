[![GitHub Workflow Status (with event)](https://img.shields.io/github/actions/workflow/status/knicholson32/server-tools/docker-build.yml)](https://github.com/knicholson32/server-tools/actions)
[![Docker Image Size with architecture (latest by date/latest semver)](https://img.shields.io/docker/image-size/keenanrnicholson/server-tools)](https://hub.docker.com/r/keenanrnicholson/server-tools/tags)
[![Docker Pulls](https://img.shields.io/docker/pulls/keenanrnicholson/server-tools)](https://hub.docker.com/r/keenanrnicholson/server-tools/tags)

# Introduction

## Features

- Restart and Shutdown the host machine

# Usage

Typical `docker-compose.yml`:

```yml
version: '3.8'
services:
  server-tools:
    image: 'keenanrnicholson/server-tools:latest'
    container_name: server-tools
    restart: unless-stopped
    volumes:
      - /path/to/db/folder:/db
      - /path/to/file/folder:/files
    environment:
      PUID: 1000
      PGID: 1000
      ORIGIN: 'http://localhost:5173'
      TZ: 'America/New_York'
```

# Development

Development for server-tools is done inside a developmental Docker image.

Create the dev image and start a local development session:

```shell
# Start dev environment
make dev
```

Build the project and serve it locally without creating the full Docker image:

```shell
# Build to node-adapter and preview result
make preview
```

Create the Docker image and serve it locally:

```shell
# Build the full image and host it locally
make create-local && make local
```

## `node_modules`

During development, a `node_modules` folder is created in the top-level directory. Note that the libraries within are not necessarily compatible with your local machine, as they were installed within the Docker container environment. This means that if `npm i` is ran outside the Docker container, the incorrect libraries will be loaded by the dev environment. If issues are encountered with respect to dependencies, delete the `node_modules` folder and try again to allow the container environment to install the correct libraries.