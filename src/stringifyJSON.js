// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj, inArr) {
  var type = typeof obj;
  if(inArr === undefined) inArr = false;
  if(obj === null) return 'null';
  if(obj === undefined || type === 'function') return undefined;
  if(type !== 'object') return objType(obj);

  if(Array.isArray(obj)) {
    var arrLen = obj.length;
    if(arrLen < 1) return '[]';
    var first = obj.shift();
    if(!inArr && arrLen === 1) return '[' + stringifyJSON(first, false) + ']';
    if(!inArr) return '[' + stringifyJSON(first, false) + ',' + stringifyJSON(obj, true);
    if(inArr && arrLen === 1) return stringifyJSON(first, false) + ']';
    return stringifyJSON(first, false) + ',' + stringifyJSON(obj, true);
  }

  var objLen = Object.keys(obj).length;
  var objStr = '{';
  if(objLen < 1) return '{}';
  for(var key in obj) {
    if(obj[key] !== undefined && typeof obj[key] !== 'function') {
      objStr += stringifyJSON(key) + ':' + stringifyJSON(obj[key]);
      if(Object.keys(obj).indexOf(key) !== objLen - 1) objStr += ',';
    }
  };
  return objStr + '}'; //Strip the last comma
};

function objType(item) {
  var type = typeof item;
  if(type === 'boolean' && item) return String('true');
  if(type === 'boolean' && !item) return 'false';
  if(type === 'number') return String(item);
  return String('"' + item + '"');
}
