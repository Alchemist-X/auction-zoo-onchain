# The Auction Zoo

[中文说明 / Chinese README](./README.zh.md)

Whereas auction formats were once loosely adopted for (and constrained by) the technical limits of blockchains, we’re now starting to see more novel designs adapted especially for blockchains.
This repository aims to help bridge the gap between auction theory and practice by showcasing Solidity auction implementations that demonstrate interesting theoretical properties or novel constructions.

How can theoretical principles inform implementation decisions?
And how can on-chain implementations, in turn, inform new directions of theoretical research? Though theory can guide us toward a certain auction design, a seemingly innocuous implementation detail itself may be interesting to analyze with a theoretical lens.

The auctions are implemented as single-item (ERC721) auctions, with bids denominated in ETH, though we encourage forking to add or change features, e.g. multi-unit auctions, ERC20 bids, different payment rules.

## Table of Contents
- [Contents](#contents)
- [Featured Auctions](#featured-auctions)
- [Accompanying Blog Posts](#accompanying-blog-posts)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Available Commands](#available-commands)
- [Usage](#usage)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Contents
- Sealed-bid auctions
  - [Overcollateralized Vickrey auction](./src/sealed-bid/over-collateralized-auction/OverCollateralizedAuction.sol) [[post](https://a16zcrypto.com/how-auction-theory-informs-implementations/)]
  - ["Sneaky" Vickrey auction](./src/sealed-bid/sneaky-auction/SneakyAuction.sol) [[post](https://a16zcrypto.com/hidden-in-plain-sight-a-sneaky-solidity-implementation-of-a-sealed-bid-auction/)]
  - [Aztec Connect Vickrey auction](./src/sealed-bid/aztec-connect-auction/AztecConnectAuction.sol) [[post](https://a16zcrypto.com/through-the-looking-glass-a-cross-chain-sealed-bid-auction-using-aztec-connect/)]

## Featured Auctions
The repository currently focuses on sealed-bid auctions that illustrate subtle implementation trade-offs:

- [Overcollateralized Vickrey auction](./src/sealed-bid/over-collateralized-auction/OverCollateralizedAuction.sol) – pairs a classic Vickrey auction with collateral requirements that mitigate griefing risks. [[Blog post](https://a16zcrypto.com/how-auction-theory-informs-implementations/)]
- ["Sneaky" Vickrey auction](./src/sealed-bid/sneaky-auction/SneakyAuction.sol) – demonstrates how carefully placed storage writes can leak sealed-bid information. [[Blog post](https://a16zcrypto.com/hidden-in-plain-sight-a-sneaky-solidity-implementation-of-a-sealed-bid-auction/)]
- [Aztec Connect Vickrey auction](./src/sealed-bid/aztec-connect-auction/AztecConnectAuction.sol) – bridges private bid submission from Aztec Connect into a transparent on-chain settlement. [[Blog post](https://a16zcrypto.com/through-the-looking-glass-a-cross-chain-sealed-bid-auction-using-aztec-connect/)]

Fork the project to explore additional designs such as Dutch auctions, English auctions, batch auctions, or novel settlement/payment flows.

## Accompanying Blog Posts
1. [On Paper to On-Chain: How Auction Theory Informs Implementations](https://a16zcrypto.com/how-auction-theory-informs-implementations/)
2. [Hidden in Plain Sight: A Sneaky Solidity Implementation of a Sealed-Bid Auction](https://a16zcrypto.com/hidden-in-plain-sight-a-sneaky-solidity-implementation-of-a-sealed-bid-auction/)
3. [Through the Looking Glass: A Cross-Chain Sealed-Bid Auction Using Aztec Connect](https://a16zcrypto.com/through-the-looking-glass-a-cross-chain-sealed-bid-auction-using-aztec-connect/)

## Project Structure
```text
├── src/
│   └── sealed-bid/
│       ├── aztec-connect-auction/        # Aztec Connect Vickrey auction contracts
│       ├── over-collateralized-auction/  # Overcollateralized Vickrey auction contracts
│       └── sneaky-auction/               # "Sneaky" Vickrey auction implementation
├── test/                                 # Foundry test suites for each auction
├── lib/                                  # External dependencies pulled in via forge
├── getBalanceProof.js                    # Utility script for generating Aztec balance proofs
├── foundry.toml                          # Foundry configuration
└── package.json                          # JavaScript dependencies and helper scripts
```

## Getting Started
### Prerequisites
- [Foundry](https://book.getfoundry.sh/getting-started/installation) (provides `forge` and `cast`)
- Node.js 18+ (for scripts such as `getBalanceProof.js`)

### Installation
Clone the repository and install dependencies:

```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Fetch Solidity dependencies
forge install

# Install JavaScript dependencies
npm install
```

If you already have Foundry set up, you can skip the installation step and simply run `forge install` to fetch contract dependencies.

### Available Commands
Use the following commands while developing or exploring the contracts:

```bash
# Compile all contracts
forge build

# Run the test suites
forge test

# Format Solidity code (requires `forge fmt`)
forge fmt

# Generate an Aztec balance proof (example usage)
node getBalanceProof.js --help
```

## Usage
Requires [Foundry](https://book.getfoundry.sh/getting-started/installation).

Install: `forge install`

Build: `forge build`

Test: `forge test`

## Development Notes
- Contracts target single-item ERC-721 auctions with ETH-denominated bids. Extend or adapt the patterns to suit ERC-1155 or ERC-20 use cases.
- Foundry tests live in the `test/` directory; add new scenarios alongside the auction you are modifying.
- When experimenting with alternative auction mechanisms, consider the gas, storage, and security implications of each theoretical tweak.

## Contributing
Contributions that extend the catalog of auction mechanisms, improve documentation, or refine tests are welcome. Please open an issue or pull request describing the proposed change.

## License
Distributed under the terms of the [MIT License](./LICENSE).

## Disclaimer
_These smart contracts are being provided as is. No guarantee, representation or warranty is being made, express or implied, as to the safety or correctness of the user interface or the smart contracts. They have not been audited and as such there can be no assurance they will work as intended, and users may experience delays, failures, errors, omissions or loss of transmitted information. THE SMART CONTRACTS CONTAINED HEREIN ARE FURNISHED AS IS, WHERE IS, WITH ALL FAULTS AND WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTY OF MERCHANTABILITY, NON- INFRINGEMENT OR FITNESS FOR ANY PARTICULAR PURPOSE. Further, use of any of these smart contracts may be restricted or prohibited under applicable law, including securities laws, and it is therefore strongly advised for you to contact a reputable attorney in any jurisdiction where these smart contracts may be accessible for any questions or concerns with respect thereto. Further, no information provided in this repo should be construed as investment advice or legal advice for any particular facts or circumstances, and is not meant to replace competent counsel. a16z is not liable for any use of the foregoing, and users should proceed with caution and use at their own risk. See a16z.com/disclosures for more info._
