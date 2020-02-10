# FastFeet
desafio RocketSeat

# Docker Config

  # mariaDB
  docker run --name fastfeet-mariadb -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mariadb

  # phpmyadmin
  docker run --name fastfeet-myadmin -d --link fastfeet-mariadb:db -p 8080:80 phpmyadmin/phpmyadmin

  # Acesso do myadmin:
  url: http://localhost:8080
  user: root
  password: root

  # redis (fila para de emails)
  docker run --name fastfeet-redis -p 6379:6379 -d -t redis:alpine

# EX iniciar os processos
  docker container start fastfeet-mariadb
