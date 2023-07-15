# Charity List3r

  

## Project Summary

  

**Charity List3R**, is a A Charity Listing DAO developed during internal hackathon of BlocSoc IITR, where a Charitable Organisation can enroll themselves under the categories it wishes to (e.g. world hunger), and provide regular updates to their funders about their charitable deeds, to increase their credibility score.

  

## Project Description

  

The traditional charity sector often lacks transparency, making it challenging for donors to assess the credibility and trustworthiness of charitable organizations. Donors are often skeptical about how their funds are utilized and whether the organizations are genuinely making a positive impact. Additionally, it can be difficult for new and lesser-known charities to gain visibility and build trust among potential donors.

  

### How we solve it?
1.**Decentralized Charity Listing:** The platform allows users to create and manage a decentralized charity listing DAO. This DAO serves as a collective platform for listing and evaluating charitable organizations.
2.**Improved Transparency:** By providing a platform for public voting and trust score calculation, the DApp enhances transparency in the charity sector. Donors can make informed decisions based on the collective assessment of the community


  
  
  

## How we made it work

  

This project has two repositories, one for backend and another for <a  href="https://github.com/bhavi-b/charity-web3-next">frontend</a>. The smart contract consisted of many data structures and functions to make it gas efficient and secure and to provide the client with various features like :

- Listing their organisation

	- User can list their organisation with a name

	- Their agenda

	- Address of the org owner

- Any user can donate to any charitable organisation.

- Donors of a particular org can upvote or downvote its trust score.

All these functions are made public in <a href="https://sepolia.etherscan.io/address/0xc1881230d586221479A21c6cfB8CD442a4422361#code">sepolia etherscan</a> and users can verify how they work. **To prevent misuse of voting system, voting rights for an org have only been given to the donors of that org**. With each vote the updated trust score is calculated, progammatically by the smart contract itself to prevent any hack, using weighted mean of amount funded and vote value *(1 or -1)*.
To make the contract gas efficient some data structures were used which used `tokenName` of the org (unique to that particular org) to retrieve details of that org.  
  
  

## Challenges faced
  1. Midway through our project we figured out a vulnerability in our code in the changeCredibility function. We had kept it public for our frontend to access it but then we realised anyone could run a script calling it and could change its value to anything possible. With some help from our mentors we figured its solution out and implemented it.
  2. Being rookies at next.js and react.js we had to make sure that all required methods and properties for integrating the backend with frontend were easily available without making the code vulnerable.
## Tools used 
Backend was made using Solidity and Hardhat , wherein hardhat-deploy plugin was used for easy deployment of the smart contract. Testing feature of hardhat was used to test all the functions wherein we tested 100% of the functions and statements and also a staging test was done. Initially the smart contract was written on Remix IDE which made reviewing of functions and data structures easier due to its interactive UI. 

## Getting Started
To test our code you can follow these simple steps:
```bash
git clone https://github.com/b0nesss/charity-web3
cd charity-web3/backend/
yarn install
yarn hardhat deploy --network <YOUR PREFERRED NETWORK >
yarn hardhat test
```
## Conclusion
The Charity Listing DAO with Trust Score Calculation offers a decentralized and transparent platform to address the trust issues prevalent in the charity sector. By leveraging public voting and trust score calculation, the DApp empowers donors to make informed decisions, supports lesser-known charities, and fosters community engagement and collaboration. Join the DAO, cast your votes, and be part of the positive change in the philanthropic landscape.