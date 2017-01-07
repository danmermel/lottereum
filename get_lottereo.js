var add="0x93ff7ee96a55f777f311f511b19586393f5598df";
var abi = [{
    constant: true,
    inputs: [{
        name: "",
        type: "uint256"
    }],
    name: "draws",
    outputs: [{
        name: "drawDate",
        type: "uint256"
    }, {
        name: "eth_address",
        type: "address"
    }],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "getPot",
    outputs: [{
        name: "pot",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "getLatestDraw",
    outputs: [{
        name: "_latest",
        type: "address"
    }],
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "_guess",
        type: "uint256"
    }],
    name: "buyTicket",
    outputs: [],
    type: "function"
}, {
    constant: false,
    inputs: [{
        name: "_eth_address",
        type: "address"
    }],
    name: "addDraw",
    outputs: [],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "getWinningNumber",
    outputs: [{
        name: "_winner",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "numDraws",
    outputs: [{
        name: "",
        type: "uint256"
    }],
    type: "function"
}, {
    constant: true,
    inputs: [],
    name: "getPreviousDraw",
    outputs: [{
        name: "_previous",
        type: "address"
    }],
    type: "function"
}, {
    constant: true,
    inputs: [{
        name: "_query",
        type: "address"
    }],
    name: "getPrizeValue",
    outputs: [{
        name: "_value",
        type: "uint256"
    }],
    type: "function"
}, {
    inputs: [],
    type: "constructor"
}]

var lottereo = eth.contract(abi).at(add);


