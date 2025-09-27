# 🎮 Chain Play Arcade

### A decentralized, competitive gaming platform combining on-chain logic, staking mechanics, and AI-powered post-match analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Foundry](https://img.shields.io/badge/Foundry-000000?style=for-the-badge&logo=foundry&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

Chain Play Arcade is a blockchain-native gaming ecosystem where players can compete in skill-based tournaments for real rewards. The platform leverages smart contracts for transparent and trustless event management, prize distribution, and game logic.

---

## 📖 Table of Contents

- [About The Project](#about-the-project)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## About The Project

We’re building a complete ecosystem for competitive gaming on the blockchain. Our platform is designed to be transparent, secure, and engaging for both event organizers and players.

Here’s the core gameplay loop:

1.  **Admin Portal**: Event organizers use a dedicated admin interface to create and define new games and tournaments directly on the blockchain. They can configure crucial parameters like prize pools, minimum stake amounts, and event durations through our `GameHub` and `GameFactory` smart contracts.

2.  **Player Dashboard**: Players can browse a list of active tournaments, view their details, and stake tokens to join the competition.

3.  **Unique Gameplay**: Our first featured game is a unique **4x4 Tic-Tac-Toe variant**. To win, a player must align 4 of their marks in a row, column, or diagonal. The twist? **Every 4th turn, your move from 4 turns prior is erased**. This dynamic rule prevents draws and encourages strategic, forward-thinking play.

4.  **AI Post-Match Analysis**: After each match, a comprehensive result sheet is generated (total moves, time played, move history). This data is fed to an autonomous AI agent hosted on **AgentVerse**, which provides a strategic analysis of the game, offering insights on how players could have improved their performance.

5.  **Automated Rewards**: When a tournament's duration ends, the smart contract automatically calculates the final leaderboard and distributes the prize pool to the top-performing players. No manual intervention is required.



---

## ✨ Key Features

-   **Decentralized Game & Tournament Creation**: Admins can launch new competitive events on-chain.
-   **On-Chain Staking & Prize Pools**: Securely manage entry fees and prize money using smart contracts.
-   **Provably Fair Gameplay**: Game logic is executed on-chain for maximum transparency.
-   **AI-Powered Strategic Analysis**: Get personalized feedback on your gameplay from an AI coach.
-   **Automated, Trustless Payouts**: Winners are rewarded automatically from the prize pool.
-   **Modern Web Interface**: A sleek and responsive frontend built with Next.js and shadcn/ui.

---

## 🛠️ Tech Stack

This project is a full-stack dApp with three main components:

-   **Blockchain (Smart Contracts)**
    -   **Solidity**: For writing the smart contracts.
    -   **Foundry**: For compiling, testing, and deploying contracts.
    -   **OpenZeppelin**: For secure, community-vetted contract standards (implied).

-   **Frontend**
    -   **Next.js**: React framework for the user interface.
    -   **TypeScript**: For type-safe code.
    -   **Wagmi & Ethers.js**: For interacting with the blockchain (wallet connection, contract calls).
    -   **Tailwind CSS & shadcn/ui**: For styling and UI components.

-   **Backend**
    -   **Node.js & Express.js**: For handling off-chain logic, such as managing game sessions and communicating with the AI agent.

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed on your machine:
-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Git](https://git-scm.com/)
-   [Foundry](https://getfoundry.sh/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/blockvished/chain-play-arcade.git](https://github.com/blockvished/chain-play-arcade.git)
    cd chain-play-arcade
    ```

2.  **Set up the Smart Contracts:**
    ```sh
    cd smart_contracts
    forge install
    forge build
    ```

3.  **Set up the Backend:**
    ```sh
    cd ../backend
    npm install
    ```

4.  **Set up the Frontend:**
    ```sh
    cd ../frontend
    npm install
    ```

5.  **Create Environment Variables:**
    Create a `.env.local` file in the `frontend` directory and add the necessary environment variables.
    ```env
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"
    NEXT_PUBLIC_ALCHEMY_API_KEY="YOUR_ALCHEMY_API_KEY"
    # Add other contract addresses and backend API URLs as needed
    ```

---

##  How to Run Project

1.  **Start a local node (optional, for testing):**
    Open a terminal and run:
    ```sh
    anvil
    ```

2.  **Deploy the Smart Contracts:**
    In the `smart_contracts` directory, deploy your contracts using a Foundry script. Update the script with your desired parameters first.
    ```sh
    cd smart_contracts
    forge script script/GameHub.s.sol --rpc-url <YOUR_RPC_URL> --private-key <YOUR_PRIVATE_KEY> --broadcast
    ```

3.  **Run the Backend Server:**
    In a new terminal, navigate to the `backend` directory and start the server.
    ```sh
    cd backend
    npm run start # Or your dev script
    ```

4.  **Run the Frontend Application:**
    In another terminal, navigate to the `frontend` directory and start the development server.
    ```sh
    cd frontend
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
