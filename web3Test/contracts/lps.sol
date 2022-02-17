pragma solidity >= 0.8.0;
// SPDX-License-Identifier: MIT


import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
 

contract LPSToken is ERC20, Ownable {
    using SafeMath for uint256;
     
    string public tokenname = "Lost Paradise Token";
    string public tokensymbol = "LPS";
    uint8 public tokendecimals = 18;
    uint256 public totalTokenSupply = 1000000000 * 10 ** 18;
  
    address public admin;

    address private _rewardsVaultAddress = 0x5e7E506cc235aa66bBCb0C977045f464FC6694C7;
    address private _publicSaleAddress = 0x25C20C94A0020E34E99e1EF5Dc8B0150bf145649;
    address private _privateSaleAddress = 0xDd7DaB7476D68386941d50E020Ac5b8fD2E660c9; // ICO contract
    address private _fundingAddress = 0xeE37f9700E3E15FA65657cBC46F4d53CD291BFf3;

    uint public tokensForOwnersLeft;
    uint public lastTeamTokensClaim;
    uint public tokensGivenToOwnersPerClaim;
    
    
    constructor() ERC20(tokenname, tokensymbol) {
        
        _mint(address(this), totalTokenSupply.mul(25).div(1000));

        _mint(_rewardsVaultAddress, totalTokenSupply.mul(80).div(100)); // 80%
        _mint(_publicSaleAddress, totalTokenSupply.div(10)); // 10%
        _mint(_privateSaleAddress, totalTokenSupply.div(20)); // 5%
        _mint(_fundingAddress, totalTokenSupply.div(40)); // 2.5%

        tokensForOwnersLeft = balanceOf(address(this)); // 2.5%
        tokensGivenToOwnersPerClaim = balanceOf(address(this)) / 12;
        
        admin = msg.sender;
        lastTeamTokensClaim = 4 weeks;

    }

    event tokensWithdrawnedForOwners(uint);

    function withdrawTeamTokens() public {
        require(msg.sender == admin, "Only the Owner");
        require(block.timestamp - lastTeamTokensClaim > 4 weeks, "Have to wait 1 month to claim again.");
        require(tokensForOwnersLeft > 0, "No tokens Left");

        lastTeamTokensClaim = block.timestamp;
        if(balanceOf(address(this)) > 0 && balanceOf(address(this)) < tokensGivenToOwnersPerClaim) {
            _transfer(address(this), msg.sender, balanceOf(address(this)));
        } else {
            _transfer(address(this), msg.sender, tokensGivenToOwnersPerClaim);
        }
        tokensForOwnersLeft = balanceOf(address(this));

        emit tokensWithdrawnedForOwners(block.timestamp);
    }

    receive() external payable {}
    
}