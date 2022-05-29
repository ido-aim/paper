const spin_apy = document.querySelector('#APYloading');
const secondsPerBlock_el = document.querySelector('#secondsPerBlock');
const stakingRebase_el = document.querySelector('#stakingRebase');
const rebasesPerDay_el = document.querySelector('#rebasesPerDay');
const cal_button = document.querySelector('#Calculate');
const APY = document.querySelector('#stakingAPY');

var web3 = new Web3();
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

    // init/validate sec per block
    if(!Boolean(secondsPerBlock_el.value)){ 
        secondsPerBlock_el.value = 0
    }

    // init/validate staking rebase value
    if(!Boolean(stakingRebase_el.value)){ 
        stakingRebase_el.value = 0
    }

    // init rebasesPerDay
    rebasesPerDay_el.value = 24 * 60 * 60 / secondsPerBlock_el.value * 1

    // bind calculate APY button
    cal_button.onclick = function () {
        // loading
        spin_apy.style.display = ''
        let base = (1 + (stakingRebase_el.value * 1) /100); // small number
        let exp = 365*200; // small number

        calAPY_worker([base,exp])
        
    };

}

function calAPY_worker(input){
/* 
input => { "args": input }
*/
    if(typeof(Worker) !== "undefined") { // worker compatible
        if(typeof(w_apy) == "undefined") { // worker object has no created
            w_apy = new Worker("calAPY_worker.js"); // insecure on files loading
            w_apy.postMessage({ "args": input });
        }
        w_apy.onmessage = function(e,stop_calAPY_worker) {
            APY.value = e.data;
            stop_calAPY_worker()
        };
    } else {
        alert("Sorry, your browser does not support Web Workers...");
    }
}

function stop_calAPY_worker() { 
    w_apy.terminate();
    // w_apy.unregister();
    w_apy = undefined;
    spin_apy.style.display = 'none';
}
