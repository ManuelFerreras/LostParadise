pragma solidity >=0.8.0;

import "./buildingshelper.sol";

// SPDX-License-Identifier: UNLICENSED

contract BuildingUsage is BuildingHelper {
    using SafeMath for uint;
    
     // Sets a Building To Be Used.
    function useBuilding(uint buildingId_, uint slotId_) public onlyOwnerOfBuilding(buildingId_) onlyOwnerOfSlot(slotId_) nonReentrant {
        require(buildingToSlot[buildingId_ + 1] == 0, "Building Is Being Used.");
        require(slotToBuilding[slotId_ + 1] == 0, "Slot Is Being Used.");
        
        buildingToSlot[buildingId_ + 1] = slotId_;
        slotToBuilding[slotId_ + 1] = buildingId_;
        
        buildings[buildingId_].used = true;
        slots[slotId_].used = true;
        
        buildings[buildingId_].startTime = block.timestamp;
    }
    
    // Sets a Building To Be Unused.
    function deactivateBuilding(uint buildingId_) public onlyOwnerOfBuilding(buildingId_) nonReentrant {
        require(isUsed(buildingId_), "Not Owned.");
        
        uint slotId_ = buildingToSlot[buildingId_ + 1];
        
        buildings[buildingId_].startTime = 0;
        buildings[buildingId_].used = false;
        slots[slotId_].used = false;
        slotToBuilding[buildingToSlot[buildingId_ + 1] + 1] = 0;
        buildingToSlot[buildingId_ + 1] = 0;

    }
    
    // This Function Withdraws a Building's Generated Income Based on Its StartingProductionTime and The Actual Time.
    function withdrawBuildingEarnings(uint buildingId_) public onlyOwnerOfBuilding(buildingId_) nonReentrant {
        if(isUsed(buildingId_)) {
            uint256 withdrawableAmount = returnBuildingEarnings(buildingId_) * 10 ** decimals;
            
            require(currency.balanceOf(address(this)) >= withdrawableAmount);
            currency.transferFrom(address(this), msg.sender, withdrawableAmount);
            buildings[buildingId_].startTime = block.timestamp;
        }
    }
    
    // This Function Upgrades a Building.
    function upgradeBuilding(uint buildingId_) public onlyOwnerOfBuilding(buildingId_) nonReentrant {
        require(buildings[buildingId_].level < maxBuildingLevel);
        
        uint fee_ = getBuildingUpgradeFee(buildingId_);
        
        require(currency.balanceOf(msg.sender) >= fee_);
        currency.transferFrom(msg.sender, address(this), fee_);
        
        _updateLevelRates(buildingId_);
        buildings[buildingId_].level = buildings[buildingId_].level.add(1);
    }
    
    
    // This Function Combines 2 Buildings
    function combineBuildings(uint buildingIdOne_, uint buildingIdTwo_) public onlyOwnerOfBuilding(buildingIdOne_) onlyOwnerOfBuilding(buildingIdTwo_) maxLevelOfBuilding(buildingIdOne_) maxLevelOfBuilding(buildingIdTwo_) nonReentrant {
        require(currency.balanceOf(msg.sender) >= combineBuildingPrice);
        currency.transferFrom(msg.sender, address(this), combineBuildingPrice);
        
        uint256 dna_;
        uint256 door_;
        uint256 basement_;
        uint256 body_;
        uint256 ceiling_;
        
        string memory type_;
        
        (dna_, door_, basement_, body_, ceiling_, type_)  = _randDna(mod, buildingIdOne_, buildingIdTwo_);
        string memory rareness_ = _randRareness();
    
        (uint256 production_, uint256 storage_) = _createStorProd(rareness_, [door_, basement_, body_, ceiling_]);
        
        _mintBuilding(rareness_, dna_, production_, storage_, type_);
    }
}