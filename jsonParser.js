/*const fs = require('fs')
fs.readFile('sample.json', 'utf-8', function(err, inpStr) {
            if(err) throw err
            console.log(inpStr)})
*/

function nullParser(data) {
  var resData = data.slice(4)
  return([null, resData])
}

function boolParser(data) {
  if(data.substr(0,4) === "true") {
    var resData = data.slice(4)
    return([true, resData])
  }
  else if(data.substr(0,5) === "false") {
    var resData = data.slice(5)
    return([false, resData])
  }
}

function commaParser(data) {
  if(data.startsWith(',')) {
    var resData = data.slice(1)
    return resData
  }
  else {
    return data
  }
}

function colonParser(data) {
  if(data.startsWith(':'))
  var resData = data.slice(1)
  return resData
}

function numParser(data) {
  var parsedNumString = data.match(/+|-?\d+\.?[eE]?[+-]?\d*/).toString()
  var resData = data.slice(parsedNumString.length)
  return([parsedNumString, resData])

}

function stringParser(data) {
  var parsedString = data.match(/[a-zA-Z0-9:/.\\]+/).toString()
  var i = data.slice(1).search(/"/)
  var resData = data.slice(i+2)
  console.log(parsedString);
  return([parsedString, resData])
}

function arrayParser(data) {
  var parsedArray = []
  while(data.charAt(0) != ']') {
    var result = valueParser(data)
    parsedArray.push(result[0])
    data = result[1]
    data = commaParser(result[1])
  }
  //console.log(parsedArray)
  return ([parsedArray, data.slice(1)])
}

function objectParser(data) {
  var property, value, parsedObject = {}
  while(data.charAt(0) != '}') {
    var temp = valueParser(data)
    property = temp[0]
    data = colonParser(temp[1])
    temp = valueParser(data)
    value = temp[0]
    data = commaParser(temp[1])
    parsedObject[property] = value
  }
  return ([parsedObject, data.slice(1)])
}

function valueParser(data) {
  var resultArray = []
  if(data.charAt(0) == '{') {
    var parsedObject = objectParser(data.slice(1))
    return parsedObject
  }
  else if(data.charAt(0) == '[') {
    var parsedArray = arrayParser(data.slice(1))
    return parsedArray
  }
  else if(data.charAt(0) == '"' ) {
    resultArray = stringParser(data.slice(1))
    return resultArray
  }
  else if(/[0-9]/.test(data.charAt(0))) {
    resultArray = numParser(data)
    return resultArray
  }
  else if(/t|f/.test(data.charAt(0))) {
    resultArray = boolParser(data)
    return resultArray
  }
  else if(data.substr(0,4) == 'null') {
    resultArray = nullParser(data)
    return resultArray
  }

}

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin
})

rl.on('line', (line) => {
            valueParser(line)
            rl.close()})
