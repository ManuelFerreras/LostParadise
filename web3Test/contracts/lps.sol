pragma solidity >= 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// "SPDX-License-Identifier: UNLICENSED"

// https://gist.github.com/6a542b0c0c9c8dbffc96f6f482d12f13

contract LPSToken is ERC20, Ownable {
    using SafeMath for uint256;
    
    string public tokenname = "Lost Paradise Token Test";
    string public tokensymbol = "LPST";
    uint8 public tokendecimals = 18;
    uint256 public totalTokenSupply = 100000000 * 10 ** tokendecimals;
    uint256 public earningsPoolTokenSupply = totalTokenSupply.div(100).mul(40);
    
    address payable rewardsPoolContract;
    
    address testAddress = 0x83D05B63aE85b5de69828B0412ff195f0CB3759A;
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    constructor(address _rewardsPoolContract) ERC20(tokenname, tokensymbol) {
        _setRewardsPoolContract(payable(_rewardsPoolContract));
        
        _mint(rewardsPoolContract, totalTokenSupply); // 100M
        _mint(testAddress, 100000 * 10 ** 18); // Testing
        _mint(0xD27b2CB449845Ab3f6608aDb9fa11ee98067d2A7, 100000 * 10 ** 18); // Testing
        _mint(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 100000 * 10 ** 18); // Testing
        _mint(0x10e7669e101532Fcb5FDa7D57597D3Ba8e0637ca, 100000 * 10 ** 18); // Testing
        _mint(0xeB2c640c6879B8B4d42c287dcdba44656E86C0DF, 100000 * 10 ** 18); // Testing

        _mint(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 100000 * 10 ** 18); // Testing
        _mint(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db, 100000 * 10 ** 18); // Testing
    }
    
    
    function _setRewardsPoolContract(address payable _rewardsPoolContract) private onlyOwner {
        rewardsPoolContract = _rewardsPoolContract;
    }
    
    
    function approveContract(address owner, address spender, uint256 amount) public returns (bool) {
        _approve(owner, spender, amount);
        return true;
    }
    
    function getTokenContract() public view returns (address) {
        return address(this);
    }
    
    function getTokendecimals() public view returns (uint256) {
        return tokendecimals;
    }

    
    
    

    receive() external payable {}
    
}