Array.prototype.flatMap = function(callback){
  return this.reduce((a, v) => a.concat(callback(v)), [])
}
Uint8Array.BYTES_PER_ELEMENT = 1
Uint16Array.BYTES_PER_ELEMENT = 2
Uint32Array.BYTES_PER_ELEMENT = 4