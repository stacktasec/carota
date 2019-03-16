/* eslint-disable */

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function linkedToNetwork() {

  try {  

    const ccpPath = path.resolve(process.cwd(), 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    // Create a new file system based wallet for managing identities.
    const walletPath = path.resolve(process.cwd(), 'wallet');;
    console.log(walletPath)
    const wallet = new FileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.exists('user1');
    if (!userExists) {
      console.log('An identity for the user "user1" does not exist in the wallet');
      console.log('Run the registerUser.js application before retrying');
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: false } });

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork('mychannel');


    // Get the contract from the network.
    const contract = network.getContract('resource');

    // Evaluate the specified transaction.
    // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
    // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
    const result = await contract.evaluateTransaction('getAllUser');
    console.log('Transaction has been evaluated, result is:');
    const jr = JSON.parse(result.toString());
    for (let item of jr) {
        console.log(JSON.stringify(item))
    }
    
  } catch (error) {
    console.error(`Failed to evaluate transaction: ${error}`);
    process.exit(1);
  }
}

export default linkedToNetwork;
