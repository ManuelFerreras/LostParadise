pragma solidity >=0.8.0;

import "Ownable.sol";
import "ReentrancyGuard.sol";
import "ERC721.sol";
import "ERC20.sol";
import "SafeMath.sol";
import "Strings.sol";
import "lps.sol";

// SPDX-License-Identifier: MIT

contract BuildingsContract is Ownable, ReentrancyGuard, ERC721 {
    using SafeMath for uint256;
    using Strings for uint256;
    using Strings for string;

    event NewBuilding(uint buildingId, string typeOfBuilding, uint income);

    string internal _baseTokenURI;
    
    uint dnaDigits = 4;
    uint dnaModulus = 10 ** dnaDigits;
    uint cooldownTime = 60 seconds;
    uint maxBuildingLevel = 20;
    uint baseLevelUpFee = 90;
    uint256 mintBuildingPrice;
    uint256 mintSlotPrice;
    uint256 combineBuildingPrice;
    uint256 mod;
    
    LPSToken public currency;
    uint256 decimals;
    
    struct Building {
        uint dna;
        uint income;
        uint finishTime;
        uint startTime;
        uint maxStorage;
        uint level;
        bool used;
        string rareness;
        string typeOfBuilding;
    }
    
    struct Slot {
        string typeOfSlot;
        bool used;
    }
    
    Building[] internal buildings;
    Slot[] internal slots;
    
    mapping (uint => address) public buildingToOwner; // Returns Owner Asigned To Building. 
    mapping (address => uint) ownerBuildingCount;
    mapping (uint => address) internal slotToOwner; // Returns Owner Asigned To Slot.
    mapping (uint => uint) public buildingToSlot; // Returns Slot Asigned To Building.
    mapping (uint => uint) public slotToBuilding; // Returns Building Asigned To Slot.
    mapping (address => uint) internal slotsOwnerCount;
    
    constructor(string memory _baseUri) ERC721('Lost Paradise Buildings', 'LPSB') {
        currency = new LPSToken(address(this), 10000000);
        decimals = currency.getTokendecimals();

        _baseTokenURI = _baseUri;
    }

    
    modifier onlyOwnerOfBuilding(uint buildingId_) {
        require(msg.sender == buildingToOwner[buildingId_]);
        _;
    }
    
    modifier onlyOwnerOfSlot(uint slotId_) {
        require(msg.sender == slotToOwner[slotId_]);
        _;
    }
    
    // Mints a New Building and Sends it To Owner
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _mintSlot(string memory type_) internal {
        slots.push(Slot(type_, false));
        slotToOwner[slots.length - 1] = msg.sender;
        slotsOwnerCount[msg.sender] = slotsOwnerCount[msg.sender].add(1);
    }
    
    // Mints a New Building and Sends it To Owner
    function _mintBuilding(string memory rareness_, uint256 dna_, uint256 production_, uint256 storage_, string memory typeOfBuilding_) internal {
        buildings.push(Building(dna_, production_, 1 minutes, 0, storage_, 1, false, rareness_, typeOfBuilding_));
        uint256 id = buildings.length - 1;
        buildingToOwner[id] = msg.sender;
        ownerBuildingCount[msg.sender] = ownerBuildingCount[msg.sender].add(1);
    }
    

    // Sets a New Module.
    function setModule(uint256 newModule_) public onlyOwner{
      mod = newModule_;
    }
    
    // Sets a New Building Minting Price.
    function setBuildingMintingPrice(uint256 newPrice_) public onlyOwner {
      mintBuildingPrice = newPrice_;
    }
    
    // Sets a New Slot Minting Price.
    function setSlotMintingPrice(uint256 newPrice_) public onlyOwner {
      mintSlotPrice = newPrice_;
    }
}