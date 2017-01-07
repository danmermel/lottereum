var src="$SRC";

var srcCompiled = web3.eth.compile.solidity(src);

var drawContract = web3.eth.contract(srcCompiled.draw.info.abiDefinition);

var theminer = eth.accounts[0];
var thebuyer = eth.accounts[1];
var anotherbuyer = eth.accounts[2];
var theorganiser = eth.accounts[3];

var draw = drawContract.new(30,100000000000000000,theorganiser,"0x00000000",
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

