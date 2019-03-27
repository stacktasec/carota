set -e
export COMPOSE_PROJECT_NAME=net

# remove the local state
rm -f ~/.hfc-key-store/*

docker-compose -f docker-compose.yml kill && docker-compose -f docker-compose.yml down

if [ "$?" -ne 0 ]; then
    echo "down docker failed"
    exit 1
fi

# remove chaincode docker images
if [ -n "$(docker ps -aq)" ]; then 
    docker rm -f $(docker ps -aq)
fi

if [ -n "$(docker images dev-* -q)" ]; then 
    docker rmi -f $(docker images dev-* -q)
fi

if [ "$?" -ne 0 ]; then
    echo "remove containers failed"
    exit 1
fi

# Your system is now clean

# copy the chaincode
cp -r ../../contract/resource ./chaincode

# down and up containers
docker-compose -f docker-compose.yml up -d ca.example.com orderer.example.com peer0.org1.example.com couchdb


if [ "$?" -ne 0 ]; then
    echo "start docker filed."
    exit 1
fi

# Create the channel
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel create -o orderer.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx
# Join peer0.org1.example.com to the channel.
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/etc/hyperledger/msp/users/Admin@org1.example.com/msp" peer0.org1.example.com peer channel join -b mychannel.block

docker-compose -f docker-compose.yml up -d cli

docker exec cli peer chaincode install -n resource -v 1.0 -p github.com/resource -l golang
docker exec cli peer chaincode instantiate -n resource -C mychannel -v 1.0 -c '{"Args":[]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

cat <<EOF

Done.

EOF
