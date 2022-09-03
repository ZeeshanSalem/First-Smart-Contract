const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config.js")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function() {
          let fundMe
          let deployer
          let mockV3Aggregator
          // const sendValue = "1000000000000000000"  // 1ETH
          const sendValue = ethers.utils.parseEther("1") // 1ETH

          beforeEach(async function() {
              //deploy fundme contruct using hardhat ddeploy

              // another way of get deployer is
              // const accounts = await ethers.getSigner()
              // const accountZero = accounts[0]
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              // WILL give most recently deployed fund me contract and conect deployer to fund me
              fundMe = await ethers.getContract("FundMe", deployer)
              mockV3Aggregator = await ethers.getContract(
                  "MockV3Aggregator",
                  deployer
              )
          })

          describe("constructor", async function() {
              it("sets the aggregator address correctly", async function() {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, mockV3Aggregator.address)
              })
          })

          describe("fund", async function() {
              it("Fails if you don't send enough ETH", async function() {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "You need to spend more ETH!"
                  )
              })

              it("updated the amount funded data structure", async function() {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert(response.toString(), sendValue.toString())
              })

              it("Adds funder to the array of funders", async function() {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunder(0)
                  assert.equal(funder, deployer)
              })
          })

          describe("withdraw", async function() {
              beforeEach(async function() {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraw ETH from a single founder", async function() {
                  try {
                      // Arrange
                      const startingFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )

                      const startingDeployerBalance = await fundMe.provider.getBalance(
                          fundMe.deployer
                      )

                      // Act
                      const transactionResponse = await fundMe.withdraw()
                      const transactionRecipt = await transactionResponse.wait(
                          1
                      )

                      const { gasUsed, effectiveGasPrice } = transactionRecipt

                      const gasCost = gasUsed.mul(effectiveGasPrice)

                      const endingFundMeBalance = await fundMe.provider.getBalance(
                          fund.address
                      )

                      const endingDeployerBalance = await fundMe.provider.getBalance(
                          fund.deployer
                      )

                      // asserts
                      assert.equal(endingFundMeBalance, 0)
                      assert.equal(
                          startingFundMeBalance
                              .add(startingDeployerBalance)
                              .toString(),
                          endingDeployerBalance.add(gasCost).toString()
                      )
                  } catch (e) {
                      console.log("Exception")
                      console.log(e)
                  }
              })

              it("allows us to withdraw with multiple different accounts", async function() {
                  try {
                      // Arrange
                      const accounts = await ethers.getSigners()

                      for (let i = 1; i < 6; i++) {
                          const fundMeConnectedContract = await fundMe.connect(
                              accounts[i]
                          )

                          await fundMeConnectedContract.fund({
                              value: sendValue
                          })
                      }

                      const startingFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )

                      const startingDeployerBalance = await fundMe.provider.getBalance(
                          fundMe.deployer
                      )

                      // Act
                      const transactionResponse = await fundMe.withdraw()
                      const transactionRecipt = await transactionResponse.wait(
                          1
                      )

                      const { gasUsed, effectiveGasPrice } = transactionRecipt

                      const gasCost = gasUsed.mul(effectiveGasPrice)

                      const endingFundMeBalance = await fundMe.provider.getBalance(
                          fund.address
                      )

                      const endingDeployerBalance = await fundMe.provider.getBalance(
                          fund.deployer
                      )

                      // asserts
                      assert.equal(endingFundMeBalance, 0)
                      assert.equal(
                          startingFundMeBalance
                              .add(startingDeployerBalance)
                              .toString(),
                          endingDeployerBalance.add(gasCost).toString()
                      )

                      // Make Sure funder are reset properly
                      await expect(fundMe.getFunder(0)).to.be.reverted()

                      for (let i = 1; i < 6; i++) {
                          assert.equal(
                              await fundMe.addressToAmountFunded(
                                  accounts[i].address
                              ),
                              0
                          )
                      }
                  } catch (e) {
                      console.log("Exception is ")
                      console.log(e)
                  }
              })

              it("Only allows the owner to withdraw", async function() {
                  try {
                      const accounts = await ethers.getSigner()
                      const attacker = accounts[1]
                      const attackerConnectedContract = await fundMe.connect(
                          attacker
                      )
                      await expect(
                          attackerConnectedContract.withdraw()
                      ).to.be.revertedWith("FundMe__NotOwner")
                  } catch (e) {
                      console.log(e)
                  }
              })

              it("cheaperWithDraw testing", async function() {
                  try {
                      // Arrange
                      const accounts = await ethers.getSigners()

                      for (let i = 1; i < 6; i++) {
                          const fundMeConnectedContract = await fundMe.connect(
                              accounts[i]
                          )

                          await fundMeConnectedContract.fund({
                              value: sendValue
                          })
                      }

                      const startingFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )

                      const startingDeployerBalance = await fundMe.provider.getBalance(
                          fundMe.deployer
                      )

                      // Act
                      const transactionResponse = await fundMe.cheaperWithDraw()
                      const transactionRecipt = await transactionResponse.wait(
                          1
                      )

                      const { gasUsed, effectiveGasPrice } = transactionRecipt

                      const gasCost = gasUsed.mul(effectiveGasPrice)

                      const endingFundMeBalance = await fundMe.provider.getBalance(
                          fund.address
                      )

                      const endingDeployerBalance = await fundMe.provider.getBalance(
                          fund.deployer
                      )

                      // asserts
                      assert.equal(endingFundMeBalance, 0)
                      assert.equal(
                          startingFundMeBalance
                              .add(startingDeployerBalance)
                              .toString(),
                          endingDeployerBalance.add(gasCost).toString()
                      )

                      // Make Sure funder are reset properly
                      await expect(fundMe.getFunder(0)).to.be.reverted()

                      for (let i = 1; i < 6; i++) {
                          assert.equal(
                              await fundMe.addressToAmountFunded(
                                  accounts[i].address
                              ),
                              0
                          )
                      }
                  } catch (e) {
                      console.log("Exception is ")
                      console.log(e)
                  }
              })

              it("withdraw ETH from a single founder", async function() {
                  try {
                      // Arrange
                      const startingFundMeBalance = await fundMe.provider.getBalance(
                          fundMe.address
                      )

                      const startingDeployerBalance = await fundMe.provider.getBalance(
                          fundMe.deployer
                      )

                      // Act
                      const transactionResponse = await fundMe.cheaperWithDraw()
                      const transactionRecipt = await transactionResponse.wait(
                          1
                      )

                      const { gasUsed, effectiveGasPrice } = transactionRecipt

                      const gasCost = gasUsed.mul(effectiveGasPrice)

                      const endingFundMeBalance = await fundMe.provider.getBalance(
                          fund.address
                      )

                      const endingDeployerBalance = await fundMe.provider.getBalance(
                          fund.deployer
                      )

                      // asserts
                      assert.equal(endingFundMeBalance, 0)
                      assert.equal(
                          startingFundMeBalance
                              .add(startingDeployerBalance)
                              .toString(),
                          endingDeployerBalance.add(gasCost).toString()
                      )
                  } catch (e) {
                      console.log("Exception")
                      console.log(e)
                  }
              })
          })
      })
