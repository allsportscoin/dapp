export const contractAbi = `[
	{
		"constant": false,
		"inputs": [],
		"name": "withDraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "setOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "key",
				"type": "uint256"
			},
			{
				"name": "color",
				"type": "uint256"
			},
			{
				"name": "commit",
				"type": "uint256"
			}
		],
		"name": "joinBet",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "key",
				"type": "uint256"
			}
		],
		"name": "getBetInfo",
		"outputs": [
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "num",
				"type": "uint256"
			},
			{
				"name": "red",
				"type": "address"
			},
			{
				"name": "redCommit",
				"type": "uint256"
			},
			{
				"name": "yellow",
				"type": "address"
			},
			{
				"name": "yellowCommit",
				"type": "uint256"
			},
			{
				"name": "blue",
				"type": "address"
			},
			{
				"name": "blueCommit",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint256"
			},
			{
				"name": "count",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "reveal",
				"type": "uint256"
			}
		],
		"name": "getRevealCommit",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "key",
				"type": "uint256"
			},
			{
				"name": "redRevealreveal",
				"type": "uint256"
			},
			{
				"name": "yellowReveal",
				"type": "uint256"
			},
			{
				"name": "blueReveal",
				"type": "uint256"
			}
		],
		"name": "settleBet",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "redReveal",
				"type": "uint256"
			},
			{
				"name": "yellowReveal",
				"type": "uint256"
			},
			{
				"name": "blueReveal",
				"type": "uint256"
			}
		],
		"name": "getRandomNum",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "key",
				"type": "uint256"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "createBet",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	}
]`;
