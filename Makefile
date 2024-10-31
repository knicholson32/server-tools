.PHONY: all test clean

create-local:
	docker build --file ./docker/Dockerfile --build-arg GIT_COMMIT=$(shell git rev-parse HEAD) --build-arg CI=true -t keenanrnicholson/server-tools:local .
create-all:
	docker buildx build --builder mybuilder --file ./docker/Dockerfile --push --build-arg GIT_COMMIT=$(shell git rev-parse HEAD) --target prod --platform linux/arm64,linux/amd64 --tag keenanrnicholson/server-tools:latest .
dev:
	rm -rf ./node_modules
	docker build --file ./docker/Dockerfile --target build-deps -t server-tools:dev .
	docker-compose -f ./docker/docker-compose.dev.yml -p server-tools up --remove-orphans
local:
	docker-compose -f ./docker/docker-compose.local.yml up --remove-orphans