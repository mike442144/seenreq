'use strict';
const crypto = require('crypto');
const BloomFilter = require('../../bloomFilter.js');

class DefaultBloomFilter extends BloomFilter{
	constructor(maxKeys,errorRate){
		super();
        this.bitMap = [];
        this.maxKeys = maxKeys;
        this.errorRate = errorRate;
        
        /* https://developer.aliyun.com/article/3607 */
        this.bitSize = Math.ceil(maxKeys * (-Math.log(errorRate) / (Math.log(2) * Math.log(2))));
        this.hashCount = Math.ceil(Math.log(2) * (this.bitSize / maxKeys));
        
        this.keyCount = 0;
    }

    setBit(bit){
        let numArr = Math.floor(bit / 31),
            numBit = Math.floor(bit % 31);
        this.bitMap[numArr] |= (1<<numBit);

        return Promise.resolve();
    }

    getBit(bit){
        let numArr = Math.floor(bit / 31),
            numBit = Math.floor(bit % 31);
        return this.bitMap[numArr] &= (1<<numBit);
    }

    has(_key){
        const key = this.transformKey(_key);
        let hash1 = this.MurmurHash(key, 0, 0),
            hash2 = this.MurmurHash(key, 0, hash1);

        for (let i = 0; i < this.hashCount; i++) {
            if (!this.getBit(Math.abs(Math.floor((hash1 + i * hash2) % (this.bitSize))))) {
                return false;
            }
        }

        return true;
    }

    add(_key){
        const key = this.transformKey(_key);
        if (this.has(key)) {
            return -1;
        }

        let hash1 = this.MurmurHash(key, 0, 0),
            hash2 = this.MurmurHash(key, 0, hash1);

        for (let i = 0; i < this.hashCount; i++) {
            this.setBit(Math.abs(Math.floor((hash1 + i * hash2) % (this.bitSize))));
        }

        this.keyCount++;
    }

	transformKey(key){
		const hash = (str) => {
			const hashFn = crypto.createHash('md5');
			hashFn.update(str);
			return hashFn.digest('hex');
		};
		
		return hash(key);
	}

    dispose(callback) {
		this.bitMap = null;
		if(callback){
			callback();
		}else{
			return Promise.resolve();
		}
	}

}

module.exports = DefaultBloomFilter;