const { assert } = require("chai");
const { network, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
? describe.skip
: describe("Charity Hosting Staging tests", ()=>{
    const sendValue = ethers.utils.parseEther("0.1");
    let deployer;
    let charityHosting;
     beforeEach(async()=> {
        deployer = (await getNamedAccounts).deployer;
        charityHosting = await ethers.getContract("CharityHosting",deployer);
     });
     
  });