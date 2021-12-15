pragma solidity >= 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// "SPDX-License-Identifier: UNLICENSED"

contract LPSToken is ERC20, Ownable {
    using SafeMath for uint256;
    
    string public tokenname = "Lost Paradise Token Test";
    string public tokensymbol = "LPST";
    uint8 public tokendecimals = 18;
    uint256 public totalTokenSupply = 100000000 * 10 ** tokendecimals;
    uint256 public earningsPoolTokenSupply = totalTokenSupply.div(100).mul(40);
    uint256 public availableTokensICO;
    
    address public admin;
    address payable rewardsPoolContract;
    
    address testAddress = 0x83D05B63aE85b5de69828B0412ff195f0CB3759A;
    
    mapping(address => uint256) balances;
    mapping(address => mapping (address => uint256)) allowed;
    
    constructor(address _rewardsPoolContract, uint256 _availableTokensICO) ERC20(tokenname, tokensymbol) {
        _setRewardsPoolContract(payable(_rewardsPoolContract));
        
        _mint(rewardsPoolContract, totalTokenSupply); // 100M
        _mint(testAddress, 100000 * 10 ** 18); // Testing
        _mint(0xD27b2CB449845Ab3f6608aDb9fa11ee98067d2A7, 100000 * 10 ** 18); // Testing
        _mint(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4, 100000 * 10 ** 18); // Testing
        _mint(0x10e7669e101532Fcb5FDa7D57597D3Ba8e0637ca, 100000 * 10 ** 18); // Testing
        _mint(0xeB2c640c6879B8B4d42c287dcdba44656E86C0DF, 100000 * 10 ** 18); // Testing

        _mint(0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2, 100000 * 10 ** 18); // Testing
        _mint(0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db, 100000 * 10 ** 18); // Testing

        _mint(address(this), availableTokensICO * 10 ** 18); // ICO

        admin = msg.sender;

        availableTokensICO = _availableTokensICO * 10 ** 18;
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
    
    
    function start(
        uint duration,
        uint _price,
        uint _minPurchase,
        uint _maxPurchase)
        external
        onlyAdmin() 
        icoNotActive() {
        require(duration > 0, 'duration should be > 0');
        require(_minPurchase > 0 && _minPurchase < _maxPurchase, '_minPurchase should be > 0 and < _maxPurchase');
        require(_maxPurchase > 0 && _maxPurchase.mul(10**18) <= availableTokensICO, '_maxPurchase should be > 0 and <= availableTokensICO');
        end = duration + block.timestamp; 
        price = _price;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        released = false;
    }
    
    function buy()
        payable
        external
        icoActive() {
        require(msg.value % price == 0, 'have to send a multiple of price');
        require(msg.value >= (minPurchase.mul(price)) && msg.value <= (maxPurchase.mul(price)), 'have to send between minPurchase and maxPurchase');
        uint quantity = msg.value.div(price).mul(10**18);
        require(quantity <= availableTokensICO, 'Not enough tokens left for sale');
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
            transfer(sale.investor, sale.quantity);
        }

        released = true;
    }
    
    function withdraw(
        uint amount)
        external
        onlyAdmin()
        icoEnded()
        tokensReleased() {
        payable(msg.sender).transfer(amount);    
    }
    
    modifier icoActive() {
        require(end > 0 && block.timestamp < end && availableTokensICO > 0, "ICO must be active");
        _;
    }
    
    modifier icoNotActive() {
        require(end == 0, 'ICO should not be active');
        _;
    }
    
    modifier icoEnded() {
        require(end > 0 && (block.timestamp >= end || availableTokensICO == 0), 'ICO must have ended');
        _;
    }
    
    modifier tokensNotReleased() {
        require(released == false, 'Tokens must NOT have been released');
        _;
    }
    
    modifier tokensReleased() {
        require(released == true, 'Tokens must have been released');
        _;
    }
    
    modifier onlyAdmin() {
        require(msg.sender == admin, 'only admin');
        _;
    }
    
}