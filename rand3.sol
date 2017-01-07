import "oraclizeAPI.sol";

contract rand is usingOraclize {
  
  string public res;

  function rand() {
    res = "nothing";
  }
 
  function makerandom() {
   oraclize_query("WolframAlpha", "random number between 1 and 1000", 2000000);
  }

  function __callback(bytes32 id, string result) {
    res = result;
  }
}
