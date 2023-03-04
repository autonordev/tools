module.exports = (program) => {
  require('./update')(program)
  require('./build')(program)
  require('./validate')(program)
  require('./open')(program)
}
