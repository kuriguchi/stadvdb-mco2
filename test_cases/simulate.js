//import all test cases
// import { ConcurrencyCase1 } from './concurrency_case1.js';
// import { ConcurrencyCase2 } from './concurrency_case2.js';
// import { RecoveryCase1 } from './recovery_case1.js';
const RecoveryCase1 = require('./recovery_case1.js');
const RecoveryCase2 = require('./recovery_case2.js');
const RecoveryCase4 = require('./recovery_case4.js');
const RecoveryCase3 = require('./recovery_case3.js');
// import { RecoveryCase4 } from './recovery_case4.js';

const runTest = async () => {
    await RecoveryCase1.recoveryCase1();
    await RecoveryCase2.recoveryCase2();
    await RecoveryCase4.recoveryCase4();
    await RecoveryCase3.recoveryCase3();
}

runTest();