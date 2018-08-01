'use strict';
const expect = require('chai').expect;
const DefaultNormalizer = require('../lib/normalizer/default.js');

describe('default normalizer', ()=>{
	let ctx  = require('./fixtures/normalizer.json');
	let normalizer;
	beforeEach(()=>{
		normalizer = new DefaultNormalizer();
	});
	
	describe('constructor()', () => {
		it('should create an object', ()=>{
			expect(normalizer.globalOptions).to.eql({});
			normalizer = new DefaultNormalizer(ctx.opts[0]);
			expect(normalizer.globalOptions).to.eql(ctx.opts[0]);
		});

	});

	describe('normalize()', () => {
		it('should compose querystring from qs ', () => {
			let res = normalizer.normalize(ctx.reqs[0]);
			expect(res).to.eql({
				uri: 'http://www.GOOGLE.com?q=querysomething',
				qs:{
					q:'querysomething',
				}
			});
		});
	
		it('should use local options to override global options', () => {
			normalizer = new DefaultNormalizer(ctx.opts[1]);
			let res = normalizer.normalize(ctx.reqs[1],ctx.opts[2]);
			expect(res).to.eql({
				uri: 'http://www.GOOGLE.com',
			}
			);
		});

		it('should compose querystrings for get method', () => {
			normalizer = new DefaultNormalizer(ctx.opts[0]);
			let res = normalizer.normalize(ctx.reqs[2]);
			expect(res).to.eql({
				method: 'GET',
				uri: 'http://www.google.com?q=querysomething&gfe_rd=cr&ei=qg5QVYyVBcrC8Afz6ICoDw&gws_rd=ssl&safe=strict',
				qs:{
					q: 'querysomething',gfe_rd: 'cr',ei: 'qg5QVYyVBcrC8Afz6ICoDw',gws_rd: 'ssl',safe: 'strict'
				}
			});
		});
	
		it('should convert object form to string body for post method', () => {
			let res = normalizer.normalize(ctx.reqs[3]);
			expect(res.body).to.not.an('undefined');
			expect(res).to.eql({
				method: 'POST',
				uri: 'https://github.com/logout',
				form: {
					utf8: '✓',
					authenticity_token: 'R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg=='
				},
				body: 'authenticity_token=R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg==&utf8=✓'
			});
		});
	
		it('should convert string form to string body for post method', () => {
			let res = normalizer.normalize(ctx.reqs[4]);
			expect(res.body).to.not.an('undefined');
			expect(res).to.eql({
				method: 'POST',
				uri: 'https://github.com/logout',
				form: 'utf8=✓&authenticity_token=R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg==',
				body: 'authenticity_token=R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg==&utf8=✓' 
			});
		});
	
		it('should normalize json body for post method', () => {
			let res = normalizer.normalize(ctx.reqs[5]);
			expect(res.body).to.not.an('undefined');
			expect(res.body).to.eql(JSON.stringify({
				authenticity_token: 'R1d7nfjekS+a5/h8+L2DrSy02gt7GCxRLFla5JBjwMrYQRDRrGPaTFz/tHTQKaqYfMeZIYlYMhfBrnMwDDz+cg==',
				utf8:'✓'
			}));
		});
	});
});