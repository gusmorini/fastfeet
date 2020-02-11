# FastFeet
desafio RocketSeat

# rodar o projeto principal
yarn dev

# rodar a fila de emails
yarn queue

# Docker Config

  # mariaDB
  docker run --name fastfeet-mariadb -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=fastfeet -p 3306:3306 -d mariadb

  # Adminer
  docker run --name fastfeet-adminer --link fastfeet-mariadb:db -d -p 8080:8080 adminer

  # Acesso do adminer:
    url: http://localhost:8080
    user: root
    password: root

  # redis (fila para de emails)
  docker run --name fastfeet-redis -p 6379:6379 -d -t redis:alpine

# EX iniciar os containers
  docker container start fastfeet-mariadb fastfeet-adminer fastfeet-redis
