# Load .env file
include .env
export $(shell sed 's/=.*//' .env)

build:
	docker compose build
up:
	docker compose up -d
down:
	docker compose down
logs:
	docker compose logs -f

switchContext:
	docker context use my-droplet

tag:
	docker buildx build --platform $(PLATFORM) -t $(DOCKER_ACCOUNT)/$(IMAGE_NAME):$(VITE_APP_VERSION) .
	docker buildx build --platform $(PLATFORM) -t $(DOCKER_ACCOUNT)/$(IMAGE_NAME):latest .

push: tag
	docker push $(DOCKER_ACCOUNT)/$(IMAGE_NAME):$(VITE_APP_VERSION)
	docker push $(DOCKER_ACCOUNT)/$(IMAGE_NAME):latest

deploy: bump push
	ssh $(REMOTE) "docker pull $(DOCKER_ACCOUNT)/$(IMAGE_NAME):latest && \
		docker stop $(IMAGE_NAME) || true && \
		docker rm $(IMAGE_NAME) || true && \
		docker run -d -p 80:80 --name $(IMAGE_NAME) $(DOCKER_ACCOUNT)/$(IMAGE_NAME):latest"

bump:
	@old_version=$$(grep VITE_APP_VERSION .env | cut -d '=' -f2); \
	new_version=$$(echo $$old_version | awk -F. '{ $$NF=sprintf("%02d", $$NF+1); OFS="."; print $$1,$$2,$$3 }'); \
	sed -i.bak "s/VITE_APP_VERSION=$$old_version/VITE_APP_VERSION=$$new_version/" .env && rm -f .env.bak; \
	echo "Bumped VITE_APP_VERSION from $$old_version to $$new_version"
