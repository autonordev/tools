local function shout(message)
  print(string.upper(message))
end

return {
  shout = shout
}
