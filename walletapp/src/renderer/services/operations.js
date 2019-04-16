/* eslint-disable */

import { FileSystemWallet, Gateway } from 'fabric-network'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

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
    const walletPath = path.resolve(process.cwd(), 'wallet');;
    const wallet = new FileSystemWallet(walletPath);
    const gateway = new Gateway();
    const connectionProfile = yaml.safeLoad(fs.readFileSync('connection.yaml', 'utf8'));
    await gateway.connect(connectionProfile, { wallet, identity: user, discovery: { enabled: true } });
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
