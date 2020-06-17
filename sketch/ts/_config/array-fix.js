Array.prototype.flatMap = function(callback){
  return this.reduce((a, v) => a.concat(callback(v)), [])
}