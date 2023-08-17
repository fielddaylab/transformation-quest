require('dotenv').config()

function dealWithEscapedQuotesFromBeanstalkEnvironmentVariables(rawValue) {
  let value = rawValue
  if (rawValue.includes('\\"')) {
    value = value.replace(/\\"/g,'"')
  }
  return value
}

function getMultiEnvValue(variableName) {
  let rawVariableValue = ""
  let i = 1;
  while (process.env[variableName + "_" + i]) {
    rawVariableValue += process.env[variableName + "_" + i]
    i++
  }
  return rawVariableValue
}

module.exports = function(variableName) {
  let rawVariableValue = process.env[variableName]
  if (!rawVariableValue) {
    rawVariableValue = getMultiEnvValue(variableName)
    if (!rawVariableValue) {
      throw new Error('Environment variable ' + variableName + ' not found!')
    }
  }
  return dealWithEscapedQuotesFromBeanstalkEnvironmentVariables(rawVariableValue)
}