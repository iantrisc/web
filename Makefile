setup:
	sudo docker volume create iantrisc-website

install:
	docker-compose run -w /usr/src/app app \
		npm install $(PKGS) $(ARGS)

uninstall:
	docker-compose run -w /usr/src/app app \
		npm uninstall $(PKGS) $(ARGS)

init-eslint:
	docker-compose run -w /usr/src/app app \
		npx eslint --init

it:
	docker-compose exec app sh

start:
	docker-compose up

detach:
	docker-compose up -d