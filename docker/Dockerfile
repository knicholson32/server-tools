# Project arguments
ARG NODE_VERSION=20.10.0
ARG USR_LOCAL_EXPORT=/export-usr-bin
ARG ROOT_EXPORT=/export-root

######### Base Image ###############################################################################
FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable


######### Build Dependancies #######################################################################
FROM base AS build-deps

# Copy the application and move to the copied folder
COPY ./ /app/
WORKDIR /app

# Install build dependancies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile


######### Production Dependancies ##################################################################
FROM base AS prod-deps

# Copy the application and move to the copied folder
COPY ./ /app/
WORKDIR /app

# Install production dependancies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

######### Build Dependancies #######################################################################
FROM base AS build

# Copy the application and move to the copied folder
COPY ./ /app/
WORKDIR /app

# Install build dependancies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

######### Production Stage #########################################################################
FROM base AS prod

# Assign labels
LABEL org.opencontainers.image.title="server-tools"
LABEL org.opencontainers.image.description="Docker container for allowing basic server control from Home Assistant"
LABEL org.opencontainers.image.documentation="https://github.com/knicholson32/server-tools"
LABEL org.opencontainers.image.authors="Keenan Nicholson, Norris Nicholson"
LABEL org.opencontainers.image.source="https://github.com/knicholson32/server-tools"

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist

ARG GIT_COMMIT
ARG GIT_REF
ARG GIT_REF_PROTECTED
ARG REGISTRY_IMAGE
ARG CI

ENV GIT_COMMIT=$GIT_COMMIT
ENV GIT_REF=$GIT_REF
ENV GIT_REF_PROTECTED=$GIT_REF_PROTECTED
ENV REGISTRY_IMAGE=$REGISTRY_IMAGE
ENV CI=$CI

STOPSIGNAL SIGKILL
CMD [ "node", "--enable-source-maps", "/app/dist/index.js" ]