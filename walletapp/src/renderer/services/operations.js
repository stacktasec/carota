/* eslint-disable */

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');

function discoveryWallet() {

  try {
    const walletPath = path.resolve(process.cwd(), 'wallet');;
    const childDirs = fs.readdirSync(walletPath)
    return childDirs[0];

  } catch (error) {
    return '';
  }
}

async function connectToFabric(user) {
  try {
    const ccpPath = path.resolve(process.cwd(), 'connection.json');
    const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpJSON);
    const walletPath = path.resolve(process.cwd(), 'wallet');;
    const wallet = new FileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });
    return true;
  } catch (error) {
    return false;
  }
}

export { discoveryWallet, connectToFabric };
