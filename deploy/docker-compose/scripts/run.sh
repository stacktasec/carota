set -e

echo "Install and institate chaincode"

# now the location is in the chaincode 
cd ../chaincode
RUNTIME_PATH=$PWD
echo "The runtime chaincode path is $RUNTIME_PATH"

cd ../../../contract

for file in *; do
    cd $file
    for subFile in *; do
        if [ $subFile == *contract.go ]; then          
            dirName=$RUNTIME_PATH/${subFile%_*}
            if [ -d $dirName ]; then
                rm -rf $dirName
            fi
            mkdir $dirName
            cp $subFile $dirName
        fi
    done
    cd ..
done

