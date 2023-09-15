module.exports = (program) => {
  require('./add')(program)
  require('./link')(program)
  require('./registry')(program)
}
