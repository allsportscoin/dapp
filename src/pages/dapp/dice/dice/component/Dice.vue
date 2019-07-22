<template>
    <div class="bet-container">
        <div class="section-container">
            <ul class="section-one">
                <li class="item">
                    <p class="title">
                        {{ $t('dapp.roll') }}</p>
                    <p class="value">{{ sliderValue}}</p>
                </li>
                <li class="item">
                    <p class="title">{{ $t('dapp.rate') }}</p>
                    <p class="value">{{ rate }} X</p>
                </li>
                <li class="item">
                    <p class="title">{{ $t('dapp.winChance') }}</p>
                    <p class="value">{{ sliderValue }}%</p>
                </li>
            </ul>
            <div class="section-two">
                <vue-slider v-model="sliderValue" ref="slider" :width=width :height=20
                            :dotSize=16 @callback="onChangeNumber" :min="2" :max="96"
                            class="slider-container"></vue-slider>
            </div>
            <div class="balance-text">{{ $t('dapp.balance') }}:{{ balance }} SOC</div>
            <ul class="section-three clearfix">
                <li class="left-container">
                    <ul class="item-ul clearfix">
                        <li class="title">{{ $t('dapp.amount') }}:</li>
                        <li class="tokens-icon">
                            <input class="enter-value-input" v-model="betVal" type="number" pattern="\d*"/>
                            Soc
                        </li>
                        <li class="btns" @click="updateBetVal(1)">1/2</li>
                        <li class="btns add-line" @click="updateBetVal(2)">2X</li>
                        <li class="btns" @click="updateBetVal(3)">{{ $t('dapp.max') }}</li>
                    </ul>
                </li>
                <li class="right-container">
                    <div class="text">
                        {{ $t('dapp.payout') }}: <b>{{ getBounds }}</b> SOC
                    </div>
                </li>
            </ul>
            <div class="section-four">
                <div v-if="!isLogin" class="login-btn" @click="login">{{ $t('dapp.login') }}</div>
                <div v-else>
                    <div @click="goBet" class="bet-button">{{ randomNumber }}</div>
                </div>
            </div>
            <div class="history-list-wrap">
                <div class="tab-groups">
                    <span @click="onChangeTab(1)"
                          :class="['tab', currentTab === 1? 'tabActive': '']">{{ $t('dapp.all') }}</span>
                    <span @click="onChangeTab(2)" :class="['tab',currentTab === 2? 'tabActive': '']" v-if="address">{{ $t('dapp.myBets') }}</span>
                </div>
                <Loading v-if="loading"></Loading>
                <div class="history-list-container" v-if="!loading">
                    <div v-for="item in listData"
                         :class="['history-item-container',
                         item.res_random_num && Number(item.num) >= Number(item.res_random_num) && 'item-info-win-row',
                         item.res_random_num && Number(item.num) < Number(item.res_random_num) && 'item-info-lose-row'
                         ]"
                    >
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.time') }}:</span>
                            <span class="item-value">{{ item.create_time }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.bettor') }}:</span>
                            <span class="item-value">{{ item.address}}</span></div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.rollUnder') }}:</span>
                            <span class="item-value"> {{ item.num }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.betRoll') }}:</span>
                            <span class="item-value">{{ item.res_random_num }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.betAmount') }}:</span>
                            <span class="item-value">{{item.amount }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.betPayout') }}:</span>
                            <span class="item-value">{{ item.win_value }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.betBlock') }}:</span>
                            <span class="item-value">{{ item.block_num }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.betBlockHash') }}:</span>
                            <span class="item-value">{{ item.hash_block_num }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.betTransaction') }}:</span>
                            <span class="item-value">{{ item.tx }}</span>
                        </div>
                        <div class="every-item clearfix">
                            <span class="item-text">{{ $t('dapp.lotteryTransaction') }}:</span>
                            <span class="item-value">{{ item.open_tx }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="result-win-modal" v-if="isWinModalShow">
            <div class="content">
                {{ $t('dapp.congratulations') }} <b>{{ betVal }}</b> SOC<br />
                {{ $t('dapp.rollText') }} <b>{{ luckyNumber }} </b><br />
                {{ $t('dapp.win') }} <b>{{ getBounds }}</b> SOC<br />
                <button class="ok-button" @click=closeModal(1)>{{ $t('dapp.know') }}</button>
            </div>
        </div>
        <div class="result-lose-modal" v-if="isLoseModalShow">
            <div class="content">{{ $t('dapp.unfortunately') }} <b>{{ betVal }}</b> SOC<br />
                {{ $t('dapp.rollText') }} <b>{{ luckyNumber }}</b><br />
                {{ $t('dapp.lose') }} <b>{{ betVal }}</b> SOC<br />
                <button class="ok-button" @click=closeModal(2)>{{ $t('dapp.know') }}</button>
            </div>
        </div>
        <div class="play-method" @click="showGuideModal"></div>
        <div class="guide-modal" v-if="isGuideModalShow">
            <div class="content">
                <span class="close-btn" @click="closeGuideModal"></span>
                <h3>{{ $t('dapp.modalTitle') }}</h3>
                <p>{{ $t('dapp.modalContentOne') }}</p>
                <p>{{ $t('dapp.modalContentTwo') }}</p>
                <p>{{ $t('dapp.modalContentThree') }}</p>
                <p>{{ $t('dapp.modalContentFour') }}</p>
                <p>{{ $t('dapp.modalContentFive') }}</p>
                <p>{{ $t('dapp.modalContentSix') }}</p>
                <p>{{ $t('dapp.modalContentSeven') }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import vueSlider from 'vue-slider-component';
import { contractAbi } from '../../abi/diceAbi';
import config from '../../../../../bin/config';

export default {
    name: 'dice',
    components: { vueSlider },
    data () {
        return {
            contractAbi,
            contract_addr: '0x1778e3f74e237cd0ecddf20263343a9e497cf6a6',
            address: '',
            balance: 0,
            sliderValue: 50,
            rate: (99 / (50 - 1) * 0.995).toFixed(3),
            betVal: 1,
            loading: false,
            listData: [],
            isLogin: false,
            commitId: '',
            randomNumber: this.$t('dapp.toRoll'),
            isOver: 0,
            luckyNumber: null,
            isWinModalShow: false,
            isLoseModalShow: false,
            animateInterval: null,
            queryResultInterval: null,
            queryListInterval: null,
            isGuideModalShow: false,
            noData: this.$t('global.noData'),
            clickAble: true,
            width: '95%',
            currentTab: 1
        };
    },
    mounted () {
        this.loading = true;
        this.queryListInterval = setInterval(() => {
            this.getList();
        }, 1000);
        this.checkLogin();
    },
    methods: {
        checkLogin () {
            if (!window.web3) {
                this.isLogin = false;
                return;
            }
            const web3 = window.web3;
            web3.eth.getAccounts((err, res) => {
                if (err) {
                    this.$toast(`${this.$t('global.somethingError')}, ${err}`);
                    return;
                }
                if (!res.length) {
                    this.$toast(this.$t('dapp.toLogin'));
                    return;
                }
                this.isLogin = true;
                this.address = res[0];
                let that = this;
                web3.eth.getBalance(res[0], function (err, res) {
                    if (err) {
                        that.$toast(`${that.$t('global.somethingError')}, ${err}`);
                        return;
                    }
                    that.balance = Number(window.web3.fromWei(res.toString())).toFixed(3) || 0;
                });
            });
        },
        onChangeTab (value) {
            if (this.currentTab === value) {
                return;
            }
            this.loading = true;
            this.currentTab = value;
            clearInterval(this.queryListInterval);
            this.queryListInterval = setInterval(() => {
                this.getList(value);
            }, 1000);
        },
        getList (type) {
            let address = '';
            if (type === 2) {
                address = this.address;
            }
            this.$http.get(`${config.apiDomain}/api/getcommits?address=${address}`).then(res => {
                this.listData = res.data;
                this.loading = false;
            }).catch(() => {
                this.loading = false;
            });
        },
        onChangeNumber (value) {
            if (value < 1) {
                this.rate = 0;
                return;
            }
            this.rate = (99 / (value - 1) * 0.995).toFixed(3);
        },
        updateBetVal (val) {
            if (val === 1) {
                this.betVal = this.betVal / 2;
                return;
            }
            if (val === 2) {
                this.betVal = this.betVal * 2;
                return;
            }
            if (Number(this.balance) >= 300001) {
                this.betVal = 300000;
                return;
            }
            this.betVal = (this.balance && this.balance > 1 && this.balance - 1) || 0;
        },
        login () {
            this.$toast(this.$t('dapp.toLogin'));
        },
        goBet () {
            if (!this.clickAble) {
                return;
            }
            this.clickAble = false;
            if (Number(this.betVal) === 0) {
                this.clickAble = true;
                return;
            }
            if (Number(this.balance) - 1 < Number(this.betVal)) {
                this.$toast(this.$t('dapp.moneyNotEnough'));
                this.clickAble = true;
                return;
            }
            this.$http.get(`${config.apiDomain}/api/addcommit`).then(res => {
                this.commitId = res.data.commit;
                return res.data.commit;
            }).then(val => {
                try {
                    let that = this;
                    let Contract = window.web3.eth.contract(JSON.parse(that.contractAbi), function (error, result) {
                        if (!error) {
                            console.log(JSON.stringify(result));
                        } else {
                            console.error(error);
                        }
                    });
                    let newContract = Contract.at(that.contract_addr);
                    newContract.placeBet(that.sliderValue, that.commitId, {
                        value: window.web3.toWei(that.betVal, 'ether'),
                        gas: 300000
                    }, function (error, res) {
                        if (error) {
                            that.clickAble = true;
                            return;
                        }
                        if (res) {
                            that.beginRoundNumber();
                            that.tellTxToServer(res);
                        }
                    });
                } catch (e) {
                    this.clickAble = true;
                    this.$toast(this.$t('global.error'));
                }
            });
        },
        tellTxToServer (tx) {
            this.$http.post(`${config.apiDomain}/api/updatecommit`, {
                commit: this.commitId,
                tx
            }).catch(error => {
                this.$toast(`${this.$t('global.somethingError')}, ${error}`);
            });
        },
        beginRoundNumber () {
            let Contract = window.web3.eth.contract(JSON.parse(this.contractAbi), (error, result) => {
                if (!error) {
                    console.log(JSON.stringify(result));
                } else {
                    console.error(error);
                }
            });
            let newContract = Contract.at(this.contract_addr);
            this.animateInterval = setInterval(() => {
                this.randomNumber = Math.floor(Math.random() * 99 + 1);
            }, 50);
            this.queryResultInterval = setInterval(() => {
                if (Number(this.isOver) === 1) {
                    // this.isOver = 0;
                    // clearInterval(this.animateInterval);
                    // clearInterval(this.queryResultInterval);
                    // this.randomNumber = this.$t('dapp.toRoll');
                    return;
                }
                let that = this;
                newContract.getCommitBetInfo(that.commitId, (err, res) => {
                    if (err) {
                        return;
                    }
                    that.isOver = res[4].toString();
                    if (Number(that.isOver) === 1) {
                        that.luckyNumber = res[7].toString();
                        that.isOver = 0;
                        that.clickAble = true;
                        that.randomNumber = that.$t('dapp.toRoll');
                        clearInterval(that.animateInterval);
                        clearInterval(that.queryResultInterval);
                        if (that.luckyNumber <= that.sliderValue) {
                            that.isWinModalShow = true;
                        } else {
                            that.isLoseModalShow = true;
                        }
                    }
                });
            }, 1000);
        },
        closeModal (type) {
            if (type === 1) {
                this.isWinModalShow = false;
            } else {
                this.isLoseModalShow = false;
            }
            window.web3.eth.getBalance(this.address, (err, res) => {
                if (err) {
                    this.$toast(`${this.$t('global.somethingError')}, ${err}`);
                    return;
                }
                this.balance = Number(window.web3.fromWei(res.toString())).toFixed(3) || 0;
            });
        },
        showGuideModal () {
            this.isGuideModalShow = true;
        },
        closeGuideModal () {
            this.isGuideModalShow = false;
        }
    },
    computed: {
        getBounds: function () {
            return (this.betVal * this.rate).toFixed(3);
        }
    },
    destroyed () {
        clearInterval(this.animateInterval);
        clearInterval(this.queryResultInterval);
        clearInterval(this.queryListInterval);
    }
};
</script>

<style lang="less">
    .bet-container {
        background-color: #000;
        box-sizing: border-box;
        .breadcrumb {
            text-align: right;
            margin-top: 30px;
        }
        .section-container {
            padding-top: 20px;
            .section-one {
                color: #fff;
                display: flex;
                width: 95%;
                height: 150px;
                margin: 0 auto;
                margin-top: 50px;
                border: 2px solid #ccc;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                .item {
                    height: 150px;
                    flex: 1;
                    text-align: center;
                    .title {
                        font-size: 28px;
                        margin-top: 40px;
                    }
                    .value {
                        margin-top: 10px;
                        font-size: 28px;
                        font-weight: bold;
                    }
                    &:first-child {
                        flex: 1.5;
                    }
                }
            }
            .section-two {
                margin-top: 50px;
                .slider-container {
                    margin: 0 auto;
                }
            }
            .section-three {
                padding: 0 30px;
                margin-top: 20px;
                color: #fff;
                .left-container {
                    margin: 0 auto;
                    font-size: 32px;
                    .item-ul {
                        li {
                            float: left;
                            line-height: 64px;
                            .enter-value-input {
                                box-sizing: border-box;
                                width: 150px;
                                height: 50px;
                                line-height: 50px;
                                border: 2px solid #ccc;
                                outline: none;
                                padding: 0 10px;
                            }
                        }
                        .title {
                            height: 64px;
                            line-height: 64px;
                            margin-right: 20px;
                        }
                        .btns {
                            width: 80px;
                            height: 64px;
                            line-height: 64px;
                            text-align: center;
                            cursor: pointer;
                            margin-left: 10px;
                            &:hover {
                                border-radius: 6px;
                                background-color: #3498db;
                                color: #fff;
                            }
                        }
                    }
                }
                .right-container {
                    .text {
                        font-size: 32px;
                        line-height: 64px;
                        text-align: center;
                        margin-top: 20px;
                        b {
                            font-size: 40px;
                        }
                    }
                }
            }
            .history-list-wrap {
                margin-top: 40px;
                .tab-groups {
                    padding-left: 30px;
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
                .history-list-container {
                    overflow: hidden;
                    .history-item-container {
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
            }
            .balance-text {
                color: #fff;
                font-size: 32px;
                margin-top: 40px;
                margin-bottom: 40px;
                text-align: center;
            }
            .section-four {
                margin-top: 40px;
                .login-btn,
                .bet-button {
                    margin: 0 auto;
                    background-color: #2BAEF1;
                    width: 160px;
                    height: 80px;
                    line-height: 80px;
                    text-align: center;
                    color: #fff;
                    border-radius: 8px;
                }
            }
            .section-five {
                .look-list-btn {
                    cursor: pointer;
                }
            }
        }
        .result-win-modal,
        .result-lose-modal {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .3);
            z-index: 10;
            .content {
                width: 500px;
                height: 210px;
                background-color: #fff;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -250px;
                margin-top: -105px;
                padding: 20px 10px;
                text-align: center;
                line-height: 40px;
                font-size: 26px;
                .ok-button {
                    height: 50px;
                    display: block;
                    margin: 0 auto;
                    margin-top: 10px;
                    background: #2BAEF1;
                    color: #fff;
                    border: none;
                    outline: none;
                }
            }
        }
        .guide-modal {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, .3);
            z-index: 10;
            .close-btn {
                width: 20px;
                height: 20px;
                background: url("../assets/close.png") no-repeat;
                background-size: 100% 100%;
                position: absolute;
                right: 10px;
                top: 10px;
                cursor: pointer;
            }
            .content {
                box-sizing: border-box;
                width: 700px;
                height: 700px;
                background-color: #fff;
                position: absolute;
                top: 50%;
                left: 50%;
                margin-left: -350px;
                margin-top: -350px;
                padding: 20px 15px;
                border-radius: 8px;
                h3 {
                    text-align: center;
                    margin-top: 10px;
                    margin-bottom: 10px;
                }
                p {
                    text-align: left;
                    font-size: 28px;
                    line-height: 36px;
                }
                .ok-button {
                    display: block;
                    margin: 0 auto;
                    margin-top: 5px;
                }
            }
        }
        .play-method {
            width: 40px;
            height: 40px;
            background: url("../assets/wenh.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 20px;
            right: 8px;
            cursor: pointer;
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
