require("dotenv").config();

const contractFile = require('./compile');
const abi = contractFile.abi;

const WALLET = process.env.DEV_WALLET;
const url = process.env.DEV_INFURA;

const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const provider = new HDWalletProvider(WALLET, url);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
        .deploy({data: contractFile.evm.bytecode.object})
        .send({gas: '5000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
    provider.engine.stop();
};
deploy();
