<template>
    <div class="rby-content-container">
        <div class="top-input-container">
            <div class="input-key-wrap">
                <input :placeholder="$t('dapp.keySearch')" v-model="gameKey" class="input-key"
                       @keyup.enter="handleSearch" />
                <b class="search-btn" @click="handleSearch"></b>
                <span class="add" @click="openCreateModal"></span>
            </div>
        </div>
        <div class="game-list-container"
             @touchstart=touchStart
             @touchmove=touchMove
             @touchend=touchEnd>
            <div v-for="item in listData"
                 class="game-item-container"
                 @click="goGameDetail(item.game_key)"
            >
                <div class="item-key clearfix">
                    <span class="item-key-text">{{ $t('dapp.gameKey') }}:</span>
                    <span class="item-value">{{ item.game_key}}</span></div>
                <div class="item-amount clearfix">
                    <span class="item-amount-text">{{ $t('dapp.gameAmount') }}:</span>
                    <span class="item-value"> {{ item.amount }}</span>
                </div>
                <div class="item-red clearfix">
                    <span class="item-red-text">{{ $t('dapp.red') }}:</span>
                    <span class="item-value">{{ item.red_address === zeroAddress || !item.red_address ? $t('dapp.join') : item.red_address }}</span>
                </div>
                <div class="item-yellow clearfix">
                    <span class="item-yellow-text">{{ $t('dapp.yellow') }}:</span>
                    <span class="item-value">{{ item.yellow_address === zeroAddress || !item.yellow_address ?
                    $t('dapp.join') : item.yellow_address }}</span>
                </div>
                <div class="item-blue clearfix">
                    <span class="item-blue-text">{{ $t('dapp.blue') }}:</span>
                    <span class="item-value">{{ item.blue_address === zeroAddress || !item.blue_address
                    ? $t('dapp.join')
                    : item.blue_address }}</span>
                </div>
            </div>
        </div>
        <div class="create-game-modal-container" v-if="isCreateModalShow">
            <div class="create-game-modal-wrap">
                <div class="input-wrap">
                    <span class="input-label">{{ $t('dapp.key') }}:</span>
                    <input type="text" v-model="createKey" disabled />
                </div>
                <div class="input-wrap">
                    <span class="input-label">{{ $t('dapp.gameAmount') }}:</span>
                    <input type="number" v-model="createAmountVal" pattern="\d*" class="number-input" />
                    <span class="unit">SOC</span>
                </div>
                <div class="button-group">
                    <span @click="cancelCreateGame" class="cancel">{{ $t('dapp.cancel') }}</span>
                    <span @click="createGame" class="confirm">{{ $t('dapp.createGame') }}</span>
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
    name: 'rybList',
    data () {
        return {
            gameKey: '',
            listData: [],
            isCreateModalShow: false,
            noData: this.$t('global.noData'),
            createKey: '',
            createAmountVal: '',
            zeroAddress: '0x0000000000000000000000000000000000000000',
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
        this.listData = [];
        this.pageIndex = 1;
        this.searchGame();
    },
    mounted () {
        this.searchGame();
    },
    methods: {
        handleSearch () {
            this.listData = [];
            this.searchGame();
        },
        searchGame () {
            this.loading = true;
            this.$http.get(`${config.apiDomain}/game/getrybs?key=${this.gameKey}&page_num=${this.pageIndex}&page_size=${this.pageCount}`).then(res => {
                this.loading = false;
                let data = res.data;
                if (data.errno === 0) {
                    let listData = data.data.items || [];
                    for (let i = 0; i < listData.length; i++) {
                        listData[i].amount = window.web3.fromWei(listData[i].amount, 'ether') || '-';
                    }
                    this.listData = [...this.listData, ...listData];
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

        joinGame (key, colour, amount) {
            this.$http.get(`${config.apiDomain}/game/getkeycolour?key=${key}&colour=${colour}`).then(res => {
                let data = res.data;
                if (data.errno === 0) {
                    let commit = data.data.key;
                    // call 调链发起交易
                    this.callJoinBet(key, colour, commit, amount);
                } else {
                    this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                }
            }).catch(() => {
                this.$toast(this.$t('global.somethingError'));
            });
        },

        callJoinBet (key, colour, commit, amount) {
            myContract.joinBet(key, colour, commit, {
                value: amount,
                gas: 300000
            }, (error, res) => {
                if (error) {
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
                            this.$toast(`${this.$t('dapp.joinSuccess')}`);
                            this.$router.push({
                                name: 'rybDetail',
                                query: { gameKey: key, language: Vue.config.lang }
                            });
                        } else {
                            this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                        }
                    }).catch(() => {
                        this.$toast(this.$t('global.somethingError'));
                    });
                }
            });
        },

        openCreateModal () {
            this.isCreateModalShow = true;
            this.$http.get(`${config.apiDomain}/game/getrybkey`).then(res => {
                let data = res.data;
                if (data.errno === 0) {
                    this.createKey = data.data.key;
                } else {
                    this.createKey = '';
                    this.$Message.error(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                }
            }).catch(() => {
                this.createKey = '';
                this.$Message.error(this.$t('global.somethingError'));
            });
        },

        createGame () {
            if (!this.createAmountVal || this.createAmountVal <= 0 || !this.createKey) {
                this.$Message.error(this.$t('dapp.createError'));
                return;
            }
            // call 调链发起交易
            myContract.createBet(this.createKey, this.createAmountVal, (error, res) => {
                if (error) {
                    this.$toast(`${this.$t('global.somethingError')}`);
                    return;
                }
                if (res) {
                    // 调后台 addRyb 添加游戏进库
                    this.$http.post(`${config.apiDomain}/game/addryb`, {
                        key: this.createKey,
                        amount: window.web3.toWei(this.createAmountVal, 'ether')
                    }).then(res => {
                        let data = res.data;
                        if (data.errno === 0) {
                            this.isCreateModalShow = false;
                            this.createAmountVal = '';
                            this.createKey = '';
                            this.pageIndex = 1;
                            this.allData = false;
                            this.loading = false;
                            this.status = 'pull';
                            this.listData = [];
                            this.searchGame();
                        } else {
                            this.$toast(`${this.$t('global.somethingError')}, ${data.errmsg}`);
                        }
                    }).catch(() => {
                        this.$toast(this.$t('global.somethingError'));
                    });
                }
            });
        },

        cancelCreateGame () {
            this.isCreateModalShow = false;
            this.createKey = '';
            this.createAmountVal = '';
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
            this.searchGame();
            return true;
        },

        updateStatus (status) {
            this.shouldReload = (status === 'release' && true) || false;
            this.loading = (status === 'loading' && true) || false;
            this.allData = (status === 'noMore' && true) || false;
            this.status = status;
            this.isFirst = false;
        },

        goGameDetail (gameKey) {
            this.$router.push({
                name: 'rybDetail',
                query: { gameKey, language: Vue.config.lang }
            });
        }
    }
};
</script>

<style scoped lang="less">
    .rby-content-container {
        position: relative;
        width: 100%;
        overflow: hidden;
        .top-input-container {
            margin-bottom: 30px;
            .input-key-wrap {
                box-sizing: border-box;
                width: 100%;
                height: 88px;
                background: #2BAEF1;
                padding-top: 14px;
                .input-key {
                    box-sizing: border-box;
                    display: block;
                    width: 82%;
                    margin-left: 40px;
                    height: 60px;
                    border-radius: 10px;
                    text-align: center;
                    outline: none;
                    border: none;
                    padding: 0 8%;
                }
                .search-btn {
                    position: absolute;
                    right: 13%;
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    top: 25px;
                    cursor: pointer;
                    background: url("../assets/search.png");
                    background-size: 100%;
                }
                .add {
                    position: absolute;
                    right: 3%;
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    top: 25px;
                    cursor: pointer;
                    background: url("../assets/add.png");
                    background-size: 100%;
                }
            }
        }
        .create-btn {
            width: 100%;
            height: 94px;
            line-height: 94px;
            color: #fff;
            text-align: center;
            background: #2BAEF1;
            border: 2px solid rgba(5, 5, 5, 0.08);
        }
        .game-list-container {
            padding: 0 30px;
            overflow: hidden;
            .game-item-container {
                border-bottom: 2px solid #CDCED3;
                padding: 15px 0;
                .item-key,
                .item-amount,
                .item-red,
                .item-blue,
                .item-yellow {
                    height: 50px;
                    line-height: 50px;
                    .item-key-text,
                    .item-amount-text,
                    .item-red-text,
                    .item-blue-text,
                    .item-yellow-text {
                        display: block;
                        float: left;
                        font-size: 30px;
                        width: 200px;
                    }
                    .item-value {
                        display: block;
                        width: 400px;
                        float: right;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        font-size: 30px;

                    }
                }
            }
        }
        .create-game-modal-container {
            position: fixed;
            top: 0;
            bottom: 0;
            width: 100%;
            background-color: rgba(0, 0, 0, .3);
            z-index: 100;
            .create-game-modal-wrap {
                position: absolute;
                width: 700px;
                height: 400px;
                left: 50%;
                top: 50%;
                margin-top: -200px;
                margin-left: -350px;
                background: #fff;
                padding-top: 20px;
                .input-wrap {
                    position: relative;
                    width: 580px;
                    margin: 0 auto;
                    margin-top: 20px;
                    margin-bottom: 30px;
                    font-size: 28px;
                    .input-label {
                        display: inline-block;
                        width: 110px;
                        margin-right: 10px;
                    }
                    input {
                        width: 450px;
                        height: 70px;
                        line-height: 70px;
                        outline: none;
                        padding: 0 10px;
                        border: 2px solid #ccc;
                        border-radius: 6px;

                    }
                    .number-input {
                        width: 450px;
                        padding-right: 60px;
                    }
                    .unit {
                        position: absolute;
                        height: 26px;
                        line-height: 26px;
                        right: 10px;
                        top: 50%;
                        margin-top: -13px;
                    }
                }
                .button-group {
                    width: 500px;
                    margin: 0 auto;
                    margin-top: 50px;
                    .confirm,
                    .cancel {
                        display: inline-block;
                        width: 230px;
                        height: 80px;
                        line-height: 80px;
                        text-align: center;
                        border-radius: 6px;
                    }
                    .cancel {
                        margin-right: 20px;
                        border: 2px solid #ccc;
                    }
                    .confirm {
                        border: 2px solid #2BAEF1;
                        background-color: #2BAEF1;
                        color: #fff;
                    }
                }
            }
        }
    }

</style>
