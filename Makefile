setup:
	@cd apps/ingest && source .venv/bin/activate && make setup
	@cd apps/server && yarn prisma migrate deploy

clean:
	@cd apps/ingest && make clean