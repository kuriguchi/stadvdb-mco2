//import all test cases

const concurrency_case1 = require('./concurrency_case1.js');
const concurrency_case2 = require('./concurrency_case2.js');
const concurrency_case3 = require('./concurrency_case3.js');

const RecoveryCase1 = require('./recovery_case1.js');
const RecoveryCase2 = require('./recovery_case2.js');
const RecoveryCase4 = require('./recovery_case4.js');
const RecoveryCase3 = require('./recovery_case3.js');
// import { RecoveryCase4 } from './recovery_case4.js';

const runTest = async () => {
    await concurrency_case1.concurrencyCase1();
    await concurrency_case2.concurrencyCase2();
    await concurrency_case3.concurrencyCase3();
    
    await RecoveryCase1.recoveryCase1();
    await RecoveryCase2.recoveryCase2();
    await RecoveryCase4.recoveryCase4();
    await RecoveryCase3.recoveryCase3();
}

runTest();