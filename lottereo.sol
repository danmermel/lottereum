contract drawInterface {

  uint public winningNumber;  

  function getPot() constant returns (uint) {
  }
 
  function buyTicket (address _buyer, uint _guess) {
  }
  
  function getPrizeValue (address _query) constant returns(uint) {
  }

}


contract lottereo {
   address owner;
   uint public numDraws;
   struct drawData {
      uint drawDate;
      address eth_address;
   }
   mapping(uint => drawData) public draws;
 


   function lottereo()  {
      numDraws = 0;
      owner = msg.sender;
   }

   function getPot() constant returns (uint pot) {
     drawInterface draw = drawInterface(getLatestDraw());
     pot = draw.getPot(); 
   }

   function buyTicket(uint _guess)  {
     drawInterface draw = drawInterface(getLatestDraw());
     draw.buyTicket.value(msg.value)(msg.sender,_guess);

   }

   function getWinningNumber ()  constant returns (uint _winner){
      drawInterface draw = drawInterface(getPreviousDraw());
      _winner = draw.winningNumber();
   }

   function addDraw (address _eth_address) {
      if (msg.sender != owner) throw;
      draws[numDraws] = drawData(now, _eth_address);
      numDraws += 1;      
   }

   function getLatestDraw () constant returns (address _latest) {
      if (numDraws == 0) throw;
      _latest = draws[numDraws-1].eth_address;
   }

   function getPreviousDraw () constant returns (address _previous) {
      if (numDraws < 2) throw;
      _previous = draws[numDraws-2].eth_address;
   }

   function getPrizeValue(address _query) constant returns (uint _value) {
     drawInterface draw = drawInterface(getPreviousDraw());
     _value = draw.getPrizeValue(_query);
   }

}
