import SequencerModule from '@jest/test-sequencer';

const BaseSequencer = SequencerModule.default || SequencerModule;

class CustomSequencer extends BaseSequencer {
    /**
     * Sort test suites in strictly alphabetical/numerical order (01 -> 10)
     * @param {Array} tests
     * @returns {Array}
     */
    sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort((testA, testB) => (testA.path > testB.path ? 1 : -1));
    }
}

export default CustomSequencer;
