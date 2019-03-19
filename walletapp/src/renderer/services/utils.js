/* eslint-disable */

function getNow() {
    var date = new Date()
    var dateStr = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
    return dateStr;
}

export { getNow }