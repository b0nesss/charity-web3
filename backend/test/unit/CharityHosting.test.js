const { beforeEach } = require("node:test");
const {developmentChains} = require("../../helper-hardhat-config");
const { getNamedAccounts } = require("hardhat");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("CharityHosting" , function(){
    let charityHosting;
    let deployer
    beforeEach( async()=>{
        deployer = (await getNamedAccounts()).deployer;
    })
  })