# Load .env file
include .env
export $(shell sed 's/=.*//' .env)

REMOTE=root@$$(cat droplet_ip.txt)

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

create-droplet:
	@echo "🚀 Creating droplet $(DROPLET_NAME)..."
	doctl compute droplet create $(DROPLET_NAME) \
		--image $(DROPLET_IMAGE) \
		--size $(DROPLET_SIZE) \
		--region $(DROPLET_REGION) \
		--vpc-uuid $(VPC_UUID) \
		--ssh-keys $(SSH_KEY_ID) \
		--wait \
		--format PublicIPv4 --no-header > droplet_ip.txt

	@echo "✅ Droplet created with IP: $$(cat droplet_ip.txt)"

destroy-droplet:
	@echo "🔥 Destroying droplet $(DROPLET_NAME)..."
	doctl compute droplet delete -f $(DROPLET_NAME)
	rm -f droplet_ip.txt

update-dns:
	@echo "🌍 Updating Route53 DNS for $(DOMAIN_NAME)..."
	IP=$$(cat droplet_ip.txt); \
	aws route53 change-resource-record-sets \
		--hosted-zone-id $(HOSTED_ZONE_ID) \
		--change-batch '{"Changes":[{"Action":"UPSERT","ResourceRecordSet":{"Name":"$(DOMAIN_NAME)","Type":"A","TTL":300,"ResourceRecords":[{"Value":"'"$$IP"'"}]}}]}'
	@echo "✅ DNS updated: $(DOMAIN_NAME) → $$(cat droplet_ip.txt)"

