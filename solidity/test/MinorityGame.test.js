const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

// ABI and Bytecode
const contractFile = require("../compile");
const abi = contractFile.abi;
const contractBytecode = contractFile.evm.bytecode.object;
const testContractFile = require("../compile");
const testAbi = testContractFile.abi;
const testContractBytecode = testContractFile.evm.bytecode.object;

const SALT = "tzbp3kptks";
const UNIX = "1000000";
const UNIX_1 = "1000001";
const UNIX_2 = "1000002";
const NUM_PLAYERS = 10 + 1;
const TICKET_PRICE = 10000000000; // testing use 10000000000 gwei =  10 eth, actual use 10000000 gwei = 0.01 eth
let game;
let accounts;
let web3;

/**
 * Smart Contract Testing
 * 
 * @author limyeechern
 * @author limyeehan
 */

beforeEach(async function () {
  this.timeout(30000);
  web3 = new Web3(ganache.provider({ total_accounts: NUM_PLAYERS })); // Set number of accounts
  accounts = await web3.eth.getAccounts();
  game = await new web3.eth.Contract(abi)
    .deploy({
      data: contractBytecode,
      arguments: [TICKET_PRICE],
    })
    .send({ gas: "5000000", from: accounts[0] });
});

describe("Game Contract", function () {
  this.timeout(30000);
  it("deploys a contract", async () => {
    // Checks that contract is deployed
    assert.ok(game.options.address);
  });

  it("marks caller as gameMaster", async () => {
    const manager = await game.methods.gameMaster().call();
    assert.equal(manager, accounts[0]);
  });

  it("constructor argument well received", async () => {
    const tp = await game.methods.ticketPrice().call();
    assert.equal(tp, TICKET_PRICE);
  });

  it("test hasher()", async () => {
    // Hashing the player's address + vote (0,1) + unix + secret salt
    commitHash = web3.utils.soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "uint256", v: 0 },
      { t: "uint256", v: UNIX },
      { t: "string", v: SALT },
    );

    const hash = await game.methods.hasher(accounts[0], 0, UNIX, SALT).call();
    assert.equal(hash, commitHash);
  });

  it("allows one account to vote", async () => {
    const qidStart = await game.methods
      .Qid()
      .call();

    assert.equal(qidStart, 1);
    // Hashing the player's address + vote (0,1) + unix + secret salt
    commitHash = web3.utils.soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "uint256", v: 0 },
      { t: "uint256", v: UNIX },
      { t: "string", v: SALT }
    );
    // Sending vote with hashed
    await game.methods
      .vote(commitHash)
      .send({ from: accounts[0], value: web3.utils.toWei("10", "ether") });

    // First player equals to the first person to vote
    const player = await game.methods.players(0).call({ from: accounts[0] });
    assert.equal(accounts[0], player);

    // Total number of players is consistent
    const playersNumber = await game.methods
      .getPlayersNumber()
      .call({ from: accounts[0] });
    assert.equal(playersNumber, 1);

    // Check commitMap
    const bool = await game.methods
      .commitMap(commitHash)
      .call({ from: accounts[0] });
    assert.equal(bool, true);

    // Getting back the ethers from contract
    await game.methods
      .emergencyRepay()
      .send({ from: accounts[0], gas: 3000000 });

    const qidEnd = await game.methods
      .Qid()
      .call();
      
    // qid increasing by 1
    assert.equal(qidEnd, 2);
  });

  it("allows multiple accounts to enter with emergencyRepay", async () => {
    // For loop to submit votes of n players, excluding player 0 who is the manager
    for (i = 1; i < NUM_PLAYERS; i++) {
      // Randomise choices with biases towards option 1
      let choice;
      if (Math.random() < 0.3) {
        choice = 0;
      } else {
        choice = 1;
      }

      commitHash = web3.utils.soliditySha3(
        { t: "address", v: accounts[i] },
        { t: "uint256", v: choice },
        { t: "string", v: SALT },
        { t: "uint256", v: UNIX }
      );
      await game.methods.vote(commitHash).send({
        from: accounts[i],
        value: web3.utils.toWei("10", "ether"),
      });

      // Assert that ether has been submitted, rounding up to ignore gas fees
      const balance = async () => {
        const bal = await web3.eth.getBalance(accounts[i]);
        balanceEther = Math.round(web3.utils.fromWei(bal.toString(), "ether"));
        assert(balanceEther == 90);
      };

      await balance();
    }

    // Assert that players are pushed into players array in order
    let player;
    for (i = 1; i < NUM_PLAYERS; i++) {
      player = await game.methods.players(i - 1).call({ from: accounts[i] }); // i - 1 as index 0 of smart contract players array is index 1 of accounts array
      assert.equal(accounts[i], player);
    }

    // Assert that number of players are correct
    const playersNumber = await game.methods
      .getPlayersNumber()
      .call({ from: accounts[0] });
    assert.equal(playersNumber, 10);

    // Run emergencyRepay function
    await game.methods
      .emergencyRepay()
      .send({ from: accounts[0], gas: 3000000 });

    // Assert that all funds are returned less gas fees
    for (i = 1; i < NUM_PLAYERS; i++) {
      await web3.eth.getBalance(accounts[i]).then((bal) => {
        balanceEther = Math.round(
          web3.utils.fromWei(bal.toString(), "ether")
        );
        assert(balanceEther == 100);
      });
    }

    // Assert that no ether is left in the contract after emergencyRepay
    const balance = await web3.eth.getBalance(game.options.address);
    assert(balance, 0);
  });

  it("only manager can call winner & reveal function works", async () => {
    // Assert that qid is initialised to be 1
    const qidStart = await game.methods
      .Qid()
      .call();
    assert.equal(qidStart, 1);
    const votesArray = [];

    // Testing when the minority only has 3 people, which in this case it is 30% of the participants
    const MINORITY = 3
    // For loop to submit votes of n players, excluding player 0 who is the manager
    for (i = 1; i < NUM_PLAYERS; i++) {
      // players with index 1, 2, 3 to vote for 0 and the rest to vote for 1
      if (i <= MINORITY) {
        choice = 0;
      } else {
        choice = 1;
      }

      // Populating votesArray
      votesArray.push([accounts[i].toString(), choice, UNIX, SALT]);

      commitHash = web3.utils.soliditySha3(
        { t: "address", v: accounts[i] },
        { t: "uint256", v: choice },
        { t: "uint256", v: UNIX },
        { t: "string", v: SALT }
      );

      await game.methods.vote(commitHash).send({
        from: accounts[i],
        value: web3.utils.toWei("10", "ether"),
      });

      // Assert that ether has been submitted ignoring the gas fees by rounding
      const balance = async () => {
        const bal = await web3.eth.getBalance(accounts[i]);
        let balanceEther = Math.round(
          web3.utils.fromWei(bal.toString(), "ether")
        );
        assert(balanceEther === 90);
      };

      await balance();
    }

    // Assert that players are pushed into players array in order, excluding player 0 who is the manager
    let player;
    for (i = 1; i < NUM_PLAYERS; i++) {
      player = await game.methods.players(i - 1).call({ from: accounts[i] }); // i - 1 as index 0 of smart contract players array is index 1 of accounts array
      assert.equal(accounts[i], player);
    }

    // Assert that number of players are correct
    const playersNumber = await game.methods
      .getPlayersNumber()
      .call({ from: accounts[0] });
    assert.equal(playersNumber, 10);

    // Asserting that balance in smart contract is accurate before reveal
    beforeRevealBalance = await game.methods.getBalance().call()
    assert.equal(Math.round(
          web3.utils.fromWei(beforeRevealBalance.toString(), "ether")
        ), 10 * (NUM_PLAYERS - 1))
    

    // Manager calls reveal function
    await game.methods
      .reveal(votesArray)
      .send({ from: accounts[0], gas: 3000000 });

    
    // Assert that Qid is increased by 1
    const qidEnd = await game.methods
        .Qid()
        .call();
    assert.equal(qidEnd, 2);

    
    // Asserting that balance in smart contract is accurate after reveal
    afterRevealBalance = await game.methods.getBalance().call()
    roundedAfterRevealBalance = Math.round(
          web3.utils.fromWei(afterRevealBalance.toString(), "ether"))
        
    assert.equal(roundedAfterRevealBalance, 0)

    // Asserting that the gameMaster has received the commission, which in this case is 5 ether
    const commission = parseInt(web3.utils.fromWei((0.05 * beforeRevealBalance).toString(), "ether"))
    const gmBalance = await web3.eth.getBalance(accounts[0])
    roundedGmBalance = Math.round(
      web3.utils.fromWei(gmBalance.toString(), "ether"))
    assert.equal(roundedGmBalance, 100 + commission)

    // Asserting that the minority voting has won the correct amount 
    winnerProfit = parseInt(web3.utils.fromWei(((beforeRevealBalance - commission) / MINORITY).toString(), "ether"))
    for (j = 1; j <= MINORITY; j ++){
      const bal = await web3.eth.getBalance(accounts[j]);
      let finalBalance = Math.round(
        web3.utils.fromWei(bal.toString(), "ether")
      );
      difference = (90 + winnerProfit - finalBalance) <= 1;
      assert.equal(difference, true)
    }

    // Asserting that the majority voters do not win anything
    for (k = MINORITY + 1; k < NUM_PLAYERS; k++){
      const bal = await web3.eth.getBalance(accounts[k]);
      let finalBalance = Math.round(
        web3.utils.fromWei(bal.toString(), "ether")
      );
      assert.equal(finalBalance, 90)
    }
  });
});
