pragma solidity ^0.8.0;
// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract LPSIco {
    using SafeMath for uint;

    uint public whitelistedAmount = 0;

    address private admin;
    ERC20 private _LPSToken;

    mapping (address => bool) whiteListed;

    receive() external payable {}

    constructor() {
        admin = msg.sender;
    }

    function setToken(address _tokenAddress) public onlyAdmin {

        _LPSToken = ERC20(_tokenAddress);

    }


    // ------- ICO -------
    struct Sale {
        address investor;
        uint quantity;
    }

    Sale[] public sales;

    uint public end;
    uint public price;
    uint public minPurchase;
    uint public maxPurchase;
    bool public released;
    uint public tokensLeft;

    uint public whitelistStartTime;
    uint public whitelistDuration;
    
    
    function startIco(
        uint duration,
        uint _price, // In WEI
        uint _minPurchase, // Amount of min tokens
        uint _maxPurchase) // // Amount of max tokens
        external
        onlyAdmin() 
        icoNotActive() {
        require(duration > 0, "duration should be > 0");
        require(_minPurchase > 0 && _minPurchase < _maxPurchase, "_minPurchase should be > 0 and < _maxPurchase");
        require(_maxPurchase > 0 && _maxPurchase.mul(10**18) <= _LPSToken.balanceOf(address(this)), "_maxPurchase should be > 0 and <= _LPSToken.balanceOf(address(this))");
        end = duration + block.timestamp; 
        price = _price;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        released = false;
        tokensLeft = _LPSToken.balanceOf(address(this));
    }
    
    function buy() payable external icoActive whitelisted {

        require(msg.value % price == 0, "have to send a multiple of price");
        require(msg.value >= (minPurchase.mul(price)) && msg.value <= (maxPurchase.mul(price)), "have to send between minPurchase and maxPurchase");
        uint quantity = msg.value.div(price).mul(10**18);
        require(quantity <= tokensLeft, "Not enough tokens left for sale");

        tokensLeft -= quantity;

        whiteListed[msg.sender] = false;

        sales.push(Sale(
            msg.sender,
            quantity
        ));

    }
    
    function release()
        external
        onlyAdmin()
        icoEnded()
        tokensNotReleased() {

        for(uint i = 0; i < sales.length; i++) {
            Sale storage sale = sales[i];
            _LPSToken.transfer(sale.investor, sale.quantity);
        }

        released = true;
    }

    function startWhitelist(uint256 _duration) public onlyAdmin {
        whitelistStartTime = block.timestamp;
        whitelistDuration = _duration;
    }

    function whitelistAccount() public ongoingWhitelist {
        require(whiteListed[msg.sender] == false, "Already Whitelisted.");

        whitelistedAmount ++;
        whiteListed[msg.sender] = true;
    }
    
    function withdraw() external onlyAdmin icoEnded tokensReleased {
        payable(msg.sender).transfer(payable(address(this)).balance);    
    }

    function getWhitelistLeftTime() public view returns(uint) {
        if((whitelistDuration + whitelistStartTime) < block.timestamp) {
            return 0;
        } else {
            return (whitelistDuration + whitelistStartTime) - block.timestamp;
        }
    }

    modifier ongoingWhitelist() {
        require(whitelistStartTime > 0 && whitelistStartTime + whitelistDuration >= block.timestamp);

        _;
    }

    modifier whitelisted() {
        require(whiteListed[msg.sender], "Not in whitelist");

        _;
    }
    
    modifier icoActive() {
        require(end > 0 && block.timestamp < end && _LPSToken.balanceOf(address(this)) > 0, "ICO must be active");
        _;
    }
    
    modifier icoNotActive() {
        require(end == 0, "ICO should not be active");
        _;
    }
    
    modifier icoEnded() {
        require(end > 0 && (block.timestamp >= end || _LPSToken.balanceOf(address(this)) == 0), "ICO must have ended");
        _;
    }
    
    modifier tokensNotReleased() {
        require(released == false, "Tokens must NOT have been released");
        _;
    }
    
    modifier tokensReleased() {
        require(released == true, "Tokens must have been released");
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin");
        _;
    }

}