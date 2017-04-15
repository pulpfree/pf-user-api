NAME=pf-user
VERSION=1.0
PORT_MAP=3010:3010

default: build

build:
	npm run build && docker build --rm -t pulpfree/$(NAME):$(VERSION) .

rund:
	docker run -it --rm --name $(NAME) --env NODE_ENV=development -p $(PORT_MAP) \
		pulpfree/$(NAME):$(VERSION)

# production run command
# docker run --name pf-user --env NODE_ENV=production -p 3010:3010 -d pulpfree/pf-user:1.0
runp:
	docker run --name $(NAME) --env NODE_ENV=production -p $(PORT_MAP) -d \
		pulpfree/$(NAME):$(VERSION)

stop:
	docker stop	$(NAME)

start:
	docker start $(NAME)

push:
	docker push pulpfree/$(NAME):$(VERSION)