<template>
    <div class="guess-detail-content-container">
        <div class="article-list">
            <p class="title">
                <b></b>
                <span class="title-text">{{ $t('dapp.guessInfo') }}</span>
            </p>
            <div>
                <div class="rate-container">
                    <span>{{ $t('dapp.sp') }}:</span>
                    <span>{{ $t('dapp.home') }}（{{ home_sum }}）</span>
                    <span>{{ $t('dapp.draw') }}（{{ draw_sum }}）</span>
                    <span>{{ $t('dapp.away') }}（{{ away_sum }}）</span>
                </div>
                <div class="to-bet-container">
                        <span>
                            <input type="number" pattern="\d*" v-model="betValue" class="enter-input" min="0" />(SOC)
                        </span>
                    <span @click="bet(0)" class="home-btn">{{ $t('dapp.home') }}</span>
                    <span @click="bet(1)" class="draw-btn">{{ $t('dapp.draw') }}</span>
                    <span @click="bet(2)" class="away-btn">{{ $t('dapp.away') }}</span>
                </div>
            </div>
            <div class="tab-groups">
                    <span @click="onChangeTab(1)"
                          :class="['tab', currentTab === 1? 'tabActive': '']">{{ $t('dapp.betHome') }}</span>
                <span @click="onChangeTab(2)"
                      :class="['tab',currentTab === 2? 'tabActive': '']">{{ $t('dapp.betDraw') }}</span>
                <span @click="onChangeTab(3)"
                      :class="['tab',currentTab === 3? 'tabActive': '']">{{ $t('dapp.betAway') }}</span>
            </div>
            <div class="bet-list-container">
                <div v-for="item in winData" v-if="currentTab === 1" class="bet-item-container">
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betAddress') }}:</span>
                        <span class="item-value">{{ item.address }}</span>
                    </div>
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betAmount') }}:</span>
                        <span class="item-value">{{ item.home_sum}}</span></div>
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betResult') }}:</span>
                        <span :class="['item-value', state === 'home'? 'resultColorOne' : 'resultColorTwo']">
                            {{ computeResult(state, away_sum, item.away_sum, 'home')}}
                        </span>
                    </div>
                </div>
                <div v-for="item in drawData" v-if="currentTab === 2" class="bet-item-container">
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betAddress') }}:</span>
                        <span class="item-value">{{ item.address }}</span>
                    </div>
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betAmount') }}:</span>
                        <span class="item-value">{{ item.draw_sum}}</span></div>
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betResult') }}:</span>
                        <span :class="['item-value', state === 'draw'? 'resultColorOne' : 'resultColorTwo']">
                            {{ computeResult(state, away_sum, item.away_sum, 'draw')}}
                        </span>
                    </div>
                </div>
                <div v-for="item in loseData" v-if="currentTab === 3" class="bet-item-container">
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betAddress') }}:</span>
                        <span class="item-value">{{ item.address }}</span>
                    </div>
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betAmount') }}:</span>
                        <span class="item-value">{{ item.away_sum}}</span></div>
                    <div class="every-item clearfix">
                        <span class="item-text">{{ $t('dapp.betResult') }}:</span>
                        <span :class="['item-value', state === 'away'? 'resultColorOne' : 'resultColorTwo']">
                            {{ computeResult(state, away_sum, item.away_sum, 'away')}}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
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
    name: 'guessDetail',
    data () {
        return {
            datas: [],
            betValue: 0,
            state: '',
            home_sum: '-',
            draw_sum: '-',
            away_sum: '-',
            currentTab: 1,
            noData: this.$t('global.noData')
        };
    },
    created () {
        this.init();
    },
    computed: {
        winData () {
            return this.datas.filter(item => item.home_sum > 0);
        },
        drawData () {
            return this.datas.filter(item => item.draw_sum > 0);
        },
        loseData () {
            return this.datas.filter(item => item.away_sum > 0);
        }
    },
    methods: {
        init () {
            const matchId = parseInt(this.$route.query.id, 10);
            this.state = this.$route.query.state || '';
            this.home_sum = this.$route.query.home_sum || '-';
            this.draw_sum = this.$route.query.draw_sum || '-';
            this.away_sum = this.$route.query.away_sum || '-';
            this.currentTab = this.$route.query.currentTab || 1;
            promisify(myContract.getGuesserAddressByMatchId, [matchId]).then(address => {
                const map = address.map(item => promisify(myContract.getMatchAddressRecordInfo, [matchId, item]));
                return Promise.all(map).then(records => {
                    let r = records.map(i => i.map(m => m.toNumber()));
                    r.forEach((record, i) => {
                        record.unshift(address[i]);
                    });
                    return r;
                });
            }).then(result => {
                const keys = ['address', 'home_sum', 'draw_sum', 'away_sum'];
                return result.map((item) => {
                    const map = {};
                    keys.forEach((key, i) => {
                        if (key !== 'address') {
                            map[key] = web3.fromWei(item[i]);
                        } else {
                            map[key] = item[i];
                        }
                    });
                    return map;
                });
            }).then(datas => {
                this.datas = datas;
            }).catch(error => {
                console.error(error);
            });
        },
        computeResult (state, sp, amount, type) {
            if (state && sp && amount) {
                if (state === type) {
                    return `+${sp * amount}`;
                } else {
                    return `-${amount}`;
                }
            } else {
                return '-';
            }
        },
        bet (result) {
            if (!this.betValue || this.betValue < 0) {
                this.$toast(`${this.$t('global.bigThanZero')}`);
                return;
            }
            const matchId = parseInt(this.$route.query.id, 10);
            promisify(myContract.addMatchGuessRecord, [matchId, result, { value: web3.toWei(this.betValue, 'ether') }]).then(response => {
                this.init();
                this.$toast(`${this.$t('dapp.txAddress')} ${response}`);
            }).catch(e => {
                this.$toast(`${this.$t('global.error')}, ${e.message}`);
            });
        },
        lotteryMatch () {
            const matchId = parseInt(this.$route.query.id, 10);
            promisify(myContract.lotteryMatch, [matchId]).then(response => {
                this.$toast(`${this.$t('dapp.txAddress')} ${response}`);
            }).catch(e => {
                this.$toast(`${this.$t('global.error')}, ${e.message}`);
            });
        },
        onChangeTab (value) {
            if (this.currentTab === value) {
                return;
            }
            this.currentTab = value;
        }
    }
};
</script>

