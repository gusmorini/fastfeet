# FastFeet
desafio 2 RocketSeat - etapa 1/4

# Docker Config

  # mariaDB
  docker run --name database-mariadb -e MYSQL_ROOT_PASSWORD=admin -p 3306:3306 -d mariadb

  # phpmyadmin
  docker run --name myadmin -d --link database-mariadb:db -p 8080:80 phpmyadmin/phpmyadmin

  # Acesso do myadmin:
  url: http://localhost:8080
  user: root
  password: admin

# iniciar os processos
  docker start database-mariadb myadmin
