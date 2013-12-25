;(function(){
  /**
   * Splits an array into roughly equal-sized parts with a given predictability
   */
  function StringSplitter(predictability){
    
    predictability = parseInt(predictability) || 10;
    
    function nrand(){ 
      // poor man's normal distrubution [0,1)
      var s = 0;
      for(var i = 0; i < predictability; i++){
        s += Math.random();
      }
      return s / predictability;
    }

    function getIndex(left, right){
      return left + Math.round(nrand() * (right - left));
    }

    function queueAdd(arr, obj, weightFunction){
      for(var j = 0; j < arr.length; j++){
        if(weightFunction(arr[j]) < weightFunction(obj)){
          break;  
        }
      }
      arr.splice(j, 0, obj);
    } 

    function partWeightFunction(part){
      return part[1] - part[0];
    }

    function numberWeightFunction(n){
      return n;
    }

    function randomIndices(length, spaces){
      var indices = [];
      var parts = [[0, length]];
      for(var i = 0; i < spaces; i++){
        var part = parts.shift();
        if(part[1] - part[0] <= 1){
          break;
        }
        var index = getIndex(part[0] + 1, part[1] - 1);
        var leftPart  = [part[0], index];
        var rightPart = [index, part[1]];
        queueAdd(parts, leftPart,  partWeightFunction);
        queueAdd(parts, rightPart, partWeightFunction);
        queueAdd(indices, index, numberWeightFunction);
      }
      return indices;
    }

    return function(str, parts){
      var str = str.split('');
      var indices = randomIndices(str.length, parts - 1);
      for(var i = 0; i < indices.length; i++){
        var index = indices[i];
        str.splice(index, 0, ' ');
      }
      return str.join('');
    }
  }
  window.StringSplitter = StringSplitter;
})();