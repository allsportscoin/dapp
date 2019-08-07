<template>
    <div class="ryb-outer-container">
        <div class="ryb-bg-container">
            <div class="rby-detail-content-container">
                <h3 class="game-title">{{ $t('dapp.rybTittle') }}</h3>
                <div class="player-container">
                    <div :class="['red-container', 'section-one', beginAnimation ? 'red-animation-container': '']">
                        <div class="unJoin-container"
                             @click="redUserInfo.address !== zeroAddress && redUserInfo.address ? '': joinGame(gameKey,0)">
                            <img src="../assets/defalutLogo.png" alt="" class="default-avatar">
                            <div
                                class="join">
                                {{ redUserInfo.address !== zeroAddress && redUserInfo.address ? $t('dapp.joined'):
                                $t('dapp.join')}}
                            </div>
                            <div class="joined-info" v-if="redUserInfo.address !== zeroAddress && redUserInfo.address">
                                <div class="address">{{ $t('dapp.address') }}: {{ redUserInfo.address }}</div>
                                <div class="commit">{{ $t('dapp.commit') }}: {{ redUserInfo.commit }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="section-two">
                        <div v-if="win_num === ''" class="begin">
                            {{ $t('dapp.notBegin') }}
                        </div>
                        <div v-else-if="win_num === 3" class="inDraw">
                            {{ $t('dapp.inDraw') }}
                        </div>
                        <div
                            v-else
                            :class="win_num === 0 && 'red-win' || win_num === 1 && 'yellow-win' || win_num === 2 && 'blue-win'">
                            {{ $tc('dapp.winNumText', win_num ) }}
                        </div>
                    </div>
                    <div class="section-three clearfix">
                        <div :class="['yellow-container',  beginAnimation ? 'yellow-animation-container': '']">
                            <div class="unJoin-container"
                                 @click=" yellowUserInfo.address !== zeroAddress && yellowUserInfo.address ? '': joinGame(gameKey,1)">
                                <img src="../assets/defalutLogo.png" alt="" class="default-avatar">
                                <div
                                    class="join">
                                    {{ yellowUserInfo.address !== zeroAddress && yellowUserInfo.address ?
                                    $t('dapp.joined'): $t('dapp.join')}}
                                    <div class="joined-info"
                                         v-if="yellowUserInfo.address !== zeroAddress && yellowUserInfo.address">
                                        <div class="address">{{ $t('dapp.address') }}: {{ yellowUserInfo.address }}
                                        </div>
                                        <div class="commit">{{ $t('dapp.commit') }}: {{ yellowUserInfo.commit }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div :class="['blue-container',  beginAnimation ? 'blue-animation-container': '']">
                            <div class="unJoin-container"
                                 @click=" blueUserInfo.address !== zeroAddress && blueUserInfo.address ? '': joinGame(gameKey,2)">
                                <img src="../assets/defalutLogo.png" alt="" class="default-avatar">
                                <div
                                    class="join">
                                    {{ blueUserInfo.address !== zeroAddress && blueUserInfo.address ? $t('dapp.joined'):
                                    $t('dapp.join')}}
                                </div>
                                <div class="joined-info"
                                     v-if="blueUserInfo.address !== zeroAddress && blueUserInfo.address">
                                    <div class="address">{{ $t('dapp.address') }}: {{ blueUserInfo.address }}</div>
                                    <div class="commit">{{ $t('dapp.commit') }}: {{ blueUserInfo.commit }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="title-text">{{ $t('dapp.historyList') }}</div>
                <div class="history-list-container"
                     @touchstart=touchStart
                     @touchmove=touchMove
                     @touchend=touchEnd>
                    <div v-for="item in listData"
                         class="history-item-container"
                    >
                        <div class="item-key clearfix">
                            <span class="item-key-text">{{ $t('dapp.createTime') }}:</span>
                            <span class="item-value">{{ item.end_time}}</span></div>
                        <div class="item-key clearfix">
                            <span class="item-key-text">{{ $t('dapp.gameKey') }}:</span>
                            <span class="item-value">{{ item.game_key}}</span></div>
                        <div class="item-amount clearfix">
                            <span class="item-amount-text">{{ $t('dapp.gameAmount') }}:</span>
                            <span class="item-value"> {{ item.amount }}</span>
                        </div>
                        <div class="item-amount clearfix">
                            <span class="item-amount-text">{{ $t('dapp.gameResult') }}:</span>
                            <span class="item-value"
                                  :class="{'red-win':  Number(item.result) === 0, 'yellow-win': Number(item.result) === 1,'blue-win':  Number(item.result) === 2 }">
                                {{
                                Number(item.result) === 0 &&  $t('dapp.redWin') ||
                                 Number(item.result) === 1 &&  $t('dapp.yellowWin') ||
                                 Number(item.result) === 2 &&  $t('dapp.blueWin')
                                }}
                            </span>
                        </div>
                        <div class="item-red clearfix">
                            <span class="item-red-text">{{ $t('dapp.red') }}:</span>
                            <span class="item-value red-address">{{ item.red_address === zeroAddress || !item.red_address ? $t('dapp.join') : item.red_address }}</span>
                        </div>
                        <div class="item-yellow clearfix">
                            <span class="item-yellow-text">{{ $t('dapp.yellow') }}:</span>
                            <span class="item-value yellow-address">{{ item.yellow_address === zeroAddress || !item.yellow_address ?
                    $t('dapp.join') : item.yellow_address }}</span>
                        </div>
                        <div class="item-blue clearfix">
                            <span class="item-blue-text">{{ $t('dapp.blue') }}:</span>
                            <span class="item-value blue-address">{{ item.blue_address === zeroAddress || !item.blue_address
                    ? $t('dapp.join')
                    : item.blue_address }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Loading v-if="loading"></Loading>
    </div>
</template>

<script>
import Vue from 'vue';
import config from '../../../../../bin/config';
import { contractAbi } from '../../abi/rybAbi.js';

const web3 = window.web3;
const env = process.env.NODE_ENV || 'development';
let Contract;
let myContract;
let address;

if (env === 'production') {
    address = '0xb93ef6c7ffb2b246078e246fc7818234d2c878e9';
} else if (env === 'test') {
    address = '0xb93ef6c7ffb2b246078e246fc7818234d2c878e9';
} else {
    address = '0xb93ef6c7ffb2b246078e246fc7818234d2c878e9';
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
    name: 'RybDetail',
    data () {
        return {
            gameKey: '',
            listData: [],
            noData: this.$t('global.noData'),
            joinCount: 0,
            win_num: '',
            redUserInfo: {},
            yellowUserInfo: {},
            blueUserInfo: {},
            zeroAddress: '0x0000000000000000000000000000000000000000',
            getGameInfoInterval: '',
            queryResultInterval: '',
            amount: 0,
            beginAnimation: false,
            minId: '', // 请求开奖记录时 分页信息中取 默认空
            clickAble: true,
            pageIndex: 1,
            pageCount: 10,
            status: 'pull',
            shouldReload: false,
            loading: false,
            allData: false,
            treshold: 50,
            isFirst: true,
            startY: 0
        };
    },
    beforeRouteUpdate (to, from, next) {
        next();
        this.init();
    },
    mounted () {
        this.init();
        this.getGameInfoInterval = setInterval(() => {
            this.getGameInfo();
        }, 1000);
    },
    methods: {
        init () {
            this.gameKey = this.$route.query.gameKey || '';
            this.minId = Number(this.$route.query.minId) || '';
            this.getHistoryList();
        },
        getHistoryList () {
            this.loading = true;
            this.$http.get(`${config.apiDomain}/game/getRYBHistory?key=${this.gameKey}&page_num=${this.pageIndex}&page_size=${this.pageCount}&min_id=${this.minId}`).then(res => {
                this.loading = false;
                let data = res.data;
                if (data.errno === 0) {
                    let listData = data.data.items || [];
                    for (let i = 0; i < listData.length; i++) {
                        listData[i].amount = window.web3.fromWei(listData[i].amount, 'ether') || '-';
                    }
                    this.listData = [...this.listData, ...listData];
                    this.minId = data.data.page_info.min_id;
                    if (this.listData.length === Number(data.data.page_info.total_num)) {
                        this.updateStatus('noMore');
                    }
                } else {
                    this.loading = false;
                    this.listData = [];
                    this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                }
            }).catch(() => {
                this.loading = false;
                this.listData = [];
                this.$toast(this.$t('global.somethingError'));
            });
        },
        joinGame (key, colour) {
            if (!this.clickAble) {
                return;
            }
            this.clickAble = false;
            this.$http.get(`${config.apiDomain}/game/getkeycolour?key=${key}&colour=${colour}`).then(res => {
                let data = res.data;
                if (data.errno === 0) {
                    let commit = data.data.key;
                    // call 调链发起交易
                    this.callJoinBet(key, colour, commit);
                } else {
                    this.clickAble = true;
                    this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                }
            }).catch(() => {
                this.clickAble = true;
                this.$toast(this.$t('global.somethingError'));
            });
        },
        callJoinBet (key, colour, commit) {
            myContract.joinBet(key, colour, commit, {
                value: this.amount,
                gas: 300000
            }, (error, res) => {
                if (error) {
                    this.clickAble = true;
                    this.$toast(`${this.$t('global.error')},${error.message}`);
                    return;
                }
                if (res) {
                    // 调后台把 key, tx, colour 传到后台
                    this.$http.post(`${config.apiDomain}/game/updaterybtx`, {
                        key,
                        colour,
                        tx: res
                    }).then(res => {
                        let data = res.data;
                        if (data.errno === 0) {
                            this.clickAble = true;
                            this.$toast(`${this.$t('dapp.joinSuccess')}`);
                        } else {
                            this.clickAble = true;
                            this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                        }
                    }).catch(() => {
                        this.clickAble = true;
                        this.$toast(this.$t('global.somethingError'));
                    });
                }
            });
        },
        getGameInfo () {
            this.$http.get(`${config.apiDomain}/game/getrybs?key=${this.gameKey}`).then(res => {
                let data = res.data;
                if (data.errno === 0 && data.data.items) {
                    Vue.set(this.redUserInfo, 'address', data.data.items[0].red_address);
                    Vue.set(this.redUserInfo, 'commit', data.data.items[0].red_commit);
                    Vue.set(this.yellowUserInfo, 'address', data.data.items[0].yellow_address);
                    Vue.set(this.yellowUserInfo, 'commit', data.data.items[0].yellow_commit);
                    Vue.set(this.blueUserInfo, 'address', data.data.items[0].blue_address);
                    Vue.set(this.blueUserInfo, 'commit', data.data.items[0].blue_commit);
                    this.amount = data.data.items[0].amount;
                    if (Number(data.data.items[0].state) === 1) {
                        if (!this.beginAnimation && this.win_num === '') {
                            this.beginAnimation = true;
                        }
                        if (this.win_num === '' || this.win_num === 3) {
                            this.win_num = 3;
                            this.queryLotteryResult();
                        }
                    } else {
                        if (this.win_num === 0 || this.win_num === 1 || this.win_num === 2) {
                            this.beginAnimation = false;
                            this.win_num = '';
                        }
                    }
                } else {
                    this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                }
            }).catch((e) => {
                this.$toast(this.$t('global.somethingError'));
            });
        },
        queryLotteryResult () {
            this.$http.get(`${config.apiDomain}/game/getRYBResult?key=${this.gameKey}`).then(res => {
                let data = res.data;
                // this.win_num = 3;
                if (data.errno === 0) {
                    if (data.data.win_num !== '') {
                        // setTimeout(() => {
                        this.win_num = Number(data.data.win_num);
                        this.beginAnimation = false;
                        this.pageIndex = 1;
                        this.listData = [];
                        this.minId = '';
                        this.getHistoryList();
                        // }, 2000);
                    }
                } else {
                    this.win_num = '';
                    this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                }
            }).catch(() => {
                this.win_num = '';
                this.$toast(this.$t('global.somethingError'));
            });
        },

        touchStart (e) {
            if (this.status !== 'pull') {
                return false;
            }
            this.startY = e.targetTouches[0].pageY;
            this.updateStatus('pull');
            return true;
        },

        touchMove (e) {
            const scrollTop = document.body.scrollTop;
            const innerHeight = document.body.clientHeight;
            const offsetHeight = document.body.offsetHeight;
            const { shouldReload, treshold, loading, allData } = this;
            if (e.targetTouches[0].pageY > this.startY) { // 下拉
                return;
            }
            if (
                scrollTop + innerHeight + treshold >= offsetHeight &&
                !shouldReload &&
                !loading &&
                !allData
            ) {
                this.updateStatus('release');
            } else if (
                scrollTop + innerHeight + treshold < offsetHeight &&
                shouldReload &&
                !loading &&
                !allData
            ) {
                this.updateStatus('pull');
            }
            return true;
        },

        touchEnd () {
            const { shouldReload, loading, allData } = this;
            if (!shouldReload || loading || allData) {
                return false;
            }
            this.updateStatus('loading');
            this.pageIndex = (this.pageIndex + 1);
            this.getHistoryList();
            return true;
        },
        updateStatus (status) {
            this.shouldReload = (status === 'release' && true) || false;
            this.loading = (status === 'loading' && true) || false;
            this.allData = (status === 'noMore' && true) || false;
            this.status = status;
            this.isFirst = false;
        }
    },
    destroyed () {
        clearInterval(this.getGameInfoInterval);
        clearInterval(this.queryResultInterval);
    }
};
</script>

<style lang="less">
    .ryb-outer-container {
        background-color: #000;
        .ryb-bg-container {
            padding-top: 50px;
            .rby-detail-content-container {
                .game-title {
                    font-size: 45px;
                    color: #fff;
                    text-align: center;
                    margin-bottom: 50px;
                }
                .player-container {
                    padding-top: 20px;
                    margin-bottom: 80px;
                    .red-container {
                        width: 260px;
                        margin: 0 auto;
                        border: 1px solid #e4202f;
                        height: 200px;
                        background: #e4202f;
                        position: relative;
                    }
                    .red-animation-container {
                        animation: redBg 0.5s infinite;
                        -webkit-animation: redBg 0.5s infinite;
                    }
                    .section-two {
                        width: 130px;
                        margin: 0 auto;
                        height: 130px;
                        margin-top: 25px;
                        line-height: 130px;
                        font-size: 16px;
                        text-align: center;
                        .red-win,
                        .yellow-win,
                        .blue-win,
                        .begin,
                        .inDraw {
                            width: 100%;
                            height: 100%;
                            color: #fff;
                        }
                        .red-win {
                            background-color: #e4202f;
                        }
                        .blue-win {
                            background-color: #208ae4;
                        }
                        .yellow-win {
                            background-color: #e4cb20;
                        }
                        .begin,
                        .inDraw {
                            background-color: #000;
                        }
                    }
                    .section-three {
                        width: 600px;
                        height: 200px;
                        margin: 0 auto;
                        margin-top: 25px;
                        .yellow-container {
                            width: 260px;
                            height: 200px;
                            float: left;
                            border: 1px solid #e4cb20;
                            background: #e4cb20;
                            position: relative;
                        }
                        .yellow-animation-container {
                            animation: yellowBg 0.5s infinite;
                            -webkit-animation: yellowBg 0.5s infinite;
                            animation-delay: 0.3s;
                        }
                        .blue-container {
                            width: 260px;
                            height: 200px;
                            float: right;
                            border: 1px solid #208ae4;
                            background: #208ae4;
                            position: relative;
                        }
                        .blue-animation-container {
                            animation: blueBg 0.5s infinite;
                            -webkit-animation: blueBg 0.5s infinite;
                            animation-delay: 0.6s;
                        }
                    }
                    .joined-info {
                        display: none;
                        position: absolute;
                        background-color: rgba(0, 0, 0, .3);
                        top: 0;
                        height: 100%;
                        .address,
                        .commit {
                            font-size: 14px;
                            word-break: break-all;
                            color: #fff;
                            text-align: left;
                            padding: 5px;
                        }
                        .commit {
                            margin-top: 5px;
                        }
                    }
                    .red-container,
                    .yellow-container,
                    .blue-container {
                        &:hover {
                            .joined-info {
                                display: block;
                            }
                        }
                    }
                    .unJoin-container {
                        text-align: center;
                        padding-top: 30px;
                    }
                    .default-avatar {
                        width: 90px;
                        border-radius: 50%;
                    }
                    .join {
                        font-size: 30px;
                        cursor: pointer;
                        color: #0c43e9;
                        margin-top: 10px;
                    }
                }
                .history-list-container {
                    padding: 0 30px;
                    overflow: hidden;
                    .history-item-container {
                        border-bottom: 2px solid #fff;
                        padding: 20px 0;
                        .item-key,
                        .item-amount,
                        .item-red,
                        .item-blue,
                        .item-yellow {
                            /*height: 50px;*/
                            color: #fff;
                            line-height: 50px;
                            .item-key-text,
                            .item-amount-text,
                            .item-red-text,
                            .item-blue-text,
                            .item-yellow-text {
                                display: block;
                                float: left;
                                font-size: 30px;
                                width: 180px;
                            }
                            .item-value {
                                display: block;
                                width: 460px;
                                float: right;
                                /*overflow: hidden;*/
                                /*white-space: nowrap;*/
                                /*text-overflow: ellipsis;*/
                                font-size: 30px;
                                word-break: break-all;
                            }
                            .red-win,
                            .red-address {
                                color: #e4202f;
                            }
                            .yellow-win,
                            .yellow-address {
                                color: #e4cb20;
                            }
                            .blue-win,
                            .blue-address {
                                color: #208ae4;
                            }
                        }
                        &:last-child {
                            border: none;
                        }
                    }
                }
                .title-text {
                    color: #fff;
                    font-size: 36px;
                    text-align: center;
                    font-weight: bold;
                    margin-bottom: 30px;
                }
                @keyframes redBg {
                    0% {
                        background: #fff;
                    }
                    100% {
                        background: #e4202f;
                    }
                }
                @keyframes yellowBg {
                    0% {
                        background: #fff;
                    }
                    100% {
                        background: #e4cb20;
                    }
                }
                @keyframes blueBg {
                    0% {
                        background: #fff;
                    }
                    100% {
                        background: #208ae4;
                    }
                }
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
