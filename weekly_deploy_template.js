var lottereoAddress ="0x93ff7ee96a55f777f311f511b19586393f5598df";

var lottereoSrc = '$LOTTSRC'; 

var lottereoSrcCompiled = web3.eth.compile.solidity(lottereoSrc);

var lottereoAbiDef =lottereoSrcCompiled.lottereo.info.abiDefinition;

var lottereo = eth.contract(lottereoAbiDef).at(lottereoAddress);

var drawSrc =  '$DRAWSRC';

var drawSrcCompiled = web3.eth.compile.solidity(drawSrc);

var drawAbiDef = drawSrcCompiled.draw.info.abiDefinition;

var latestDrawAddress = lottereo.getLatestDraw();

var latestDraw =eth.contract(drawAbiDef).at(latestDrawAddress);

var drawContract = web3.eth.contract(drawAbiDef);

var theminer = eth.accounts[0];

var draw = drawContract.new(30,100000000000000000,theminer,latestDrawAddress,
  {
    from: theminer,
    data: drawSrcCompiled.draw.code, 
    gas: 3000000
  }, function(e, contract){
       if(!e) { 
	 if(!contract.address) {
           console.log("Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
         } else {
           console.log("Contract mined! New draw Address: " + contract.address);
           var event = latestDraw.Log_WinningNumberSelected();
           event.watch(function(e,r) {
             console.log("Winning  Number Selected!",r);
             latestDraw.transferPot(contract.address, {from: theminer, gas: 3000000}, function(e, d2) {
                 console.log("transferPot",e,JSON.stringify(d2));  
                 if (!e) {
                   console.log("Pot transferred to ", contract.address);
                   lottereo.addDraw(contract.address, {from: theminer, gas: 3000000}, function(e, d3) {
                     console.log("addDraw",e,JSON.stringify(d3));
                     if (!e) {
                       console.log("Lottereo updated");
                     }
                   });
                 }
               });
           });
           latestDraw.doDraw({from: theminer, gas: 3000000}, function(e, d) { 
             console.log("dodraw",e,JSON.stringify(d)); 
           }); 
         } 
       }
});
