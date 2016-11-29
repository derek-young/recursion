// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:


var json = '[[1]]';
var json1 = '["one", "two"]';
var json2 = '{"boolean, true": true, "boolean, false": false, "null": null }';
var json3 = '["true"]';
var json4 = '[ null,false,true,"true", "null", 1 ]';
//Matches ', ' or ',' if they are not inside double quotes
var commasNotQuoted = new RegExp(', (?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)|,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)');
var doulbeQuotes = new RegExp('"', 'g');

var parseJSON = function(json) {
  var first = json.charAt(0);
  var second = json.charAt(1);
  var unwrapped = unwrap(json);

  if(json.length < 1) return json;
  if(unwrapped.length < 1) return [];
  if(first === '[' && second === '[') return [parseJSON(unwrapped)];
  if(first === '{') return parseObject(unwrapped.split(commasNotQuoted), {});
  return parseText(unwrapped.split(commasNotQuoted), []);
};

var passIn = json;
console.log(JSON.parse(passIn));
console.log(parseJSON(passIn));
//console.log(typeof parseJSON(passIn));
//printArr(parseJSON(passIn));

function parseText(jsonArr, arr) {
  arr.push(resolveType(jsonArr.shift()));
  if(jsonArr.length < 1) return arr;
  return parseText(jsonArr, arr);
}

function parseObject(jsonArr, obj) {
  var keyValue = jsonArr.shift().split(":");
  var key = resolveType(keyValue[0].trim());
  var value = resolveType(keyValue[1].trim());
  obj[key] = value;
  if(jsonArr.length < 1) return obj;
  return parseObject(jsonArr, obj);
}

function unwrap(str) {
  return str.substring(1, str.length - 1).trim();
}

function resolveType(item) {
  if(item === "null") return null;
  if(isBoolean(item)) return item === "true";
  if(!isNaN(Number(item))) return Number(item);
  return item.replace(doulbeQuotes, '');
}

function isBoolean(item) {
  return item === "true" || item === "false";
}

function printItem(item) {
  console.log("item: " + item);
  console.log("type: " + typeof item);
  console.log("isBoolean? " + (item === "true" || item === "false"));
  console.log("isNumber? " + !isNaN(Number(item)) + "\n");
}

function printArr(collection) {
  if(Array.isArray(collection)) {
    for(var i = 0; i < collection.length; i++) {
      console.log(collection[i] + ": " + typeof collection[i]);
    }
  }
  else {
    for(var key in collection) {
      console.log(collection[key] + ": " + typeof collection[key]);
    }
  }
}
