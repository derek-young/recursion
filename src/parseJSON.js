// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:

var parseJSON = function(json) {
  if(json === undefined || json.length < 1) return json;
  if(!parseableString(json)) {
    throw new SyntaxError('Not pareseable JSON');
  }
  var first = json.charAt(0);
  json = json.trim(); //Remove empty space or new lines/carriage returns

  if(first === '[') return createArray(json.substring(1, json.length - 1));
  if(first === '{') return createObject(json.substring(1, json.length - 1));
  return resolveType(json);
};

function parseableString(str) {
  var inQuote = false;
  var count = 0;
  var match = ['[', ']', '{', '}'];
  if(str.length < 2) {
    if(!isNaN(Number(str))) return true;
    return false;
  }
  for(var i = 0; i < str.length; i++) {
    if(str.charAt(i) === '"' && str.charAt(i - 1) !== '\\') inQuote = !inQuote;
    if(!inQuote && match.indexOf(str.charAt(i)) >= 0 && str.charAt(i - 1) !== '\\') count++;
  }
  return count % 2 === 0;
}

function createArray(str, result) {
  if(result === undefined) result = [];
  if(str.length < 1) return result;
  str = str.trim();
  var first = str.charAt(0);
  var len = str.length, secondQuote;
  var push, split, remaining = '';

  if(first === '[') {
    split = splitColletion(str, '[]');
    push = split[0];
    remaining = split[1];
    result.push(createArray(push));
  }

  else if(first === '{') {
    split = splitColletion(str, '{}');
    push = split[0];
    remaining = split[1];
    result.push(createObject(push));
  }

  else {
    if(first === '"') {
      secondQuote = findNext(str, '"');
      push = escape(str.substring(1, secondQuote));
      remaining = str.substring(secondQuote + 3, len).trim(); //+3 to strip the comma
    }
    else {
      if(findNext(str, ',') >= 0) {
        push = resolveType(str.substring(0, findNext(str, ',')));
        remaining = str.substring(findNext(str, ',') + 1, len).trim();
      }
      else {
        push = resolveType(str);
      }
    }
    result.push(push);
  }

  if(remaining.length > 0) return createArray(remaining, result);
  return result;
}

function createObject(str, obj) {
  if(obj === undefined) obj = {};
  if(str.length < 1) return obj;
  str = str.trim();
  var key = resolveType(str.substring(0, findNext(str, ':')).trim());
  var value = '';
  var remaining = str.substring(findNext(str, ':') + 1, str.length).trim();
  var split, first = remaining.charAt(0);

  if(first === '[') {
    split = splitColletion(remaining, '[]');
    value = split[0];
    remaining = split[1];
    obj[key] = createArray(value);
  }

  else if(first === '{') {
    split = splitColletion(remaining, '{}');
    value = split[0];
    remaining = split[1];
    obj[key] = createObject(value);
  }

  else {
    if(findNext(remaining, ',') >= 0) {
      value = resolveType(remaining.substring(0, findNext(remaining, ',')));
      remaining = remaining.substring(findNext(remaining, ',') + 1, remaining.length).trim();
      obj[key] = value;
    }
    else {
      value = resolveType(remaining);
      obj[key] = value;
      return obj;
    }
  }
  return createObject(remaining, obj);
}

function splitColletion(str, match) {
  var result = [];
  var count = 0;
  var start = match.charAt(0);
  var end = match.charAt(1);

  for(var i = 0; i < str.length; i++) {
    if(str.charAt(i) === start) count++;
    if(str.charAt(i) === end) {
      count--;
      if(count === 0) {
        result.push(str.substring(1, i)); //Array values
        result.push(str.substring(i + 2, str.length).trim()); //Remaining string after closing bracket
        break;
      }
    }
  }
  return result;
}

function resolveType(item) {
  var doubleQuotes = new RegExp('"', 'g');
  if(item === "null") return null;
  if(isBoolean(item)) return item === "true";
  if(!isNaN(Number(item))) return Number(item);
  return item.replace(doubleQuotes, '');
}

function isBoolean(item) {
  return item === "true" || item === "false";
}

function findNext(str, character) {
  var count = 0;
  for(var i = 0; i < str.length; i++) {
    if(str.charAt(i) === '"' && str.charAt(i - 1) !== '\\') count++;
    if(count % 2 === 0 && str.charAt(i) === character) {
      if(str.charAt(i - 1) !== '\\') return i;
    }
  }
  return -1;
}

function escape(str) {
  str = str.replace(/\\t/g, '');
  str = str.replace(/\\\\/g, '\\');
  return str.replace(/\\"/g, '"');
}
