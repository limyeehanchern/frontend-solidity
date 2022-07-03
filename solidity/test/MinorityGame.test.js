const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

// ABI and Bytecode
const contractFile = require("../compile");
const abi = contractFile.abi;
const contractBytecode = contractFile.evm.bytecode.object;

const testContractFile = require("../compile");
const { type } = require("mocha/lib/utils");
const testAbi = testContractFile.abi;
const testContractBytecode = testContractFile.evm.bytecode.object;

// Test parameters
// const SALT = "123";
const SALT = "tzbp3kptks";
const UNIX = "1000000";
const UNIX_1 = "1000001";
const UNIX_2 = "1000002";
const NUM_PLAYERS = 10;
const TICKET_PRICE = 10000000000; // testing use 10000000000 gwei =  10 eth, actual use 10000000 gwei = 0.01 eth
let game;
let accounts;
const web3 = new Web3(ganache.provider({ total_accounts: NUM_PLAYERS })); // Set number of accounts

beforeEach(async function () {
  this.timeout(30000);
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
    // Hashing the player's address + vote (0,1) + secret salt + unix
    commitHash = web3.utils.soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "uint256", v: 0 },
      { t: "uint256", v: UNIX },
      { t: "string", v: SALT }
    );

    const hash = await game.methods.hasher(accounts[0], 0, UNIX, SALT).call();
    assert.equal(hash, commitHash);
  });

  it("tests vote() and emergencyRepay() for 1 account", async () => {
    const qidStart = await game.methods.Qid().call();

    assert.equal(qidStart, 1);
    // Hashing the player's address + vote (0,1) + unix + secret salt
    commitHash = web3.utils.soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "uint256", v: 0 },
      { t: "uint256", v: UNIX },
      { t: "string", v: SALT }
    );
    // Call Vote(), passing in Hash
    await game.methods
      .vote(commitHash)
      .send({ from: accounts[0], value: web3.utils.toWei("10", "ether") });

    // Assert that ether has been submitted
    await (async () => {
      const bal = await web3.eth.getBalance(accounts[0]);
      balanceEther = Math.round(web3.utils.fromWei(bal.toString(), "ether"));
      assert.equal(balanceEther, 90);
    })();

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

    // Assert ether is repaid
    await (async () => {
      const bal = await web3.eth.getBalance(accounts[0]);
      balanceEther = Math.round(web3.utils.fromWei(bal.toString(), "ether"));
      assert.equal(balanceEther, 100);
    })();

    // Assert question increment
    const qidEnd = await game.methods.Qid().call();
    assert.equal(qidEnd, 2);
  });

  it("tests vote() and emergencyRepay() for MULTIPLE accounts", async () => {
    // Call Vote() for each NUM_PLAYERS
    for (i = 0; i < NUM_PLAYERS; i++) {
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

      // Assert that ether has been submitted for each player
      await (async () => {
        const bal = await web3.eth.getBalance(accounts[i]);
        balanceEther = Math.round(web3.utils.fromWei(bal.toString(), "ether"));
        assert.equal(balanceEther, 90);
      })();
    }

    // Assert that players are pushed into players array in order
    for (i = 0; i < NUM_PLAYERS; i++) {
      let player = await game.methods.players(i).call({ from: accounts[i] });
      assert.equal(accounts[i], player);
    }

    // Assert that number of players are correct
    const playersNumber = await game.methods
      .getPlayersNumber()
      .call({ from: accounts[0] });
    assert.equal(playersNumber, 10);

    // Run emergencyRepay function, note that it is .send() and not .call()
    await game.methods
      .emergencyRepay()
      .send({ from: accounts[0], gas: 3000000 });

    // Assert that all funds are returned less gas fees
    for (i = 0; i < NUM_PLAYERS; i++) {
      // Assert ether is repaid
      await (async () => {
        const bal = await web3.eth.getBalance(accounts[i]);
        let balanceEther = Math.round(
          web3.utils.fromWei(bal.toString(), "ether")
        );
        assert.equal(balanceEther, 100);
      })();
    }

    // Assert that no ether is left in the contract
    const balance = await web3.eth.getBalance(game.options.address);
    assert(balance, 0);

    // Assert question increment
    const qidEnd = await game.methods.Qid().call();
    assert.equal(qidEnd, 2);
  });

  it("test onlyGameMaster function modifier for emergencyRepay(), reveal()", async () => {
    try {
      await game.methods
        .emergencyRepay()
        .send({ from: accounts[1], gas: 3000000 });

      assert(false);
    } catch (err) {
      assert(err);
    }

    try {
      await game.methods.reveal().send({ from: accounts[1], gas: 3000000 });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("test reveal()", async () => {
    // Assert that qid is initialised to be 1
    const qidStart = await game.methods.Qid().call();
    assert.equal(qidStart, 1);
    const votesArray = [];

    // For loop to submit votes of n players
    for (i = 0; i < NUM_PLAYERS; i++) {
      // Randomise choices with biases towards option 1
      let choice;
      if (Math.random() < 0.3) {
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

      // Assert that ether has been submitted
      await (async () => {
        const bal = await web3.eth.getBalance(accounts[i]);
        let balanceEther = Math.round(
          web3.utils.fromWei(bal.toString(), "ether")
        );
        assert.equal(balanceEther, 90);
      })();
    }

    // Assert that players are pushed into players array in order
    let player;
    for (i = 0; i < NUM_PLAYERS; i++) {
      player = await game.methods.players(i).call({ from: accounts[i] });
      assert.equal(accounts[i], player);
    }

    // Assert that number of players are correct
    const playersNumber = await game.methods
      .getPlayersNumber()
      .call({ from: accounts[0] });
    assert.equal(playersNumber, 10);

    // console.log(votesArray);

    // Manager calls reveal function
    await game.methods
      .reveal(votesArray)
      .send({ from: accounts[0], gas: 3000000 });

    // Assert that Qid is increased by 1
    const qidEnd = await game.methods.Qid().call();
    assert.equal(qidEnd, 2);

    // #TODO @YEEHAN
    // Complete the rest of the test for the reveal function, ensure
    // that the money is correctly given out to the winners accounted for
    // commission etc, ensure that the contract does not have any money too
  });

  // it("sends money to the winner and resets the players array", async () => {
  //   await lottery.methods.enter().send({
  //     from: accounts[0],
  //     value: web3.utils.toWei("2", "ether"),
  //   });

  //   const initialBalance = await web3.eth.getBalance(accounts[0]);
  //   await lottery.methods.pickWinner().send({ from: accounts[0] });

  //   const finalBalance = await web3.eth.getBalance(accounts[0]);

  //   const difference = finalBalance - initialBalance;
  //   differenceEther = Math.round(
  //     web3.utils.fromWei(difference.toString(), "ether")
  //   );
  //   assert(differenceEther == 2);
  // });
});
