'use strict';
const expect = require('chai').expect;
const TestBloomFilter = require('../lib/bloomFilter/default.js');

describe('default bloom filter', () => {
	let testBloomFilter;
	beforeEach(()=>{
		testBloomFilter = new TestBloomFilter(100,0.01);
	});

	describe('constructor()', ()=>{
		it('should create an object and  initialize a bit array', ()=>{
			expect(testBloomFilter.bitMap).to.be.an.instanceof(Array);
		});
	});
    describe('setBit()', ()=>{
        it('should set bit in the bit array', (done)=>{

            testBloomFilter.bitMap = [];
            testBloomFilter.setBit(127).then(() => {
                expect(testBloomFilter.bitMap[127/31]).to.equal(1<<Math.floor(127 % 31));
                done();
            })
        });
    });

	describe('getBit()', () => {
		it('should get bit value from the bit array', (done) => {
            testBloomFilter.bitMap = [];
            testBloomFilter.setBit(127);
            testBloomFilter.getBit(127).then( res => expect(res).to.be.true);
            testBloomFilter.getBit(126).then( res => expect(res).to.be.false);
            done();

		});
    });
    
    describe('has()', () => {
		it('should get bit value from the bit array', (done) => {
            testBloomFilter.bitMap = [];
            testBloomFilter.setBit(127);
            testBloomFilter.getBit(127).then( res => expect(res).to.be.true);
            testBloomFilter.getBit(126).then( res => expect(res).to.be.false);
            done();

		});
    });
    
    describe('add()', () => {
		it('should get bit value from the bit array', (done) => {
            testBloomFilter.bitMap = [];
            testBloomFilter.setBit(127);
            testBloomFilter.getBit(127).then( res => expect(res).to.be.true);
            testBloomFilter.getBit(126).then( res => expect(res).to.be.false);
            done();

		});
	});
	describe('dispose()', ()=>{
		it('should clear cache', (done)=>{
			memRepo.cache = new Set(['key1','key2','key3']);
			memRepo.getByKeys(['key0', 'key3']).then( ([key0, key3]) => {
				expect(key0).to.be.false;
				expect(key3).to.be.true;
				return memRepo.setByKeys(['key1','key2']);
			}).then( () => {
				expect(memRepo.cache.has('key1')).to.be.true;
				expect(memRepo.cache.has('key2')).to.be.true;
				return memRepo.dispose();
			}).then(() => {
				expect(memRepo.cache).to.be.a('null');
				done();
			});
		});
	});
});