'use strict';
const  seenreq = require('../');
const expect = require('chai').expect;

describe('seenreq integration testing', ()=>{
	let ctx  = require('./fixtures/test_case.json');
	let seen;

	describe('basic usage', ()=>{
		beforeEach((done)=>{
			seen = new seenreq();
			seen.initialize().then(done).catch( (e) => {
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
			seen.initialize().then(()=>{
				seen.exists(ctx.opts[0],(e, rst)=>{
				//false if ask for a `request` never see
					expect(rst[0]).to.be.false;
					seen.exists(ctx.opts[1],(e, rst)=>{
					//true if got same `request`
						expect(rst[0]).to.be.true;
					});
					//true if ask for a duplicate `request`
					seen.exists(ctx.opts[0],(e,rst)=>{
						expect(rst[0]).to.be.true;
					});
				});
				seen.exists(ctx.opts[2],(e,rst)=>{
					expect(rst[0]).to.be.false;
				});
				seen.exists(ctx.opts[3],(e,rst)=>{
					expect(rst[0]).to.be.false;
				});
				seen.exists(ctx.opts[4],(e,rst)=>{
					expect(rst[0]).to.be.false;
					seen.exists(ctx.opts[6],(e,rst)=>{
						expect(rst[0]).to.be.false;
					});
				});
				seen.exists(ctx.opts[4],(e,rst)=>{
					expect(rst[0]).to.be.false;
					//compare with ctx.opts[0] and ctx.opts[1]
					seen.exists(ctx.opts[5],(e,rst)=>{
						expect(rst[0]).to.be.false;
						seen.exists(ctx.opts[6],(e,rst)=>{
							expect(rst[0]).to.be.true;
						});
					});
				});
				done();
			}).catch(function (e){
				console.error(e);
			});
		});

	});

	describe('redis repo', ()=>{
		beforeEach((done) => {
			seen = new seenreq({
				repo:'redis',// use redis instead of memory
				host:'127.0.0.1', 
				port:6379,
				clearOnQuit:true // clear redis cache or don't when calling dispose(), default true.
			});
			
			seen.initialize().then(done).catch( (e) => {
				console.error(e);
				done();
			});
		});
		afterEach(()=>{
			// seen.dispose();
			setTimeout(seen.dispose.bind(seen), 1000);

		});
		it('should find duplicate request',(done)=>{
			seen.exists(ctx.opts[0],(e, rst)=>{
				expect(rst[0]).to.be.false;
				seen.exists(ctx.opts[0],(e, rst)=>{
					expect(rst[0]).to.be.true;
				});
				done();
			});
		});

		it('should find different requests',(done)=>{
			seen.exists(ctx.opts[2],(e,rst)=>{
				expect(rst[0]).to.be.false;
				seen.exists(ctx.opts[3],(e,rst)=>{
					expect(rst[0]).to.be.false;
				});
				done();
			});	
		});

		it('should distinguish  similar request',(done)=>{
			seen.exists(ctx.opts[4],(e,rst)=>{
				expect(rst[0]).to.be.false;
				seen.exists(ctx.opts[5],(e,rst)=>{
					expect(rst[0]).to.be.false;
					seen.exists(ctx.opts[6],(e,rst)=>{
						expect(rst[0]).to.be.true;
					});
					done();
				});
			});
		});

	});

	describe('mongo repo', ()=>{
		beforeEach((done) => {
			seen = new seenreq({
				repo:'mongo',
				url:'mongodb://127.0.0.1:27017/test',
				collection: 'seenreq'
			});
			
			seen.initialize().then(done).catch( (e) => {
				console.error(e);
				done();
			});
		});
		afterEach(()=>{
			setTimeout(seen.dispose.bind(seen), 1000);
		});
		it('should find duplicate request',(done)=>{
			seen.exists(ctx.opts[0],(e, rst)=>{
				expect(rst[0]).to.be.false;
				seen.exists(ctx.opts[0],(e, rst)=>{
					expect(rst[0]).to.be.true;
				});
				done();
			});
		});

		it('should find different requests',(done)=>{
			seen.exists(ctx.opts[2],(e,rst)=>{
				expect(rst[0]).to.be.false;
				seen.exists(ctx.opts[3],(e,rst)=>{
					expect(rst[0]).to.be.false;
				});
				done();
			});	
		});

		it('should distinguish  similar request',(done)=>{
			seen.exists(ctx.opts[4],(e,rst)=>{
				expect(rst[0]).to.be.false;
				seen.exists(ctx.opts[5],(e,rst)=>{
					expect(rst[0]).to.be.false;
					seen.exists(ctx.opts[6],(e,rst)=>{
						expect(rst[0]).to.be.true;
					});
					done();
				});
			});
		});
	});

});
