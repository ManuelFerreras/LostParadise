pragma solidity >=0.5.0 <0.6.0;

import "./buildingshelper.sol";
import "./erc721.sol";
import "./safemath.sol";

contract buildingOwnerShip is BuildingHelper, ERC721 {

  using SafeMath for uint256;

  mapping (uint => address) buildingapprovals;

  function balanceOf(address _owner) external view returns (uint256) {
    return ownerBuildingCount[_owner];
  }

  function ownerOf(uint256 _tokenId) external view returns (address) {
    return buildingToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerBuildingCount[_to] = ownerBuildingCount[_to].add(1);
    ownerBuildingCount[msg.sender] = ownerBuildingCount[msg.sender].sub(1);
    buildingToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
      require (buildingToOwner[_tokenId] == msg.sender || buildingapprovals[_tokenId] == msg.sender);
      _transfer(_from, _to, _tokenId);
    }

  function approve(address _approved, uint256 _tokenId) external payable onlyOwnerOf(_tokenId) {
      buildingapprovals[_tokenId] = _approved;
      emit Approval(msg.sender, _approved, _tokenId);
    }

}
