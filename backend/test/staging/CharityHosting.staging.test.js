const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
? describe.skip
: describe("Charity Hosting Staging tests", ()=>{
    let deployer;
    let charityHosting;
     beforeEach(async()=> {
        deployer = "0xBA32161098B86ABD1f352A70ddDB1d3eccdAF88b"
        charityHosting = await ethers.getContract("CharityHosting",deployer);
     });
     it("allows users to create a charity, donate funds to a charity, and gives donors vouching feature to set a trust score for that charity" , async()=>{
         console.log("creating");
        const createTxResponse = await charityHosting.createCharity("Name 1","name_1","my agedna",["asc","sda"],deployer);
        await createTxResponse.wait(1);console.log("created");console.log("donating");
        const donateTxResponse = await charityHosting.donate("name_1",{value:ethers.utils.parseEther("0.0005")});
        await donateTxResponse.wait(1);console.log("donated");console.log("voting");
        const vouchTxResponse = await charityHosting.vouch("name_1",-1);
        await vouchTxResponse.wait(1);console.log("voted");
        const charity = await charityHosting.getCharityByTokenName("name_1");
        const credibility = charity.credibility;
        console.log(
            credibility.toString() +
              " should equal 0, running assert equal..."
          );
        assert.equal(credibility.toString(),"0");
     })
  });