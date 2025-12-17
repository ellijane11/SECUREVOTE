// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Voting {
    mapping(address => bool) public hasVoted;
    mapping(uint256 => uint256) public votes;
    uint256[] public candidates;
    
    address public admin;
    
    constructor() {
        admin = msg.sender;
        candidates = [1, 2, 3, 4, 5]; // 5 candidates
    }
    
    function vote(uint256 candidateId) external {
        require(!hasVoted[msg.sender], "Already voted");
        require(candidateId < candidates.length, "Invalid candidate");
        hasVoted[msg.sender] = true;
        votes[candidateId]++;
    }
    
    function getResults() external view returns (uint256[] memory) {
        uint256[] memory results = new uint256[](candidates.length);
        for (uint i = 0; i < candidates.length; i++) {
            results[i] = votes[candidates[i]];
        }
        return results;
    }
}
