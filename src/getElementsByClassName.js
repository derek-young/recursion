// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:

var getElementsByClassName = function(className) {
  return getByClass(className, document.childNodes, 0);
};

function getByClass(className, nodes, index) {
  var result = [];
  var keys = Object.keys(nodes);
  var hasChildren = nodes[keys[index]].childNodes.length > 0;
  var notLastNode = index < keys.length - 1;
  var classes = nodes[keys[index]].className;
  if(classes !== undefined) {
    if(classes.includes(className)) result.push(nodes[keys[index]]);
  }
  if(hasChildren && notLastNode) {
    return result.concat(getByClass(className, nodes[keys[index]].childNodes, 0)).concat(getByClass(className, nodes, index + 1));
  }
  if(notLastNode) return result.concat(getByClass(className, nodes, index + 1));
  if(hasChildren) return result.concat(getByClass(className, nodes[keys[index]].childNodes, 0));
  return result;
}