<style lang="less" scoped>
    .guess-detail-content-container {
        width: 100%;
        overflow: hidden;
        padding-top: 30px;
        background-color: #000;
        .title {
            color: #fff;
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
        .tab-groups {
            padding-left: 30px;
            margin-top: 50px;
            margin-bottom: 20px;
            .tab {
                color: #fff;
                font-size: 32px;
                margin-right: 20px;
            }
            .tabActive {
                color: #2BAEF1;
            }
        }
        .rate-container {
            color: #fff;
            text-align: center;
            font-size: 30px;
            font-weight: bold;
        }
        .to-bet-container {
            margin-top: 50px;
            text-align: center;
            color: #fff;
        }
        .enter-input {
            width: 150px;
            outline: none;
            padding: 10px 10px 12px;
            font-size: 24px;
            border-radius: 4px;
            border: 2px solid #ccc;
        }
        .home-btn,
        .draw-btn,
        .away-btn {
            color: #fff;
            background-color: #ed4014;
            border-color: #ed4014;
            font-weight: 400;
            text-align: center;
            touch-action: manipulation;
            cursor: pointer;
            padding: 10px 36px 12px;
            font-size: 24px;
            border-radius: 4px;
        }
        .home-btn {
            margin-left: 20px;
        }
        .draw-btn {
            margin-left: 10px;
            background-color: #f90;
            border-color: #f90;
        }
        .away-btn {
            margin-left: 10px;
            background-color: #2d8cf0;
            border-color: #2d8cf0;
        }
        .bet-list-container {
            color: #fff;
            overflow: hidden;
            .bet-item-container {
                padding: 20px 30px;
                border-bottom: 2px solid #fff;
                .every-item {
                    color: #fff;
                    line-height: 50px;
                    .item-text,
                    .item-text,
                    .item-text,
                    .item-text,
                    .item-text {
                        display: block;
                        float: left;
                        font-size: 30px;
                        width: 240px;
                    }
                    .item-value {
                        display: block;
                        width: 420px;
                        float: right;
                        font-size: 30px;
                        word-break: break-all;
                    }
                    .resultColorOne {
                        color: #19be6b;
                    }
                    .resultColorTwo {
                        color: #dd4b39;
                    }
                }
                &:last-child {
                    border: none;
                }
            }
            .item-info-win-row {
                background-color: green;
            }
            .item-info-lose-row {
                background-color: #e4202f;
            }
        }
        &:before {
            content: " ";
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background-color: #000;
            z-index: -100;
        }
    }

</style>
