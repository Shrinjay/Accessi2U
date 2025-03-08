POSTGRES_IMAGE_VERSION=16.2

# Check for dependencies
check-docker:
	@docker --version > /dev/null || (echo "Docker is not installed. Please install Docker and try again." && exit 1)

check-python:
	@python3 --version > /dev/null || (echo "Python3 is not installed. Please install Python and try again." && exit 1)

check-pipreq:
	@pipreqs --version > /dev/null || python3 -m pip install pipreqs

check-alembic:
	@alembic --version > /dev/null || pip install alembic

regenerate-requirements:
	@pipreqs . --force

# Install python dependencies
install-python-dependencies: check-python check-pipreq check-alembic
	@pip install -r requirements.txt

# Setup
setup-local-dirs:
	@mkdir -p out
	@mkdir -p out/tmp

# Runners
run-local-docker-db:
	@docker ps | grep ingest-postgres > /dev/null || docker run --name ingest-postgres \
 		-e POSTGRES_PASSWORD=postgres \
 		-e POSTGRES_USER=postgres \
 		-e POSTGRES_DB=ingest \
 		-d -p 5432:5432 postgres:$(POSTGRES_IMAGE_VERSION)

migrate-local-docker-db: check-alembic
	@alembic upgrade head

setup:  setup-local-dirs run-local-docker-db install-python-dependencies setup-local-dirs

run-ingest:
	@python3 main.py

# Stoppers
stop-local-docker-db:
	@docker stop ingest-postgres
	@docker rm ingest-postgres

remove-tmp:
	@rm -rf out


clean: stop-local-docker-db remove-tmp

# Util
install-psycopg2-mac:
	@env LDFLAGS="-I/opt/homebrew/opt/openssl/include -L/opt/homebrew/opt/openssl/lib" pip --no-cache install psycopg2
