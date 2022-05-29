const spin_apy = document.querySelector('#APYloading');
const secondsPerBlock_el = document.querySelector('#secondsPerBlock');
const stakingRebase_el = document.querySelector('#stakingRebase');
const rebasesPerDay_el = document.querySelector('#rebasesPerDay');
const cal_button = document.querySelector('#Calculate');
const APY = document.querySelector('#stakingAPY');

var w_apy;

// doc ready
if (document.readyState != 'loading'){
main();
} else {
document.addEventListener('DOMContentLoaded', main);
}

function main() {
    console.log('Document Ready')
    // init
    init()
}  

function init() {

    // prefill/ edit value if non
    console.log('init params & functions')
    spin_apy.style.display = 'none';

    // start value
    // init sec per block
    if(!Boolean(secondsPerBlock_el.value)){ 
        secondsPerBlock_el.value = 0
    }

    //get value
    if(!Boolean(stakingRebase_el.value)){ 
        stakingRebase_el.value = 0
    }

    // init rebasesPerDay
    rebasesPerDay_el.value = 24 * 60 * 60 / secondsPerBlock_el.value * 1

    cal_button.onclick = async function () {
        // loading
        spin_apy.style.display = ''
        calAPY_worker()
        
    };

}

function calAPY_worker(){
    if(typeof(Worker) !== "undefined") { // worker compatible
        if(typeof(w_apy) == "undefined") { // worker object has no created
            w_apy = new Worker("calAPY_worker.js"); // insecure
            w_apy.register();
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
    w_apy.unregister();
    w_apy = undefined;
    spin_apy.style.display = 'none';
}
