// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract Voting {
    mapping(bytes32 => bool) public usedTokens;
    mapping(string => uint256) public votes;

    function vote(string memory candidate, bytes32 token) public {
        require(!usedTokens[token], "Already voted");
        usedTokens[token] = true;
        votes[candidate]++;
    }
}
