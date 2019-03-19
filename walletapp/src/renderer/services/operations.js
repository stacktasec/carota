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
    return new WalletService(gateway);
  } catch (error) {
    return null;
  }
}

class WalletService {
  constructor(gateway) {
    this.gateway = gateway;
  }

  async evaluateContract(channelId, contractId, funcName, ...args) {
    const network = await this.gateway.getNetwork(channelId);
    const contract = network.getContract(contractId);
    const result = await contract.evaluateTransaction(funcName, ...args);
    return JSON.parse(result.toString())
  }

  async submitContract(channelId, contractId, funcName, ...args) {
    const network = await this.gateway.getNetwork(channelId);
    const contract = network.getContract(contractId);
    await contract.submitTransaction(funcName, ...args);
  }
}


export { discoveryWallet, connectToFabric, WalletService };
