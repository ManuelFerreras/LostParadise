pragma solidity >=0.5.0 <0.6.0;

import "./safemath.sol";
import "./ownable.sol";

contract TestContract is Ownable {
    using SafeMath for uint256;
    using SafeMath32 for uint32;
    using SafeMath16 for uint16;
    
    event NewBuilding(uint buildingId, string typeOfBuilding, uint income);
    
    uint dnaDigits = 4;
    uint dnaModulus = 10 ** dnaDigits;
    uint cooldownTime = 60 seconds;
    
    struct Building {
        string typeOfBuilding;
        uint income;
        uint finishTime;
        uint startTime;
        bool used;
    }
    
    Building[] public buildings;
    
    mapping (uint => address) public buildingToOwner;
    mapping (address => uint) ownerBuildingCount;
    
    function createBuilding() public {
        uint id = buildings.push(Building("House", 100, 100 seconds, 0, false)) - 1;
        buildingToOwner[id] = msg.sender;
        ownerBuildingCount[msg.sender] = ownerBuildingCount[msg.sender].add(1);
        emit NewBuilding(id, "House", 100);
    }
    
    function searchBuildingById(uint id) public view returns (string memory, uint, uint) {
        return (buildings[id].typeOfBuilding, buildings[id].income, id);
    }

    function useBuilding(uint _id) public {
        if(!isUsed(_id)) {
            buildings[_id].used = true;
            buildings[_id].startTime = now;
        }
    }
    
    function isUsed(uint _id) public view returns (bool) {
        return buildings[_id].used;
    }
    
    function returnBuildingEarnings(uint _buildingId) public view returns (uint) {
        if(isUsed(_buildingId)) {
            return (((now - buildings[_buildingId].startTime) - (now - buildings[_buildingId].startTime) % buildings[_buildingId].finishTime)) / buildings[_buildingId].finishTime * buildings[_buildingId].income;
        } else {
            return 0;
        }
            
    }
    

}