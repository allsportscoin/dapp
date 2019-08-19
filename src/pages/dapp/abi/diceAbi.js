export const contractAbi = `[
	{
		"constant": true,
		"inputs": [
			{
				"name": "reveal",
				"type": "uint256"
			},
			{
				"name": "blockHash",
				"type": "bytes32"
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
		"inputs": [],
		"name": "withDraw",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
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
		"constant": false,
		"inputs": [
			{
				"name": "num",
				"type": "uint256"
			},
			{
				"name": "commit",
				"type": "uint256"
			}
		],
		"name": "placeBet",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
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
		"constant": true,
		"inputs": [
			{
				"name": "commit",
				"type": "uint256"
			}
		],
		"name": "getCommitBetInfo",
		"outputs": [
			{
				"name": "num",
				"type": "uint256"
			},
			{
				"name": "amount",
				"type": "uint256"
			},
			{
				"name": "placeBlockNumber",
				"type": "uint256"
			},
			{
				"name": "gambler",
				"type": "address"
			},
			{
				"name": "isOver",
				"type": "uint256"
			},
			{
				"name": "bet_commit",
				"type": "uint256"
			},
			{
				"name": "sha3_reveal_blk",
				"type": "bytes32"
			},
			{
				"name": "dice",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
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
		"constant": false,
		"inputs": [
			{
				"name": "reveal",
				"type": "uint256"
			},
			{
				"name": "blockHash",
				"type": "bytes32"
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
				"indexed": false,
				"name": "commit",
				"type": "uint256"
			}
		],
		"name": "Commit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "gambler",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "winValue",
				"type": "uint256"
			}
		],
		"name": "WinTransfer",
		"type": "event"
	}
]`;
