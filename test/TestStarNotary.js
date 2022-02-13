const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Star', async() => {
    let tokenId = 1;
    let instance = await StarNotary.deployed();
    await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
    assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let starId = 2;
    let starPrice = web3.utils.toWei(".01", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 3;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
    await instance.buyStar(starId, {from: user2, value: balance});
    let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
    let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
    let value2 = Number(balanceOfUser1AfterTransaction);
    assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId = 4;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    //let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[3];
    let user2 = accounts[4];
    let starId = 5;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});
    
    const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
    await instance.buyStar(starId, {from: user2, value: balance});
    const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
    //let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
    
    // the gas price broke this orginal test, for now just showing the balance has been reduced
    assert.equal(true, balanceOfUser2BeforeTransaction > balanceAfterUser2BuysStar);
});


// Important! Need to use big numbers in this
it('lets user2 buy a star and checks their final balance is correctly deducted including fees', async() => {
    let instance = await StarNotary.deployed();
    let user1 = accounts[3];
    let user2 = accounts[4];
    let starId = 55;
    let starPrice = web3.utils.toWei(".01", "ether");
    let balance = web3.utils.toWei(".05", "ether");
    await instance.createStar('awesome star', starId, {from: user1});
    await instance.putStarUpForSale(starId, starPrice, {from: user1});

    const balanceOfUser2BeforeTransaction = web3.utils.toBN(await web3.eth.getBalance(user2));
    const txInfo = await instance.buyStar(starId, {from: user2, value: balance});
    const balanceAfterUser2BuysStar = web3.utils.toBN(await web3.eth.getBalance(user2));    

    // calculate the gas fee
    const tx = await web3.eth.getTransaction(txInfo.tx);
    const gasPrice = web3.utils.toBN(tx.gasPrice);
    const gasUsed = web3.utils.toBN(txInfo.receipt.gasUsed);
    const txGasCost = gasPrice.mul(gasUsed);    

    // final_balance == initial_balance - star_price - gas_fee
    const starPriceBN = web3.utils.toBN(starPrice);
    const expectedFinalBalance = balanceOfUser2BeforeTransaction.sub(starPriceBN).sub(txGasCost);
    assert.equal(expectedFinalBalance.toString(), balanceAfterUser2BuysStar.toString());
});




// Implement Task 2 Add supporting unit tests
it('can add the star name and star symbol properly', async() => {
    //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
    let instance = await StarNotary.deployed();
    assert.equal(await instance.name.call(), 'Star Token');
    assert.equal(await instance.symbol.call(), 'STA');
});

it('lets 2 users exchange stars', async() => {
    // 1. create 2 Stars with different tokenId
    // 2. Call the exchangeStars functions implemented in the Smart Contract
    // 3. Verify that the owners changed
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId1 = 7;
    let starId2 = 8;

    // create stars, one for each user
    await instance.createStar('user1 star', starId1, {from: user1});
    await instance.createStar('user2 star', starId2, {from: user2});

    // exchange stars
    await instance.exchangeStars(starId1,starId2,{from: user1});

    assert.equal(await instance.ownerOf.call(starId1), user2);
    assert.equal(await instance.ownerOf.call(starId2), user1);

});

it('lets a user transfer a star', async() => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function imp    
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId1 = 21;

    // create star
    await instance.createStar('user1 star', starId1, {from: user1});

    // transfer star owned by user1 to user2
    await instance.transferStar(user2,starId1,{from: user1});

    // 3. Verify the star owner changed to user2
    assert.equal(await instance.ownerOf.call(starId1), user2);
});

it('stops a user transferring a star they dont own', async() => {
    // 1. create a Star with different tokenId
    // 2. use the transferStar function imp    
    let instance = await StarNotary.deployed();
    let user1 = accounts[1];
    let user2 = accounts[2];
    let starId1 = 22;

    // create star for user 2
    await instance.createStar('user2 star', starId1, {from: user2});

    try {
        // user 1 attenmpts to transfer a star owned by user2
        await instance.transferStar(user1,starId1,{from: user1});
    } catch {}

    // 3. Verify the star owner has NOT changed to user1
    assert.notEqual(await instance.ownerOf.call(starId1), user1);
});

it('lookUptokenIdToStarInfo test', async() => {
    // 1. create a Star with different tokenId
    // 2. Call your method lookUptokenIdToStarInfo
    // 3. Verify if you Star name is the same
    let tokenId = 30;
    let instance = await StarNotary.deployed();
    await instance.createStar('Spark', tokenId, {from: accounts[0]});

    assert.equal(await instance.lookUptokenIdToStarInfo.call(tokenId), 'Spark');
});