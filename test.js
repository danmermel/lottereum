var lottereoAddress ="0x93ff7ee96a55f777f311f511b19586393f5598df";

var lottereoSrc = "contract drawInterface {    uint public winningNumber;      function getPot() constant returns (uint) {   }     function buyTicket (address _buyer, uint _guess) {   }      function getPrizeValue (address _query) constant returns(uint) {   }  }   contract lottereo {    address owner;    uint public numDraws;    struct drawData {       uint drawDate;       address eth_address;    }    mapping(uint => drawData) public draws;        function lottereo()  {       numDraws = 0;       owner = msg.sender;    }     function getPot() constant returns (uint pot) {      drawInterface draw = drawInterface(getLatestDraw());      pot = draw.getPot();     }     function buyTicket(uint _guess)  {      drawInterface draw = drawInterface(getLatestDraw());      draw.buyTicket.value(msg.value)(msg.sender,_guess);     }     function getWinningNumber ()  constant returns (uint _winner){       drawInterface draw = drawInterface(getPreviousDraw());       _winner = draw.winningNumber();    }     function addDraw (address _eth_address) {       if (msg.sender != owner) throw;       draws[numDraws] = drawData(now, _eth_address);       numDraws += 1;          }     function getLatestDraw () constant returns (address _latest) {       if (numDraws == 0) throw;       _latest = draws[numDraws-1].eth_address;    }     function getPreviousDraw () constant returns (address _previous) {       if (numDraws < 2) throw;       _previous = draws[numDraws-2].eth_address;    }     function getPrizeValue(address _query) constant returns (uint _value) {      drawInterface draw = drawInterface(getPreviousDraw());      _value = draw.getPrizeValue(_query);    }  } "; 

var lottereoSrcCompiled = web3.eth.compile.solidity(lottereoSrc);

var lottereoAbiDef =lottereoSrcCompiled.lottereo.info.abiDefinition;

var lottereo = eth.contract(lottereoAbiDef).at(lottereoAddress);

var drawSrc =  "contract draw {     address owner;     uint public numTickets;     uint public drawDate;     bool public drawn;     uint public entryFee;     uint public payout;     uint public winningNumber;       address public organiser;     address public nextDraw;       struct Ticket {      uint guess;      address eth_address;     }     mapping(uint => Ticket) public tickets;     address[] public winningaddresses;      event BuyTicket(uint _ticketid);     event DrawDone(uint _winningNumber);       function draw(uint _offset, uint _entryFee, address _organiser) {          owner = msg.sender;   	 numTickets = 0;    	 drawn = false;    	 winningNumber = 0;          payout = 0;          drawDate = now + _offset;          entryFee = _entryFee;          organiser= _organiser;     }      function getPot() constant returns (uint) {        return this.balance;      }      function buyTicket(address _buyer, uint _guess) returns (uint ticketid) {       if (msg.value != entryFee) throw;       if (_guess > 1000 || _guess < 1) throw;       if (drawn) throw;       ticketid = numTickets++;       tickets[ticketid] = Ticket(_guess, _buyer);       BuyTicket(ticketid);     }      function doDraw() {      if (drawn) throw;      if (now < drawDate) throw;       winningNumber = (now % 1000) +1 ;       for (uint i = 0; i < numTickets; ++i) {         if (tickets[i].guess == winningNumber) {           winningaddresses.push(tickets[i].eth_address);          }       }       var commission = numTickets*entryFee / 10;       payout = this.balance - commission;       for (uint j = 0; j < winningaddresses.length; ++j) {         winningaddresses[j].send(payout / winningaddresses.length);       }       organiser.send(commission);       DrawDone(winningNumber);       drawn = true;     }      function transferPot(address _newContract) {       if (msg.sender != owner) throw;       if (this.balance == 0) throw;       if (!drawn) throw;        _newContract.send(this.balance);       nextDraw = _newContract;      }      function getPrizeValue (address _query) constant returns (uint _value) {       if (!drawn) throw;       _value =0;       for (uint i = 0; i < winningaddresses.length; ++i) {         if (winningaddresses[i] == _query) {           _value += payout / winningaddresses.length;                 }       }     }  } ";

var drawSrcCompiled = web3.eth.compile.solidity(drawSrc);

var drawAbiDef = drawSrcCompiled.draw.info.abiDefinition;

var latestDrawAddress = lottereo.getLatestDraw();

var latestDraw =eth.contract(drawAbiDef).at(latestDrawAddress);

var drawContract = web3.eth.contract(drawAbiDef);

var theminer = eth.accounts[0];

var draw = drawContract.new(86400,100000000000000000,theminer,
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
           latestDraw.doDraw({from: theminer, gas: 3000000}, function(e, d) { 
             console.log("dodraw",e,JSON.stringify(d)); 
             if (!e) {
               console.log("Draw done and mined");
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
             }
           }); 
         } 
       }
});

