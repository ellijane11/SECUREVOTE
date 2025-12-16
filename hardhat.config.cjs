// ✅ TOP of the file
require("@nomicfoundation/hardhat-toolbox");

// ✅ EXPORT at the bottom
module.exports = {
  solidity: "0.8.20",
  networks: {
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["0xcd4e7367f35790dda4f0b5ac0124adc32bcf1046bdb233bc6a2acced08b687ad"]
    }
  }
};
