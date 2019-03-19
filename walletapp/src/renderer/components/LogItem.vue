<template>
    <p>
        <span class="log-time">
            {{logItem.timeStr}}
        </span>
        <span>
            {{logItem.content}}
        </span>
    </p>
</template>

<script>
/* eslint-disable */

export default {
    name: 'log-item',
    props: {
        logItem: {
            logId:0,
            timeStr: '',
            content: ''
        }
    }
}
</script>

<style scoped>
    .log-time{
        color: orangered
    }
</style>



