// worker called after formular.js as a module
// window is not defined
// self.importScripts( "/app/abc.js" );

// init phase
const assert = function(condition, message) {
    if (!condition)
        throw Error('Assert failed: ' + (message || ''));
};

async function calculateAPY(base,exp) {
    let web3 = new Web3();
    let r = BigNumber(base).pow(365*200)
    let stk = r.minus(1).multipliedBy(100);
    let stkw3 = web3.toBigNumber(stk).toString(10);
    // let stkw3 = 100;
    return await stkw3
}


// execute phase after post "message" into worker 
// proper initialization
if( 'function' === typeof importScripts) {
    importScripts(
        'https://cdn.jsdelivr.net/gh/ethereum/web3.js@0.20.6/dist/web3.min.js',
        'https://cdn.jsdelivr.net/npm/bignumber.js@9.0.2/bignumber.min.js'
        );
    addEventListener('message', onMessage);
 
    function onMessage(e) { 
      // do some work here 
      let input = e.data.args; // [base,exp] i.e. [1.00000001, 26280000]
      assert(Array.isArray(input), 'Err : input is not array');
      let base = input[0]
      let exp = input[1] // small number

      // long execute function
      console.log('start calculating',input)
      calculateAPY(base,exp)
        .then(output=>{
            console.log('got output',output)
            postMessage(output)
        })
    }    
 }