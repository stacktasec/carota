<template>
  <p :class="[logItem.type===1?'log-success':'log-fail']">
    <span>{{logItem.timeStr}}</span>
    <span>{{logItem.content}}</span>
  </p>
</template>

<script>
/* eslint-disable */

export default {
  name: "log-item",
  props: {
    logItem: {
      type: 0,
      logId: 0,
      timeStr: "",
      content: ""
    }
  }
};
</script>

<style scoped>
.log-success {
  color: green;
}

.log-fail {
  color: red;
}
</style>
