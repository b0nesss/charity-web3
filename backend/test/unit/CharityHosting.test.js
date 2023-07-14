const { developmentChains } = require("../../helper-hardhat-config");
const { getNamedAccounts, deployments, ethers } = require("hardhat");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("CharityHosting", function () {
      let charityHosting;
      let deployer;
      const sendValue = ethers.utils.parseEther("1");
      beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);
        charityHosting = await ethers.getContract("CharityHosting", deployer);
      });
      describe("CreateCharity", function () {
        it("needs a unique token name", async()=>{
          await charityHosting.createCharity(
            "Name 1",
            "name_1",
            "for testing",
            ["lpu", "cpu"],
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
          );
          await expect(charityHosting.createCharity(
            "NaMe 1",
            "name_1",
            "forfsa testing",
            ["lpus", "capu"],
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
          )).to.be.revertedWith("Please Change Name of your Charity, This name already exists");
        });
        it("creates a charity org and sets it values as provided in params", async () => {
          await charityHosting.createCharity(
            "Name 1",
            "name_1",
            "for testing",
            ["lpu", "cpu"],
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
          );
          const charities = await charityHosting.getCharityList(); //getCharityList function also gets tested simultaneously
          const charity = charities[0];
          assert.equal(charity.charityId.toString(), "0");
          assert.equal(charity.name.toString(), "Name 1");
          assert.equal(charity.credibility.toString(), "50");
          assert.equal(charity.amountRaised.toString(), "0");
          assert.equal(charity.tokenName.toString(), "name_1");
          assert.include(charity.tags, "cpu");
          assert.include(charity.tags, "lpu");
          assert.equal(charity.ownerAddress, deployer);
        });
        it("pushes created charity to charities array", async () => {
          await charityHosting.createCharity(
            "Name 1",
            "name_1",
            "for testing",
            ["lpu", "cpu"],
            "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
          );
          const charities = await charityHosting.getCharityList();
          assert.lengthOf(charities, 1);
        });
      });
      describe('getNumberOfCharitiesRegistered', () => { 
            beforeEach(async() => {
                await charityHosting.createCharity(
                    "Name 1",
                    "name_1",
                    "for testing",
                    ["lpu", "cpu"],
                    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
                  );
                  await charityHosting.createCharity(
                    "Name 2",
                    "name_2",
                    "for testing2",
                    ["lpu", "cpu2"],
                    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
                  );
            });
            it("returns number of charities generated", async()=> {
                const response = await charityHosting.getNumberOfCharitiesRegistered();
                assert.equal(response.toString(),"2");
            });
       });
       describe('getCharityByTokenName', () => { 
            beforeEach(async()=>{
                await charityHosting.createCharity(
                    "Name 1",
                    "name_1",
                    "for testing",
                    ["lpu", "cpu"],
                    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
                  );
            });
            it("returns charityId here when tokenname is passed as param" , async()=>{
                const response = await charityHosting.getCharityByTokenName("name_1");
                assert.equal(response.charityId.toString(),"0");
            });
        });
        describe("donate" , ()=> {
            beforeEach(async()=>{
                await charityHosting.createCharity(
                    "Name 1",
                    "name_1",
                    "for testing",
                    ["lpu", "cpu"],
                    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
                  );
                await charityHosting.donate("name_1",{value: sendValue});
            });
            it("pushes donor to array of donors with correct info" , async()=>{
                const responses = await charityHosting.getDonorsArrayByTokenName("name_1"); //getDonorsArrayByTokenName also gets checked here
                assert.lengthOf(responses,1);
                const response = responses[0];
                assert.equal(response.donorAddress,deployer);
                assert.equal(response.amountDonated.toString(),ethers.utils.parseEther("1").toString());
            });
            it("transfers amount to charity" , async()=>{
                const charities = await charityHosting.getCharityList(); 
                const charity = charities[0];
                assert.equal(charity.amountRaised.toString(),sendValue.toString());
            });
        });
        describe('vouch function', () => {
            beforeEach( async()=> {
                await charityHosting.createCharity(
                    "Name 1",
                    "name_1",
                    "for testing",
                    ["lpu", "cpu"],
                    "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
                  );
                  await charityHosting.donate("name_1",{value:sendValue});
            });
            it("checks that only donor can vouch", async()=>{
                const accounts = await ethers.getSigners();
                const donor = accounts[1];
                // const donor = (await getNamedAccounts()).donor;
                const attackerContract = await charityHosting.connect(donor); 
                await expect(attackerContract.vouch("name_1",1)).to.be.revertedWith("Cannot Vote")
                const charities = await charityHosting.getCharityList(); 
                const charity = charities[0];
                assert.equal(charity.credibility,50);
            });
            it("calls change credibility function successfully", async()=>{
              const accounts = await ethers.getSigners();
              const donor = accounts[1];
              const donor1 = accounts[2];
              await charityHosting.vouch("name_1",1);
              const donorContract = await charityHosting.connect(donor);
              await donorContract.donate("name_1",{value:sendValue});
              await donorContract.vouch("name_1",1);
              const donor1Contract = await charityHosting.connect(donor1);
              await donor1Contract.donate("name_1",{value:sendValue});
              await donor1Contract.vouch("name_1",-1);
              const charities = await charityHosting.getCharityList(); 
              const charity = charities[0];
              assert.equal(charity.credibility.toString(),"66");
            })
        });
    });
