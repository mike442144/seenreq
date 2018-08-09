'use strict';
const expect = require('chai').expect;
const DefaultMemRepo= require('../lib/repo/default.js');

describe('default repo', () => {
	let memRepo;
	beforeEach(()=>{
		memRepo = new DefaultMemRepo();
	});

	describe('constructor()', ()=>{
		it('should create an object and  initialize cache property', ()=>{
			expect(memRepo.cache).to.be.an.instanceof(Set);
		});
	});

	describe('getByKeys()', () => {
		it('should get cache value', (done) => {
			memRepo.cache = new Set(['key1','key2','key3']);
			memRepo.getByKeys(['key1', 'key4']).then( ([key1, key4]) => {
				expect(key1).to.be.true;
				expect(key4).to.be.false;
				done();
			});
		});
	});

	describe('setByKeys()', ()=>{
		it('should set cache value to null', (done)=>{
			memRepo.cache = new Set(['key1','key2','key3']);
			memRepo.setByKeys(['key2','key4']).then( () => {
				expect(memRepo.cache.has('key4')).to.be.true;
				expect(memRepo.cache.has('key2')).to.be.true;
				done();
			});
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
