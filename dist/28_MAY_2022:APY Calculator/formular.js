const spin_apy = document.querySelector('#APYloading');
const secondsPerBlock_el = document.querySelector('#secondsPerBlock');
const blocksPerHrs_el = document.querySelector('#blocksPerHrs');
const rebaseHrs_el = document.querySelector('#rebaseHrs');
const totalStakedVol_el = document.querySelector('#totalStakedVol');
const totalStakedValue_el = document.querySelector('#totalStakedValue');
const currentPrice_el = document.querySelector('#currentPrice');
const rewardRatePerRebase_el = document.querySelector('#rewardRatePerRebase');
const currentTotalSupply_el = document.querySelector('#currentTotalSupply');
const rewardDistributePerRebase_el = document.querySelector('#rewardDistributePerRebase');
const rewardYield_el = document.querySelector('#rewardYield');
const percentRebaseYield_el = document.querySelector('#percentRebaseYield');
const ninetyDayStakingRebase_el = document.querySelector('#ninetyDayStakingRebase');
const ninetyDayFutureRewards_el = document.querySelector('#ninetyDayFutureRewards');
const ninetyDayTVL_el = document.querySelector('#ninetyDayTVL');
const ninetyDayRebase_el = document.querySelector('#ninetyDayRebase');

const cal_button = document.querySelector('#Calculate');
const rebaseAPY = document.querySelector('#rebaseAPY');
const change = new Event('change');

var w_apy;

// doc ready
if (document.readyState != 'loading'){
console.log('Document Ready')
init();
} else {
document.addEventListener('DOMContentLoaded', init);
}

function init() {
    // hide all spin icons
    console.log('init params & functions')
    spin_apy.style.display = 'none';

    let myTooltipEl = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    myTooltipEl.forEach(function(el, index){
        new bootstrap.Tooltip(el)
    })

    // init/validate sec per block
    if(!Boolean(secondsPerBlock_el.value)){ 
        secondsPerBlock_el.value = 0
    }

    // init rebasesPerDay
    blocksPerHrs_el.value = 60 * 60 / (secondsPerBlock_el.value * 1)
    rebaseHrs_el.value = 30000 / (blocksPerHrs_el.value * 1)
    secondsPerBlock_el.addEventListener('focusout',function(){
        blocksPerHrs_el.value = 60 * 60 / (secondsPerBlock_el.value * 1)
        rebaseHrs_el.value = 30000 / (blocksPerHrs_el.value * 1)
    });

    totalStakedVol_el.value = BigNumber((totalStakedValue_el.value * 1) / (currentPrice_el.value * 1))

    totalStakedValue_el.addEventListener('focusout',function(){
        totalStakedVol_el.value = BigNumber((totalStakedValue_el.value * 1) / (currentPrice_el.value * 1))
        totalStakedVol_el.dispatchEvent(change)
    });

    currentPrice_el.addEventListener('focusout',function(){
        totalStakedVol_el.value = BigNumber((totalStakedValue_el.value * 1) / (currentPrice_el.value * 1))
        totalStakedVol_el.dispatchEvent(change)
    });

    rewardDistributePerRebase_el.value = BigNumber((currentTotalSupply_el.value * 1) * (rewardRatePerRebase_el.value * 1))

    currentTotalSupply_el.addEventListener('focusout',function(){
        rewardDistributePerRebase_el.value = BigNumber((currentTotalSupply_el.value * 1) * (rewardRatePerRebase_el.value * 1))
        rewardDistributePerRebase_el.dispatchEvent(change)
    });

    rewardRatePerRebase_el.addEventListener('focusout',function(){
        rewardDistributePerRebase_el.value = BigNumber((currentTotalSupply_el.value * 1) * (rewardRatePerRebase_el.value * 1))
        rewardDistributePerRebase_el.dispatchEvent(change)
    });

    rewardYield_el.value = BigNumber((rewardDistributePerRebase_el.value * 1) / (totalStakedVol_el.value * 1))
    percentRebaseYield_el.value = BigNumber(rewardYield_el.value).multipliedBy(100)

    rewardDistributePerRebase_el.addEventListener('change',function(){
        rewardYield_el.value = BigNumber((rewardDistributePerRebase_el.value * 1) / (totalStakedVol_el.value * 1))
        percentRebaseYield_el.value = BigNumber(rewardYield_el.value).multipliedBy(100)
        
    });

    totalStakedVol_el.addEventListener('change',function(){
        rewardYield_el.value = BigNumber((rewardDistributePerRebase_el.value * 1) / (totalStakedVol_el.value * 1))
        percentRebaseYield_el.value = BigNumber(rewardYield_el.value).multipliedBy(100)
    });

    ninetyDayStakingRebase_el.value = BigNumber(ninetyDayFutureRewards_el.value/ ninetyDayTVL_el.value)
    ninetyDayRebase_el.value = BigNumber(ninetyDayStakingRebase_el.value).multipliedBy(100)

    ninetyDayFutureRewards_el.addEventListener('change',function(){
        ninetyDayStakingRebase_el.value = BigNumber(ninetyDayFutureRewards_el.value/ ninetyDayTVL_el.value)
        ninetyDayRebase_el.value = BigNumber(ninetyDayStakingRebase_el.value).multipliedBy(100)
    })

    ninetyDayTVL_el.addEventListener('change',function(){
        ninetyDayStakingRebase_el.value = BigNumber(ninetyDayFutureRewards_el.value/ ninetyDayTVL_el.value)
        ninetyDayRebase_el.value = BigNumber(ninetyDayStakingRebase_el.value).multipliedBy(100)
    })

    
    // bind calculate APY button
    cal_button.onclick = function () {
        // loading
        spin_apy.style.display = ''
        let base = 1 + (rewardYield_el.value * 1); // small number
        let exp = 365 * (24 / rebaseHrs_el.value * 1); // small number

        calAPY_worker([base,exp])
    };
}

function calAPY_worker(input){
/* 
input => { "args": input }
*/
    if(typeof(Worker) !== "undefined") { // worker compatible
        if(typeof(w_apy) == "undefined") { // worker object has no created
            w_apy = new Worker("calAPY_worker.js"); // load worker 
            w_apy.postMessage({ "args": input });
        }

        w_apy.onmessage = function(e) { // ok la
            rebaseAPY.value = e.data; // output
            console.log(e.data); // output

            w_apy.terminate();
            w_apy = undefined;

            spin_apy.style.display = 'none';
        };
    } else {
        alert("Sorry, your browser does not support Web Workers...");
    }
}