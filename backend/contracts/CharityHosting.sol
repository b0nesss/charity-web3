// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract CharityHosting {
    
    uint32 public numberOfCharitiesRegistered = 0;

    struct Donor{
        address donorAddress;
        uint256 amountDonated;
        uint8 vote;
    }
    
    struct Charity{
        uint8 credibility;
        uint32 charityId;
        uint256 amountRaised;
        // uint256 noOfDonors;
        string name;
        string[] tags;
        string tokenName;
        string agenda;
        address ownerAddress;
        // Donor[] donors;
    }

    mapping (uint32 => Donor[]) charityIdToDonorArray;

    Charity[] private charities;

    mapping (string => uint32) charityTokenNameToCharityId;

    function createCharity(string memory _name , string memory _tokenName, string memory _agenda ,string[] memory _tags, address _ownerAddress) public {
        Charity memory charity;
        charity.charityId = numberOfCharitiesRegistered++;
        charity.name = _name;                                    //owner address frontend
        charity.tokenName = _tokenName;
        charityTokenNameToCharityId[_tokenName]=charity.charityId;
        charity.agenda = _agenda;
        charity.tags = _tags;
        charity.ownerAddress = _ownerAddress;
        // charity.noOfDonors = 0;
        charity.credibility = 50;
        charities.push(charity);
    }
    
    function getCharityList() public view returns(CharityHosting.Charity[] memory){
        Charity[] memory charitiess = charities;
        return charitiess;
    }

    function getCharityByTokenName(string memory _tokenName) public view returns(CharityHosting.Charity memory){
        return charities[charityTokenNameToCharityId[_tokenName]];
    }

    function donate(string memory _tokenName) public payable {
        Donor memory donor;
        uint32 charityId = charityTokenNameToCharityId[_tokenName];
        donor.donorAddress = msg.sender;
        donor.amountDonated = msg.value;
        charityIdToDonorArray[charityId].push(donor);
        address charityAddress = charities[charityId].ownerAddress;
        (bool callSuccess,) = payable (charityAddress).call{value: msg.value}("");
        require(callSuccess,"Donation Failed");
        charities[charityId].amountRaised += msg.value;
    }

    function getDonorsArrayByTokenName(string memory _tokenName) public view returns(CharityHosting.Donor[] memory) {
        return charityIdToDonorArray[charityTokenNameToCharityId[_tokenName]];
    }

    function vouch(string memory _tokenName,uint8 _index,uint8 _vote) public {
        charityIdToDonorArray[charityTokenNameToCharityId[_tokenName]][_index].vote = _vote;
    }

    function changeCredibility(uint8 _value,string memory _tokenName) public {
        charities[charityTokenNameToCharityId[_tokenName]].credibility = _value;
    } 
    //in frontend we need to calculate changed value //here voteValue = amountFunded by address* +1 or -1
    //changed value can be calculated by initial credibility + ((voteValue/amountRaised)*50)
    //for this you need to check whether vouch option is available for the user or not from donors array
    //while looping thru that for searching that particular address u will also have to retrieve the amount funded by that address
    //then we will use weightage of that to find voteValue as discussed in meet 

}