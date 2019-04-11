set -e

Contract_Path=../../../contract
Runtime_Path=../chaincode

echo "Install and institate chaincode"

cp -r $Contract_Path/* $Runtime_Path

cd $Runtime_Path

for file in .; do
    echo $file
done

