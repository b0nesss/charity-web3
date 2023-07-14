// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

contract CharityHosting {
    
    uint32 private numberOfCharitiesRegistered = 0;

    struct Donor{
        int8 vote;
        uint256 amountDonated;
        address donorAddress;
    }
    
    struct Charity{
        uint32 charityId;
        uint256 credibility;
        uint256 amountRaised;
        string name;
        string[] tags;
        string tokenName;
        string agenda;
        address ownerAddress;
    }

    mapping (uint32 => Donor[]) charityIdToDonorArray;

    mapping (string => uint32) charityTokenNameToCharityId;

    mapping (string => bool) tokenNameExists;

    Charity[] private charities;

    function createCharity(string calldata _name , string calldata _tokenName, string calldata _agenda ,string[] calldata _tags, address _ownerAddress) public {
        require(!tokenNameExists[_tokenName],"Please Change Name of your Charity, This name already exists");
        Charity memory charity;
        charity.charityId = numberOfCharitiesRegistered++;
        charity.name = _name;                                    //owner address frontend
        charity.tokenName = _tokenName;
        tokenNameExists[_tokenName] = true;
        charityTokenNameToCharityId[_tokenName]=charity.charityId;
        charity.agenda = _agenda;
        charity.tags = _tags;
        charity.ownerAddress = _ownerAddress;
        charity.credibility = 50;
        charities.push(charity);
    }
    
    function getCharityList() public view returns(CharityHosting.Charity[] memory){
        Charity[] memory charitiess = charities;
        return charitiess;
    }

    function getCharityByTokenName(string calldata _tokenName) public view returns(CharityHosting.Charity memory){
        return charities[charityTokenNameToCharityId[_tokenName]];
    }

    function getNumberOfCharitiesRegistered() public view returns (uint32) {
        return numberOfCharitiesRegistered;
    }

    function donate(string calldata _tokenName) public payable {
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

    function getDonorsArrayByTokenName(string calldata _tokenName) public view returns(CharityHosting.Donor[] memory) {
        return charityIdToDonorArray[charityTokenNameToCharityId[_tokenName]];
    }

    function getUpdatedCredentialValue(string calldata _tokenName,int256 _index) internal view returns(int256) {
        Donor[] memory donorArray = charityIdToDonorArray[charityTokenNameToCharityId[_tokenName]];
        int256 i;
        int256 sum=0;
        for (i= _index; i >= 0; i--) {
            sum += donorArray[uint256(i)].vote * int256(donorArray[uint256(i)].amountDonated);
        }
        return sum;
    }

    function vouch(string calldata _tokenName, int8 _vote) public {
        bool isDonor = false;
        int256 i;
        int256 sum = 0;
        Donor[] memory donorArray = charityIdToDonorArray[charityTokenNameToCharityId[_tokenName]];
        for (i = int256(donorArray.length - 1); i >= 0; i--) {
            if(msg.sender == donorArray[uint256(i)].donorAddress){
                require(donorArray[uint256(i)].vote==0,"Already Voted");
                isDonor = true;
                break;
            }
            sum += int256(donorArray[uint256(i)].vote) * int256(donorArray[uint256(i)].amountDonated);
        }
        require(isDonor, "Cannot Vote");
        charityIdToDonorArray[charityTokenNameToCharityId[_tokenName]][uint256(i)].vote = _vote;
        if(i>=0){sum += getUpdatedCredentialValue(_tokenName,i);}
        int256 amountOfCharity = int256(charities[charityTokenNameToCharityId[_tokenName]].amountRaised);
        int256 updatedCredibilityValue = 50 + ((sum*50)/amountOfCharity);
        changeCredibility(updatedCredibilityValue,_tokenName);
    }

    function changeCredibility(int256 _value,string calldata _tokenName) internal {
        charities[charityTokenNameToCharityId[_tokenName]].credibility = uint256(_value);
    } 

}