const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token", function () {
    let token;
    let owner, addr1, addr2;

    beforeEach(async function () {
        // Get signers
        [owner, addr1, addr2] = await ethers.getSigners();

        // Correct: Await the deployment
        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy();
        await token.deployed();
    });

    it("Should transfer tokens", async function () {
        // Specify amount to transfer
        const transferAmount = 50;

        // Owner transfers tokens to addr1
        await token.transfer(addr1.address, transferAmount);

        // Correct balance check using address
        const addr1Balance = await token.balanceOf(addr1.address);
        expect(addr1Balance).to.equal(transferAmount);
    });

    it("Should fail on insufficient balance", async function () {
        // Connect to addr1 (has no tokens)
        const tokenFromAddr1 = token.connect(addr1);

        // Expect revert with message or any revert
        await expect(
            tokenFromAddr1.transfer(addr2.address, 1000000)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });
});
