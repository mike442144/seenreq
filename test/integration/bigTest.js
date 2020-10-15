
'use strict';

const  seenreq = require('../../');
const expect = require('chai').expect;

describe('seenreq bigTestSet testing', ()=>{
	let ctx  = require('../fixtures/bigTestSet.json');
    let seen_normal;
    let seen_bloom;
    const trueCount_normal = [];
    const trueCount_bloom = [];

    beforeEach((done) => {
        seen_normal = new seenreq();
        seen_bloom = new seenreq({
            type: 'bloomFilter'
        });
        [seen_normal,seen_normal].map(seen => {
            seen.initialize().then(done()).catch( (e) => {
                console.error(e);
                done();
            });
        });
    });

    it('seenreq with two methods should have the same result',(done) => {
        seen_normal.initialize().then( ()=> seen_normal.exists(ctx))
        .then((rst) => {
            rst.forEach((o,index) => {
                if(o) trueCount_normal.push(index);
            })
            return seen_bloom.initialize().then( ()=> seen_bloom.exists(ctx));
        }).then((rst) => {
            rst.forEach((o,index) => {
                if(o) trueCount_bloom.push(index);
            })
            expect(trueCount_bloom.length === trueCount_normal.length).to.be.true;
            for(let i = 0; i < trueCount_normal.length; i++){
                expect(trueCount_bloom[i] === trueCount_normal[i]).to.be.true;
            }
            done();
        }).catch(function (e){
            console.error(e);
            expect(e).to.be.false;
            done();
        });
    })
});
