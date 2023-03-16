--!optimize 2
type ITextLabels = {
	ShowFramerate: TextLabel?,
	ShowMax: TextLabel?,
	ShowMin: TextLabel?,
	ShowOnePercentLow: TextLabel?,
	ShowPointOnePercentLow: TextLabel?,
}

local function CreateFrame(
	AnchorPoint: Vector2,
	FontFace: Font,
	Position: UDim2,
	TextColor3: Color3,
	TextSize: number,
	TextStrokeColor3: Color3,

	ShowFramerate: boolean,
	ShowMax: boolean,
	ShowMin: boolean,
	ShowOnePercentLow: boolean,
	ShowPointOnePercentLow: boolean
)
	local FrapsFrame = Instance.new("Frame")
	FrapsFrame.AnchorPoint = AnchorPoint
	FrapsFrame.AutoLocalize = false
	FrapsFrame.AutomaticSize = Enum.AutomaticSize.XY
	FrapsFrame.BackgroundTransparency = 1
	FrapsFrame.Name = "FrapsFrame"
	FrapsFrame.Position = Position

	local StrokeHex = "#" .. TextStrokeColor3:ToHex()

	local UIListLayout = Instance.new("UIListLayout")
	UIListLayout.SortOrder = Enum.SortOrder.LayoutOrder
	UIListLayout.VerticalAlignment = Enum.VerticalAlignment.Center
	UIListLayout.Parent = FrapsFrame

	local TextLabels: ITextLabels = {}
	local LayoutOrder = 0

	if ShowFramerate then
		LayoutOrder += 1

		local FramerateLabel = Instance.new("TextLabel")
		FramerateLabel.AutomaticSize = Enum.AutomaticSize.XY
		FramerateLabel.BackgroundTransparency = 1
		FramerateLabel.FontFace = FontFace
		FramerateLabel.LayoutOrder = LayoutOrder
		FramerateLabel.Name = "FramerateLabel"
		FramerateLabel.RichText = true
		FramerateLabel.Text =
			string.format("<stroke color=%q joins=\"miter\" thickness=\"2\"><b>FPS: </b>0 / 0</stroke>", StrokeHex)
		FramerateLabel.TextColor3 = TextColor3
		FramerateLabel.TextSize = TextSize
		FramerateLabel.TextWrapped = true
		FramerateLabel.TextXAlignment = Enum.TextXAlignment.Left

		local UIPadding = Instance.new("UIPadding")
		UIPadding.PaddingLeft = UDim.new(0, 6)
		UIPadding.PaddingRight = UDim.new(0, 6)
		UIPadding.Parent = FramerateLabel

		FramerateLabel.Parent = FrapsFrame
		TextLabels.ShowFramerate = FramerateLabel
	end

	if ShowOnePercentLow then
		LayoutOrder += 1
		local OnePercentLabel = Instance.new("TextLabel")
		OnePercentLabel.AutomaticSize = Enum.AutomaticSize.XY
		OnePercentLabel.BackgroundTransparency = 1
		OnePercentLabel.FontFace = FontFace
		OnePercentLabel.LayoutOrder = LayoutOrder
		OnePercentLabel.Name = "OnePercentLabel"
		OnePercentLabel.RichText = true
		OnePercentLabel.Text =
			string.format("<stroke color=%q joins=\"miter\" thickness=\"2\"><b> 1%%: </b>0 / 0</stroke>", StrokeHex)

		OnePercentLabel.TextColor3 = TextColor3
		OnePercentLabel.TextSize = TextSize
		OnePercentLabel.TextWrapped = true
		OnePercentLabel.TextXAlignment = Enum.TextXAlignment.Left

		local UIPadding = Instance.new("UIPadding")
		UIPadding.PaddingLeft = UDim.new(0, 6)
		UIPadding.PaddingRight = UDim.new(0, 6)
		UIPadding.Parent = OnePercentLabel

		OnePercentLabel.Parent = FrapsFrame
		TextLabels.ShowOnePercentLow = OnePercentLabel
	end

	if ShowPointOnePercentLow then
		LayoutOrder += 1

		local PointOnePercentLabel = Instance.new("TextLabel")
		PointOnePercentLabel.AutomaticSize = Enum.AutomaticSize.XY
		PointOnePercentLabel.BackgroundTransparency = 1
		PointOnePercentLabel.FontFace = FontFace
		PointOnePercentLabel.LayoutOrder = LayoutOrder
		PointOnePercentLabel.Name = "PointOnePercentLabel"
		PointOnePercentLabel.RichText = true
		PointOnePercentLabel.Text =
			string.format("<stroke color=%q joins=\"miter\" thickness=\"2\"><b>.1%%: </b>0 / 0</stroke>", StrokeHex)

		PointOnePercentLabel.TextColor3 = TextColor3
		PointOnePercentLabel.TextSize = TextSize
		PointOnePercentLabel.TextWrapped = true
		PointOnePercentLabel.TextXAlignment = Enum.TextXAlignment.Left

		local UIPadding = Instance.new("UIPadding")
		UIPadding.PaddingLeft = UDim.new(0, 6)
		UIPadding.PaddingRight = UDim.new(0, 6)
		UIPadding.Parent = PointOnePercentLabel

		PointOnePercentLabel.Parent = FrapsFrame
		TextLabels.ShowPointOnePercentLow = PointOnePercentLabel
	end

	if ShowMax then
		LayoutOrder += 1

		local MaxLabel = Instance.new("TextLabel")
		MaxLabel.AutomaticSize = Enum.AutomaticSize.XY
		MaxLabel.BackgroundTransparency = 1
		MaxLabel.FontFace = FontFace
		MaxLabel.LayoutOrder = LayoutOrder
		MaxLabel.Name = "MaxLabel"
		MaxLabel.RichText = true
		MaxLabel.Text =
			string.format("<stroke color=%q joins=\"miter\" thickness=\"2\"><b>MAX: </b>0</stroke>", StrokeHex)

		MaxLabel.TextColor3 = TextColor3
		MaxLabel.TextSize = TextSize
		MaxLabel.TextWrapped = true
		MaxLabel.TextXAlignment = Enum.TextXAlignment.Left

		local UIPadding = Instance.new("UIPadding")
		UIPadding.PaddingLeft = UDim.new(0, 6)
		UIPadding.PaddingRight = UDim.new(0, 6)
		UIPadding.Parent = MaxLabel

		MaxLabel.Parent = FrapsFrame
		TextLabels.ShowMax = MaxLabel
	end

	if ShowMin then
		LayoutOrder += 1
		local MinLabel = Instance.new("TextLabel")
		MinLabel.AutomaticSize = Enum.AutomaticSize.XY
		MinLabel.BackgroundTransparency = 1
		MinLabel.FontFace = FontFace
		MinLabel.LayoutOrder = LayoutOrder
		MinLabel.Name = "MinLabel"
		MinLabel.RichText = true
		MinLabel.Text =
			string.format("<stroke color=%q joins=\"miter\" thickness=\"2\"><b>MIN: </b>0</stroke>", StrokeHex)

		MinLabel.TextColor3 = TextColor3
		MinLabel.TextSize = 20
		MinLabel.TextWrapped = true
		MinLabel.TextXAlignment = Enum.TextXAlignment.Left

		local UIPadding = Instance.new("UIPadding")
		UIPadding.PaddingLeft = UDim.new(0, 6)
		UIPadding.PaddingRight = UDim.new(0, 6)
		UIPadding.Parent = MinLabel

		MinLabel.Parent = FrapsFrame
		TextLabels.ShowMin = MinLabel
	end

	return FrapsFrame, TextLabels
end

return CreateFrame
