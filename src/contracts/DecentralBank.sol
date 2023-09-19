pragma solidity ^0.5.0;

import './RWD.sol';
import './Tether.sol';

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    RWD public rwd;
    Tether public tether;

    address[] public stakers;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    // staking function
    function depositTokens(uint _amount) public {
        // Require staking amount to be greater than 0
        require(_amount > 0, 'Amount must be greater than 0');
        
        // Transfer tether tokens to this contract address for staking
        tether.transferFrom(msg.sender, address(this), _amount);

        // Update Staking Balance
        stakingBalance[msg.sender] += _amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    // unstaking function
    function unstakeTokens() public {
        require(isStaking[msg.sender], 'Must be staking');
        
        uint balance = stakingBalance[msg.sender];

        // Require staking amount to be greater than 0
        require(balance > 0, 'Amount must be greater than 0');

        // Transfer staking tokens to owner
        tether.transfer(msg.sender, balance);

        // Reset staking balance
        stakingBalance[msg.sender] = 0;

        // Update staking status
        isStaking[msg.sender] = false;
    }

    // Issue tokens to stakers
    function issueTokens() public {
        require(msg.sender == owner, 'Only owner can issue rewards');

        for (uint i = 0; i < stakers.length; i++) {
            address staker = stakers[i];
            uint balance = stakingBalance[staker] / 9;
            if (balance > 0) {
                rwd.transfer(staker, balance);
            }
        }
    }
}