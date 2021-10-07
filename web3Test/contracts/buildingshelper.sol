pragma solidity >=0.5.0 <0.6.0;

import "./contract.sol";

contract BuildingHelper is TestContract {
    
    /* Fix this
    function withdraw() external onlyOwner {
        address _owner = owner();
        _owner.transfer(address(this).balance);
    }
    */
    
    function getZombiesByOwner(address _owner) external view returns(uint[] memory) {
        uint[] memory result = new uint[](ownerBuildingCount[_owner]);
        uint counter = 0;
        for (uint i = 0; i < buildings.length; i++) {
            if (buildingToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }
    
    modifier onlyOwnerOf(uint _buildingId) {
        require(msg.sender == buildingToOwner[_buildingId]);
        _;
    }
}