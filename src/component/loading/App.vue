<template>
  <div>
    <div class="arsenal-load">
      <div v-if="endData">
        <span class="load-text">{{ $t('noMoreMessage')}}</span>
      </div>
      <div v-else>
        <span class="icon icon-load"></span>
        <span class="load-text">{{ $t('global.loading')}}</span>
      </div>
    </div>
  </div>
</template>
<script>
    export default {
        name: 'loadComponent',
        props: ['endData']
    };
</script>
<style>
  .arsenal-load {
    font-size: 0;
    text-align: center;
    color: #8c9399;
  }
  .icon-load {
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-top: 25px;
    background-image: url(assets/icon-loading.png);
    background-repeat: no-repeat;
    background-size: 30px 30px;
    vertical-align: top;
    animation: LoadMore 1s linear infinite;
  }
  .load-text {
    font-size: 26px;
    line-height: 80px;
    margin-left: 15px;
  }
</style>
