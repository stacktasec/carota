/* eslint-disable */

function getNow() {
    let dtCur = new Date();
    let hCur = dtCur.getHours();
    let mCur = dtCur.getMinutes();
    let sCur = dtCur.getSeconds();
    let timeCur = "["+(hCur < 10 ? "0" + hCur : hCur)
            + ":" + (mCur < 10 ? "0" + mCur : mCur) + ":" + (sCur < 10 ? "0" + sCur : sCur)+"]";
    return timeCur;
}

export { getNow }