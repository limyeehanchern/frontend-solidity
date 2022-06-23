const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
// Setting number of players
let numPlayers = 10;
const web3 = new Web3(ganache.provider({ total_accounts: numPlayers })); // Set number of accounts
const contractFile = require("../compile");
const abi = contractFile.abi;

let game;
let accounts;
const salt = "$@F#%!@@a!%x!@v#@N!#%!";

beforeEach(async function () {
  this.timeout(30000);
  accounts = await web3.eth.getAccounts();
  game = await new web3.eth.Contract(abi)
    .deploy({ data: contractFile.evm.bytecode.object })
    .send({ gas: "5000000", from: accounts[0] });
});

describe("Game Contract", function () {
  this.timeout(30000);
  it("deploys a contract", async () => {
    // Checks that contract is deployed
    assert.ok(game.options.address);
    const gm = await game.methods.gameMaster().call({ from: accounts[0] });

    // Check that gameMaster variable is correct
    console.log(gm);
    assert.equal(gm, accounts[0]);
  });

  it("allows one account to vote", async () => {
    // Hashing the player's address + vote (0,1) + secret salt
    commitHash = web3.utils.soliditySha3(
      { t: "address", v: accounts[0] },
      { t: "uint256", v: 0 },
      { t: "string", v: salt }
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
  });

  it("allows multiple accounts to enter with emergencyRepay", async () => {
    // For loop to submit votes of n players
    for (i = 0; i < numPlayers; i++) {
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
        { t: "string", v: salt }
      );
      await game.methods.vote(commitHash).send({
        from: accounts[i],
        value: web3.utils.toWei("10", "ether"),
      });

      // Assert that ether has been submitted
      const balance = async () => {
        const bal = await web3.eth.getBalance(accounts[i]);
        balanceEther = Math.round(web3.utils.fromWei(bal.toString(), "ether"));
        assert(balanceEther == 90);
      };

      await balance();
    }

    // Assert that players are pushed into players array in order
    let player;
    for (i = 0; i < numPlayers; i++) {
      player = await game.methods.players(i).call({ from: accounts[i] });
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
    const gettingBalance = async () => {
      for (i = 0; i < numPlayers; i++) {
        const balance = async () => {
          await web3.eth.getBalance(accounts[i]).then((bal) => {
            balanceEther = Math.round(
              web3.utils.fromWei(bal.toString(), "ether")
            );
            assert(balanceEther == 100);
          });
        };
        await balance();
      }
    };

    await gettingBalance();

    // Assert that no ether is left in the contract
    const balance = await web3.eth.getBalance(game.options.address);
    assert(balance, 0);
  });

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 200,
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("only manager can call winner & reveal function works", async () => {
    const votesArray = [];

    // For loop to submit votes of n players
    for (i = 0; i < numPlayers; i++) {
      // Randomise choices with biases towards option 1
      let choice;
      if (Math.random() < 0.3) {
        choice = 0;
      } else {
        choice = 1;
      }

      // Populating votesArray
      votesArray.push([accounts[i].toString(), choice, salt]);

      commitHash = web3.utils.soliditySha3(
        { t: "address", v: accounts[i] },
        { t: "uint256", v: choice },
        { t: "string", v: salt }
      );

      await game.methods.vote(commitHash).send({
        from: accounts[i],
        value: web3.utils.toWei("10", "ether"),
      });

      // Assert that ether has been submitted
      const balance = async () => {
        const bal = await web3.eth.getBalance(accounts[i]);
        balanceEther = Math.round(web3.utils.fromWei(bal.toString(), "ether"));
        assert(balanceEther == 90);
      };

      await balance();
    }

    // Assert that players are pushed into players array in order
    let player;
    for (i = 0; i < numPlayers; i++) {
      player = await game.methods.players(i).call({ from: accounts[i] });
      assert.equal(accounts[i], player);
    }

    // Assert that number of players are correct
    const playersNumber = await game.methods
      .getPlayersNumber()
      .call({ from: accounts[0] });
    assert.equal(playersNumber, 10);

    console.log(votesArray);

    // Manager calls reveal function
    await game.methods
      .reveal(votesArray)
      .send({ from: accounts[0], gas: 3000000 });

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
