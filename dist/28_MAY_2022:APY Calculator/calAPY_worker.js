// worker called after formular.js
// init phase
var i=0;

console.log('stakingRebase_el.value',stakingRebase_el.value)
console.log('rebasesPerDay_el.value',rebasesPerDay_el.value)

function calculateAPY() {
    let base = (1 + (stakingRebase_el.value * 1) /100); // small number

    // let exp = 1 * rebasesPerDay_el.value * 1; // small number
    let exp = 365*200; // small number

    let r = BigNumber(base).pow(exp)
    let stk = r.minus(1).multipliedBy(100);
    let stkw3 = web3.toBigNumber(stk).toString(10);
    // stakingAPY_el.value = stkw3
    // return stkw3
    postMessage(stkw3);
}

calculateAPY();