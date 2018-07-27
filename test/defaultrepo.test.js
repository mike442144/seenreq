'use strict';
const expect = require('chai').expect;
const sinon = require('sinon');
const DefaultMemRepo= require('../lib/repo/default.js');

describe('default repo', () => {
	let callback;
	let memRepo;
	beforeEach(()=>{
		callback = sinon.spy();
		memRepo = new DefaultMemRepo();
	});

	describe('constructor()', ()=>{
		it('should create an object and  initialize cache property', ()=>{
			expect(memRepo.cache).to.eql({});
		});
	});

	describe('getByKeys()', () => {
		it('should get cache value', () => {
			memRepo.cache = {key1: 'key1', key2: 'key2', key3: 'key3'};
			memRepo.getByKeys(['key1', 'key4'], callback);
		});

		after(()=> {
			expect(callback.calledOnce).to.be.true;
			expect(callback.calledWith(null, [true, false])).to.be.true;

		});
	});

	describe('setByKeys()', ()=>{
		it('should set cache value to null', ()=>{
			memRepo.cache = {key1: 'key1', key2: 'key2', key3: 'key3'};
			memRepo.setByKeys(['key2','key4'], callback);
			expect(memRepo.cache).to.eql({key1: 'key1', key2: null, key3: 'key3', key4: null});
		});
		
		after(()=>{
			expect(callback.calledOnce).to.be.true;
		});
		
	});

	describe('dispose()', ()=>{
		it('should clear cache', ()=>{
			memRepo.cache = {key1: 'key1', key2: 'key2', key3: 'key3'};
			memRepo.getByKeys(['key0', 'key3'], callback);
			memRepo.setByKeys(['key1','key2'], callback);
			expect(memRepo.cache).to.eql({key1: null, key2: null, key3: 'key3'});
			memRepo.dispose();
			expect(memRepo.cache).to.be.a('null');
		});
		
		after(()=>{
			expect(callback.calledTwice).to.be.true;
			expect(callback.calledWith(null, [false,true])).to.be.true;
		});
	});
});