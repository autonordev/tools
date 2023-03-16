local RoFraps = require(script.Parent)

return function(Target: GuiObject)
	local Fraps = RoFraps.new(0.5):MountGui(Target, {}):Start()
	return function()
		Fraps:Destroy()
	end
end
