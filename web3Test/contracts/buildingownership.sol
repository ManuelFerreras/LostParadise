pragma solidity >=0.8.0;

import "./buildingusage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";


// SPDX-License-Identifier: UNLICENSED

contract buildingOwnerShip is BuildingUsage, ERC721 {

  using SafeMath for uint256;
  using Strings for uint256;
  
  uint256 allowance = 10 ** 36;
  address payable contractOwner;

  constructor(uint256 mintBuildingPrice_, uint256 mintSlotPrice_) ERC721 ("Lost Paradise Building", "LPSB") {
      mod = 4;
      contractOwner = payable(msg.sender);
      
      mintBuildingPrice = mintBuildingPrice_ * 10 ** decimals;
      mintSlotPrice = mintSlotPrice_ * 10 ** decimals;
      
      currency.approveContract(address(this), address(this), allowance);
  }

  mapping (uint => address) buildingapprovals;
  
  // Approves currency Allowance.
  function approveCurrencyUsage() public {
      currency.approveContract(msg.sender, address(this), allowance);
  }
  
  // Returns Currency Allowance.
  function getAccountCurrencyAllowance() public view returns(uint256) {
      return currency.allowance(msg.sender, address(this));
  }
  
  
  // Mints a Random Building Charging a Fee.
  function mintRandomBuilding() public payable {
    require(currency.balanceOf(msg.sender) >= mintBuildingPrice);
    currency.transferFrom(msg.sender, address(this), mintBuildingPrice);
    
    uint256 dna_;
    uint256 door_;
    uint256 basement_;
    uint256 body_;
    uint256 ceiling_;
    
    string memory type_;

    (dna_, door_, basement_, body_, ceiling_, type_)  = _randDna(mod);
    string memory rareness_ = _randRareness();

    
    (uint256 production_, uint256 storage_) = _createStorProd(rareness_, [door_, basement_, body_, ceiling_]);
    
    _mintBuilding(rareness_, dna_, production_, storage_, type_);
  }
  
  // Mints a Random Slot Charging a Fee.
  function mintRandomSlot() public payable {
    require(currency.balanceOf(msg.sender) >= mintSlotPrice);
    currency.transferFrom(msg.sender, address(this), mintSlotPrice);
        
    string memory typeOfBuilding_ = _randSlotType();
    _mintSlot(typeOfBuilding_);
  }

  // Returns Amount Of Buildings Owned By The Address.
  function balanceOf(address _owner) public view override returns (uint256) {
    return ownerBuildingCount[_owner];
  }

  // Returns The Owner Of Specified BuildingId.
  function ownerOf(uint256 _tokenId) public view override returns (address) {
    return buildingToOwner[_tokenId];
  }

  // Transfer a Building.
  function _transfer(address _from, address _to, uint256 _tokenId) internal override {
    ownerBuildingCount[_to] = ownerBuildingCount[_to].add(1);
    ownerBuildingCount[msg.sender] = ownerBuildingCount[msg.sender].sub(1);
    buildingToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  // Transfer a Building.
  function transferFrom(address _from, address _to, uint256 _tokenId) public override {
    require (buildingToOwner[_tokenId] == msg.sender || buildingapprovals[_tokenId] == msg.sender);
    _transfer(_from, _to, _tokenId);
    }

  // Approves Buildings Allowance.
  function approve(address _approved, uint256 _tokenId) public override onlyOwnerOfBuilding(_tokenId) {
    buildingapprovals[_tokenId] = _approved;
    emit Approval(msg.sender, _approved, _tokenId);
  }

}
