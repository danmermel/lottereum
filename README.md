## Deployment from the command-line

```sh
> ./deploy.js draw11.sol
```

Then from geth:

```
loadScript("./draw.js")
```

which is the equivalent of:

```js
var srcCompiled = web3.eth.compile.solidity(src);

var drawContract = web3.eth.contract(srcCompiled.draw.info.abiDefinition);

// create a contract to be drawn in 300 seconds, with a 0.1eth entry fee 
// with commission paid to "theorganiser"
var draw = drawContract.new(300,100000000000000000,theorganiser,
  {
    from: web3.eth.accounts[0],
    data: srcCompiled.draw.code, 
    gas: 3000000
  }, function(e, contract){
       if(!e) { if(!contract.address) {
         console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
       } else {
         console.log("Contract mined! Address: " + contract.address);
         console.log(contract);
       } 
     }
});
```
## Setting up accounts

```sh
> geth account new
```

## Starting geth in test mode

```sh
geth --identity "glynnaws"  --rpc --rpcport "8000" --rpcaddr "0.0.0.0" --rpccorsdomain "*" --port "30303" --nodiscover --ipcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3" --rpcapi "db,eth,net,web3" --autodag --networkid 1900 --nat "any" --unlock "175b92f61ce2c633354234e50b862832f3e6377a" --mine --minerthreads "1" console 
```

## Buying tickets

```js
personal.unlockAccount(thebuyer, "password")
var theticket = draw.buyTicket(42, {from: thebuyer, gas: 3000000, value: 100000000000000000 });
```

Check whether it worked with:

```js
eth.getTransactionReceipt(theticket);
```

## Transferring money from the miner to other accounts

```js
eth.sendTransaction({from:theminer, to:thebuyer, value: 1000000000})
```

## Interrogating the draw

```js
draw.numTickets();
draw.drawn();
draw.drawDate();
draw.entryFee();
draw.tickets(0);
```

## Listening for events

```js
var event = draw.BuyTicket();
event.watch(function(e,r) { console.log("Ticket bought", e, JSON.stringify(r)); });

var event = draw.DrawDone();
event.watch(function(e,r) { console.log("Drawn!", e, JSON.stringify(r)); });
```

## Doing the draw

```js
draw.doDraw({from: theminer, gas: 3000000});
draw.drawn();
draw.getWinnerByIndex(0);
```

## Transferring the remaing pot to a new contract

```js
var draw2 = ...; // create new contract and wait until its mined
draw.transferPot(draw2.address, {from:theminer, gas: 3000000});
```

## Read my blog posts about it
http://remebit.com/an-ethereum-project-1-the-idea/
