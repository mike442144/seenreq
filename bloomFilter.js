'use strict';

class BloomFilter{

    initialize(){
		return Promise.resolve();
    }
    
    dispose(){
		throw new Error('`dispose` not implemented');
	}

    add(key){
        throw new Error('`add` not implemented');
    }

    has(key){
        throw new Error('`has` not implemented');
    }
    
    /**
     * From http://murmurhash.googlepages.com/ 
     */
    MurmurHash (data, offset, seed) {
        let len = data.length,
        m = 0x5bd1e995,
        r = 24,
        h = seed ^ len,
        len_4 = len >> 2;  

        for (let i = 0; i < len_4; i++) {  
            let i_4 = (i << 2) + offset,
                k = data[i_4 + 3];

            k = k << 8;  
            k = k | (data[i_4 + 2] & 0xff);  
            k = k << 8;  
            k = k | (data[i_4 + 1] & 0xff);  
            k = k << 8;  
            k = k | (data[i_4 + 0] & 0xff);  
            k *= m;  
            k ^= k >>> r;  
            k *= m;  
            h *= m;  
            h ^= k;  
        }  

        // avoid calculating modulo  
        let len_m = len_4 << 2,
            left = len - len_m,
            i_m = len_m + offset;  

        if (left != 0) {  
            if (left >= 3) {  
                h ^= data[i_m + 2] << 16;  
            }  
            if (left >= 2) {  
                h ^= data[i_m + 1] << 8;  
            }  
            if (left >= 1) {  
                h ^= data[i_m];  
            }  

            h *= m;  
        }  

        h ^= h >>> 13;  
        h *= m;  
        h ^= h >>> 15;  

        return h;  
    }


}


module.exports = BloomFilter;