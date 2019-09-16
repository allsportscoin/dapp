export const contractAbi = `[
	{
		"constant": false,
		"inputs": [
			{
				"name": "matchId",
				"type": "uint256"
			},
			{
				"name": "result",
				"type": "uint256"
			}
		],
		"name": "addMatchGuessRecord",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "matchId",
				"type": "uint256"
			},
			{
				"name": "addr",
				"type": "address"
			}
		],
		"name": "getMatchAddressRecordInfo",
		"outputs": [
			{
				"name": "home_sum",
				"type": "uint256"
			},
			{
				"name": "draw_sum",
				"type": "uint256"
			},
			{
				"name": "away_sum",
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
		"name": "Pay",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getDataContractAddr",
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
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "getMatchInfoById",
		"outputs": [
			{
				"name": "match_id",
				"type": "uint256"
			},
			{
				"name": "official_name",
				"type": "string"
			},
			{
				"name": "home_team",
				"type": "string"
			},
			{
				"name": "guest_team",
				"type": "string"
			},
			{
				"name": "start_time",
				"type": "uint256"
			},
			{
				"name": "end_time",
				"type": "uint256"
			},
			{
				"name": "state",
				"type": "uint256"
			},
			{
				"name": "home_team_goals",
				"type": "uint256"
			},
			{
				"name": "guest_team_goals",
				"type": "uint256"
			},
			{
				"name": "home_sum",
				"type": "uint256"
			},
			{
				"name": "draw_sum",
				"type": "uint256"
			},
			{
				"name": "away_sum",
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
				"name": "addr",
				"type": "address"
			}
		],
		"name": "setDataContractAddr",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "matchId",
				"type": "uint256"
			}
		],
		"name": "lotteryMatch",
		"outputs": [
			{
				"name": "state",
				"type": "uint256"
			},
			{
				"name": "win_state",
				"type": "uint256"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getMatchMaxId",
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
				"name": "matchId",
				"type": "uint256"
			}
		],
		"name": "getGuesserAddressByMatchId",
		"outputs": [
			{
				"name": "addrs",
				"type": "address[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "refreshMatchInfo",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "GetBalance",
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
		"inputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "constructor"
	}
]`;
