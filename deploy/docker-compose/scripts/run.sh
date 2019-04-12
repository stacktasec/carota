set -e

blue(){
    echo -e "\033[34m$1\033[0m"
}

cd ../chaincode
CC_PATH=$PWD
blue "The runtime chaincode path is $CC_PATH."

cd ../../../contract

for file in *; do
    if [ ! -d $file ];then
        continue
    fi
    cd $file
    for subFile in *; do
        if [ $subFile == *contract.go ]; then          
            dirName=$CC_PATH/${subFile%_*}
            contractName=${subFile%_*}
            if [ -d $dirName ]; then
                rm -rf $dirName
            fi
            mkdir $dirName
            cp $subFile $dirName
            blue "Copy contract $contractName done."
            break
        fi
    done
    break
done

blue "############################################"

docker exec cli scripts/help.sh 0 1 $contractName 1.0 github.com/chaincode/$contractName mychannel '{"Args":["init"]}'