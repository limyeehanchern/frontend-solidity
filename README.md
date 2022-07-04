# This repository consists of both solidity code folder and frontend code folder

# Solidity

## Project Structure

The simple folder structure of the solidity is explained below:

| Name                           | Description                                          |
| ------------------------------ | ---------------------------------------------------- | --- | ------------------------------------ |
| **node_modules**               | #TODO                                                |
| **contracts**                  | #TODO                                                |
| **contracts/Contract.sol**     | #TODO                                                |
| **contracts/TestContract.sol** | #TODO                                                |
| **test/ MinorityGame.test.js** | #TODO                                                |
| **compile.js**                 | #TODO                                                |
| **compileTetContract.js**      | #TODO                                                |
| **deploy.js**                  | #TODO                                                |
| package.json                   | Contains npm dependencies as well as [build scripts] | t   | Config settings for compiling source |

# Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

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

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## Project Structure

The folder structure of the frontend is explained below:

| Name               | Description                                                                          |
| ------------------ | ------------------------------------------------------------------------------------ | --- | ------------------------------------ |
| **public**         | Contains all the different API endpoints                                             |
| **node_modules**   | Contains all npm dependencies                                                        |
| **src**            | Contains API endpoints for admin functions                                           |
| **src/Components** | Containsall the components used on the webpage                                       |
| **src/ API**       | Contains all functions to call API                                                   |
| **src/App**        | Contains main App component to be rendered                                           |
| **src/Contract**   | Contains the ABI and address of the smart contract deployed on Rinkeyby test network |
| **src/web3**       | Exports web3 object                                                                  |
| package.json       | Contains npm dependencies as well as [build scripts]                                 | t   | Config settings for compiling source |

### Frontend

https://stackoverflow.com/questions/66952972/cannot-add-web3-to-react-project?rq=1
Refer above to fix BREAKING CHANGE problem when importing web3 to frontend
