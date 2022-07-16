# This repository consists of both solidity code folder and frontend code folder

## About The Project
### Motivation
This project is a portfolio project and we started this project mainly to gain experience in writing and testing a smart contract with Solidity. This project is a full-stack project and it is fully deployable. 

### Idea
The concept of this project is a simple game. There will be a question posted weekly with two polarising options. The goal of the participant is to identify the option that will have the minority votes and send in their vote. At the end of the week, the votes will be tallied and the total pool will be split equally among the participants who voted correctly (by being in the minority). Participants can send in as many votes as they wish but they have to keep in mind that their excess votes may tip the balance and result in themselves being the majority instead. 

### Gameplay
Weekly contentious question

![image](https://user-images.githubusercontent.com/66681646/179348828-fb6854d1-ee4b-4dac-aee6-feae766aacc8.png)

Submitting the vote and paying via Metamask

![image](https://user-images.githubusercontent.com/66681646/179348837-48661834-38fe-487b-8e2a-132225f4439c.png)

Submitted vote

![image](https://user-images.githubusercontent.com/66681646/179348845-526a82ae-aea4-451b-a0d7-377ebec80685.png)


Historical questions that users can play offline by scrolling down

![image](https://user-images.githubusercontent.com/66681646/179348854-8c2eb782-2a94-47c3-9018-00e196d41134.png)


Admin page
![image](https://user-images.githubusercontent.com/66681646/179348862-5d1651c1-0ea4-4fff-b631-f03cdc95e1b7.png)

## Technicalities of the project

### Why Eth
Other than the fact that we want to gain experience in writing Solidity smart contracts, we thought that using smart contracts would be a transparent method to distribute the winnings. By writing the complete game logic in the smart contract, participants are free to scrutinise the smart contract to ensure that the game is fair.

### Commit-Reveal (quite technical)
Due to the nature of smart contracts, in that even the private variables stored in the smart contracts are able to be retrieved and read, it will be impossible to maintain the secrecy of the votes during the game. The nature of the game is that we have to hide the votes until the reveal. This was an initial setback, but after much research, we applied the commit-reveal concept to our project. 

The commit-reveal solution includes the commit phase and the reveal phase. This commit-reveal solution ensures that the votes are kept secret during the gameplay with the commit phase, as well as ensuring the transparency of the game with the reveal phase. During the commit phase, which is the entire period of the week where the voting is carried out, the information of the votes are stored in the smart contract in a hashed form, which is mainly hashing the information of the user's wallet address + vote + timestamp + secret salt. This comprehensive hashing will ensure that other users will not be able to identify the raw information stored on the smart contract and cheat in the game. The commit phase also stores the information in a secured database. Therefore, information is stored on both the smart contract and the database. During the reveal phase, which can be called automatically (to be implemented with a scheduler), or can be called manually on the admin page, the data from the database is fetched and submitted to the smart contract in full. The reveal function in the smart contract will perform the same hashing on the raw reveal data and authenticate against the hashed form stored in it, much like how a password is authenticated. If there are any discrepancies, the emergencyRepay function is immediately called and the game is cancelled. Therefore, the reveal phase also allows other users to scrutinise and confirm that the game is played fairly.

<p align="right">(<a href="#top">back to top</a>)</p>


### Built With

This section should list any major frameworks/libraries used to bootstrap your project. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.

* [![Node][Node.js]]
* [![Express][Express.js]]
* [![React][React.js]]
* [![Solidity]]


<p align="right">(<a href="#top">back to top</a>)</p>


# Solidity

## Project Structure

The simple folder structure of the solidity is explained below:

node_modules/
contracts/
  Contract.sol
  TestContract.sol
 test/
  MinorityGame.test.js
 compile.js
 compileTestContract.js
 deploy.js
 package.json
 
 
## Available Scripts

In the project directory, you can run:

### `npm test`
Runs the test file MinorityGame.test.js 

## Contract details


# Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


## Project Structure

The folder structure of the frontend is explained below:

public
node_modules/
src/
  Components/
  API.js
  App.js
  Contract.js
  web3.js
package.json
  

## Additional
https://stackoverflow.com/questions/66952972/cannot-add-web3-to-react-project?rq=1
Refer above to fix BREAKING CHANGE problem when importing web3 to frontend



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.


### Installation

_Below is an example of how you can instruct your audience on installing and setting up your app. This template doesn't rely on any external dependencies or services._

1. Clone the repo
   ```sh
   git clone https://github.com/limyeehanchern/limmy.git
   ```
2. Install NPM packages in both frontend and solidity folders
   ```sh
   npm install
   ```
3. Compile and deploy the project
   ```sh
   cd solidity
   node compile.js
   node deploy.js
   ```
4. Copy the contract address on the console and change directory to frontend\src\Contract.js, paste the contract address in the file.

5. Start the frontend
   ```sh
   cd frontend
   npm start
   ```
6. Start the backend, refer to backend repo
   ```sh
   npm start
   ```

<p align="right">(<a href="#top">back to top</a>)</p>


<!-- CONTACT -->
## Contact

Yee Chern (Lucas) Lim - (https://www.linkedin.com/in/lucaslimyeechern/)

Yee Han Lim - (https://www.linkedin.com/in/limyeehan/)

<p align="right">(<a href="#top">back to top</a>)</p>


