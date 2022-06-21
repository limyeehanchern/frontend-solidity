const path = require("path");
const fs = require("fs-extra");
const solc = require("solc");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

const contractPath = path.resolve(__dirname, "contracts", "Contract.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: 'Solidity',
  sources: {
    'Contract.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
};


const output = JSON.parse(solc.compile(JSON.stringify(input)));
console.log("contractPath", contractPath)
console.log("output", output)

fs.ensureDirSync(buildPath);

for (let contract in output) {
  fs.outputJsonSync(
  path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
