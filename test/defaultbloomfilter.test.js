'use strict';
const crypto = require('crypto');
const expect = require('chai').expect;
const TestBloomFilter = require('../lib/bloomFilter/default.js');

describe('default bloom filter', () => {
	let testBloomFilter;
	beforeEach(()=>{
		testBloomFilter = new TestBloomFilter(100,0.001);
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
                expect(testBloomFilter.bitMap[Math.floor(127/31)]).to.equal(8);
                done();
            })
        });
    });

	describe('getBit()', () => {
		it('should get bit value from the bit array', (done) => {
            testBloomFilter.bitMap = [];
			testBloomFilter.setBit(127);
			expect(testBloomFilter.getBit(127)).to.equal(8);
			expect(testBloomFilter.getBit(126)).to.not.equal(8);
            done();

		});
    });
    
    describe('has()', () => {
		it('should check if a key is in bloom filter', (done) => {
			testBloomFilter.bitMap = [];
			const key = 'http://www.twitter.com';
			testBloomFilter.add(key);
			expect(testBloomFilter.has(key)).to.be.true;
			expect(testBloomFilter.has('http://www.baidu.com')).to.be.false;
            done();

		});
    });
    
	describe('dispose()', ()=>{
		it('should clear cache', (done)=>{
			testBloomFilter.bitMap = [];
			const key = 'http://www.twitter.com';
			testBloomFilter.add(key);
			expect(testBloomFilter.has(key)).to.be.true;
			testBloomFilter.dispose();
			expect(testBloomFilter.bitMap).to.be.a('null');
			done();
		});
	});
});