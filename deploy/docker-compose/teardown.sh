set -e
export COMPOSE_PROJECT_NAME=net

# Shut down the Docker containers for the system tests.
docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down

# remove the local state
rm -f ~/.hfc-key-store/*

# remove chaincode docker images
if [ -n "$(docker ps -aq)" ]; then 
    docker rm $(docker ps -aq)
fi

if [ -n "$(docker images dev-* -q)" ]; then 
    docker rmi $(docker images dev-* -q)
fi

# Your system is now clean
