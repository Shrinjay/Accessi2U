SHELL := /bin/bash 

setup:
	@cd apps/ingest && source .venv/bin/activate && make setup
	@cd packages/database && yarn prisma migrate deploy

setup-staging:
	@cd apps/ingest && source .venv/bin/activate && make setup-staging
	@cd packages/database && yarn prisma migrate deploy

clean:
	@cd apps/ingest && make clean

clean-staging:
	@cd apps/ingest && make clean-staging
	@cd packages/database yarn prisma migrate reset -y