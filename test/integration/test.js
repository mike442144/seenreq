
'use strict';

const  seenreq = require('../../');
const expect = require('chai').expect;

describe('seenreq integration testing', ()=>{
	let ctx  = require('../fixtures/test_case.json');
	let seen;

	describe('basic usage', ()=>{
		beforeEach((done)=>{
			seen = new seenreq();
			seen.initialize().then(done()).catch( (e) => {
				console.error(e);
				done();
			});
		});
		
		it('should normalize and  find duplicate  requests ',(done)=>{
			//url to be normalized
			expect(seen.normalize(ctx.opts[0])).to.eql({ 
				sign: 'GET http://www.google.com/\r\n', 
				options: {}
			});
			
			//request options to be normalized
			expect(seen.normalize(ctx.opts[1])).to.eql({
				sign: 'GET http://www.google.com/\r\n',
				options: {rupdate: false}
			});
			
			seen.initialize()
				.then( ()=> seen.exists(ctx.opts[0]) )
				.then( (rst)=>{
					//false if ask for a `request` never see
					expect(rst).to.be.false;
					return seen.exists(ctx.opts[1]);
				}).then( (rst)=>{
					//true if got same `request`
					expect(rst).to.be.true;
					//true if ask for a duplicate `request`
					return seen.exists(ctx.opts[0]);
				}).then( (rst)=>{
					expect(rst).to.be.true;
					return seen.exists(ctx.opts[2]);
				}).then( (rst)=>{
					expect(rst).to.be.false;
					return seen.exists(ctx.opts[3]);
				}).then( (rst)=>{
					expect(rst).to.be.false;
					return seen.exists(ctx.opts[4]);
				}).then( (rst)=>{
					expect(rst).to.be.false;
					return seen.exists(ctx.opts[6]);
				}).then( (rst)=>{
					expect(rst).to.be.false;
					return seen.exists(ctx.opts[5]);
				}).then( (rst)=>{
					expect(rst).to.be.true;
					return seen.exists(ctx.opts[4]);
				}).then((rst) => {
					expect(rst).to.be.true;
					return seen.exists([ctx.opts[0], ctx.opts[3], ctx.opts[6], ctx.opts[4]]);
				}).then((rst)=>{
					expect(rst).to.eqls([true, true, true, true]);
					done();
				}).catch(function (e){
					console.error(e);
					expect(e).to.be.false;
					done();
				});
		});
	});
});
