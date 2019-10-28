<template>
    <div class="guess-content-container">
        <div class="guess-list">
            <p class="title">
                <b></b>
                <span class="title-text">{{ $t('dapp.matchInfo') }}</span>
            </p>
            <div class="contract-info">
                <div class="info-text">{{ $t('dapp.contractAddress') }}</div>
                <div class="info-value">{{ contract_addr }}</div>
            </div>
            <br>
            <div class="game-list-container">
                <div v-for="item in listData"
                     class="game-item-container"
                >
                    <div class="item-container clearfix" @click="goGuess(item)">
                        <span class="item-text">{{ $t('dapp.officialName') }}:</span>
                        <span class="item-value item-name"> {{ item.official_name }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text">{{ $t('dapp.homeTeam') }}:</span>
                        <span class="item-value">{{ item.home_team }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text">{{ $t('dapp.guestTeam') }}:</span>
                        <span class="item-value">{{ item.guest_team }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text">{{ $t('dapp.startTime') }}:</span>
                        <span class="item-value">{{ item.start_time }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text">{{ $t('dapp.endTime') }}:</span>
                        <span class="item-value">{{ item.end_time }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text">{{ $t('dapp.status') }}:</span>
                        <span class="item-value">{{ item.status }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text">{{ $t('dapp.homeTeamGoals') }}:</span>
                        <span class="item-value">{{ item.home_team_goals }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text">{{ $t('dapp.guestTeamGoals') }}:</span>
                        <span class="item-value">{{ item.guest_team_goals }}</span>
                    </div>
                    <div class="item-container clearfix">
                        <span class="item-text item-sp-text">{{ $t('dapp.sp') }}:</span>
                        <span class="item-value item-sp-value">
                            {{ $t('dapp.home') }}({{ item.home_sum }})
                            {{ $t('dapp.draw')}}({{ item.draw_sum }})
                              {{ $t('dapp.away')}}({{ item.away_sum }})
                        </span>
                    </div>
                    <div class="item-container clearfix" @click="handleOperation(item)">
                        <span class="item-text">{{ $t('dapp.operating') }}:</span>
                        <span class="item-value" :class="item.operationName">{{ item.opreation }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import DateTime from 'date-and-time';
import promisify from 'js-promisify';
import { contractAbi } from '../../abi/guessAbi.js';

const web3 = window.web3;
const env = process.env.NODE_ENV || 'development';
let Contract;
let myContract;
let address;
if (env === 'production') {
    address = '0x67c4e77c2afb322b62490ef92df66ef6abe6ad5c';
} else if (env === 'test') {
    address = '0x67c4e77c2afb322b62490ef92df66ef6abe6ad5c';
} else {
    address = '0x67c4e77c2afb322b62490ef92df66ef6abe6ad5c';
}
if (web3) {
    Contract = web3.eth.contract(JSON.parse(contractAbi), function (error, result) {
        if (!error) {
            console.log(JSON.stringify(result));
        } else {
            console.error(error);
        }
    });
    myContract = Contract.at(address);
}
export default {
    name: 'guessList',
    data () {
        return {
            contract_addr: '',
            listData: [],
            noData: this.$t('global.noData'),
            pageIndex: 1,
            operationName: '',
            params: `uint256 match_id, string official_name, string home_team, string guest_team,uint256 start_time, uint256 end_time, uint256 state, uint256 home_team_goals, uint256 guest_team_goals,uint256 home_sum, uint256 draw_sum, uint256 away_sum`
        };
    },
    created () {
        this.getListData();
        this.getAddress();
    },
    mounted () {
        if (!window.web3) {
            this.$toast(`${this.$t('global.installRemind')}`);
        }
    },
    methods: {
        getListData () {
            promisify(myContract.getMatchMaxId, []).then(result => {
                return result.toNumber ? result.toNumber() : result;
            }).then(max => {
                const mactchs = [];
                for (let i = 1; i <= max; i++) {
                    mactchs.push(promisify(myContract.getMatchInfoById, [i]));
                }
                return Promise.all(mactchs);
            }).then(result => {
                const params = this.params;
                return result.map(item => {
                    let keys = params.split(',');
                    let map = {};
                    keys.forEach((string, index) => {
                        let k = string.trim().split(' ');
                        if (k[0] === 'string') {
                            map[k[1]] = item[index];
                        } else {
                            map[k[1]] = item[index].toNumber ? item[index].toNumber() : item[index];
                        }
                    });
                    return map;
                });
            }).then(result => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].start_time === 0) {
                        result[i].start_time = '----';
                    } else {
                        result[i].start_time = DateTime.format(new Date(result[i].start_time * 1000), 'YYYY-MM-DD HH:mm:ss');
                    }
                    if (result[i].end_time === 0) {
                        result[i].end_time = '----';
                    } else {
                        result[i].end_time = DateTime.format(new Date(result[i].end_time * 1000), 'YYYY-MM-DD HH:mm:ss');
                    }
                    if (Number(result[i].state) === 0) {
                        result[i].status = this.$t('dapp.notBegin');
                        result[i].opreation = this.$t('dapp.bet');
                        result[i].operationName = 'item-value-bet';
                    }
                    if (Number(result[i].state) === 1) {
                        result[i].status = this.$t('dapp.playing');
                        result[i].opreation = '----';
                        this.operationName = '';
                    }
                    if (Number(result[i].state) === 2) {
                        result[i].status = this.$t('dapp.played');
                        result[i].opreation = this.$t('dapp.withDraw');
                        result[i].operationName = 'item-value-with-draw';
                    }
                    let total = (result[i].home_sum + result[i].draw_sum + result[i].away_sum) || 0;
                    result[i].home_sum = (result[i].home_sum && (total / result[i].home_sum).toFixed(2)) || '-';
                    result[i].draw_sum = (result[i].draw_sum && (total / result[i].draw_sum).toFixed(2)) || '-';
                    result[i].away_sum = (result[i].away_sum && (total / result[i].away_sum).toFixed(2)) || '-';
                }
                this.listData = result;
            }).catch(error => {
                console.error(error);
            });
        },
        getAddress () {
            promisify(myContract.getDataContractAddr, []).then((res) => {
                this.contract_addr = res;
            }).catch(error => {
                console.error(error);
            });
        },
        handleOperation (item) {
            if (Number(item.state === 0)) {
                this.goGuess(item);
                return;
            }
            if (Number(item.state === 2)) {
                this.lotteryMatch(item.id);
            }
        },
        lotteryMatch (id) {
            const matchId = parseInt(id, 10);
            promisify(myContract.lotteryMatch, [matchId]).then(response => {
                this.$toast(`${this.$t('dapp.txAddress')} ${response}`);
            }).catch(e => {
                this.$toast(`${this.$t('global.error')},${e.message}`);
            });
        },
        goGuess (item) {
            const { match_id, home_sum, draw_sum, away_sum } = item;
            let state = '';
            if (Number(item.state === 2)) {
                if (item.home_team_goals > item.guest_team_goals) {
                    state = 'home';
                } else if (item.home_team_goals === item.guest_team_goals) {
                    state = 'draw';
                } else if (item.home_team_goals < item.guest_team_goals) {
                    state = 'away';
                }
            }
            this.$router.push({
                name: 'guessDetail',
                query: { id: match_id, home_sum, draw_sum, away_sum, state, language: Vue.config.lang }
            });
        }
    }
};
</script>

<style scoped lang="less">
    .guess-content-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        padding-top: 30px;
        .title {
            padding-left: 10px;
            margin-bottom: 30px;
            b {
                display: inline-block;
                width: 6px;
                height: 40px;
                background-color: #2BAEF1;
            }
            .title-text {
                display: inline-block;
                vertical-align: top;
                font-size: 36px;
                line-height: 40px;
                font-weight: bold;
                margin-left: 10px;
            }
        }
        .contract-info {
            margin-top: 30px;
            padding: 0 30px;
            .info-text {
                text-align: center;
                font-size: 30px;
                line-height: 40px;
                margin-bottom: 10px;
                font-weight: bold;
            }
            .info-value {
                text-align: center;
                font-size: 30px;
                line-height: 40px;
                word-break: break-all;
                font-weight: bold;
                color: #999;
            }
        }
        .game-list-container {
            margin-top: 10px;
            padding: 0 30px;
            overflow: hidden;
            .game-item-container {
                border-top: 2px solid #CDCED3;
                padding: 15px 0;
                .item-container {
                    line-height: 60px;
                    .item-text {
                        display: block;
                        float: left;
                        font-size: 30px;
                        width: 300px;
                    }
                    .item-value {
                        display: block;
                        width: 300px;
                        float: right;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 30px;
                        text-align: right;
                    }
                    .item-value-bet {
                        color: #f90;
                    }
                    .item-value-with-draw {
                        color: #19be6b;
                    }
                    .item-name {
                        color: #2BAEF1;
                    }
                    .item-sp-text {
                        width: 100px;
                    }
                    .item-sp-value {
                        width: 500px;
                    }
                }
                &:last-child {
                    border-bottom: 2px solid #CDCED3;
                }
            }
        }
    }
</style>
