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

STOPSIGNAL SIGKILL
CMD [ "node", "--enable-source-maps", "/app/dist/index.js" ]

# ######### Production Stage #########################################################################
# FROM node:${NODE_VERSION}-alpine3.18 as prod

# # Assign labels
# LABEL org.opencontainers.image.title contour
# LABEL org.opencontainers.image.description Docker container for managing and archiving audiobooks
# LABEL org.opencontainers.image.documentation https://github.com/knicholson32/contour
# LABEL org.opencontainers.image.authors Keenan Nicholson, Norris Nicholson
# LABEL org.opencontainers.image.source https://github.com/knicholson32/contour

# # Renew args from above
# ARG AAXtoMP3_VERSION
# ARG TONE_VERSION
# ARG NODE_VERSION
# ARG USR_LOCAL_EXPORT
# ARG ROOT_EXPORT
# ARG WHEEL_EXPORT
# ARG SERVER_PORT

# # Set environmental variables
# ENV AAXtoMP3_VERSION=${AAXtoMP3_VERSION}
# ENV TONE_VERSION=${TONE_VERSION}
# ENV PORT=${SERVER_PORT}
# ENV DATABASE_URL="file:/db/contour.db?connection_limit=1"
# # ENV DATABASE_URL="file:/db/unabridged.db?connection_limit=1"
# ENV ORIGIN="http://localhost:${SERVER_PORT}"
# # 11MB Max body size (for image uploads)
# ENV BODY_SIZE_LIMIT=11000000
# ENV PROC_SHELL='/bin/sh'

# COPY --from=build "/app/prisma/" "/app/prisma"
# COPY --from=build "/app/package.json" "/app/package.json"
# COPY --from=build "/app/package-lock.json" "/app/package-lock.json"

# # Install production node dependancies
# RUN echo "---- Install Production Dependancies ----" \
#   && cd /app \
#   && npm ci --omit dev --loglevel verbose && npx prisma generate

# COPY --from=build "/app/build/" "/app/"

# ARG GIT_COMMIT
# ARG GIT_REF
# ARG GIT_REF_PROTECTED
# ARG REGISTRY_IMAGE
# ARG CI

# ENV GIT_COMMIT=$GIT_COMMIT
# ENV GIT_REF=$GIT_REF
# ENV GIT_REF_PROTECTED=$GIT_REF_PROTECTED
# ENV REGISTRY_IMAGE=$REGISTRY_IMAGE
# ENV CI=$CI

# STOPSIGNAL SIGKILL
# # Set Docker command entry point and expose the proper port
# EXPOSE ${SERVER_PORT}/tcp
# CMD ["sh","-c","cd /app && npx prisma migrate deploy && PROTOCOL_HEADER=x-forwarded-proto HOST_HEADER=x-forwarded-host /usr/local/bin/node /app"]