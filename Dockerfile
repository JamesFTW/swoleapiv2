# Use the official MySQL 8.0 image as the base image
FROM mysql:8.0

# Set the root user password for MySQL
ENV MYSQL_ROOT_PASSWORD=password

# Create a new database
ENV MYSQL_DATABASE=swole_db

# Set the character set and collation
ENV MYSQL_CHARSET=utf8
ENV MYSQL_COLLATION=utf8_general_ci