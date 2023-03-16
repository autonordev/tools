--!optimize 2
export type IRenderProps = {
	ShowFramerate: boolean?,

	ShowMax: boolean?,
	ShowMin: boolean?,

	ShowOnePercentLow: boolean?,
	ShowPointOnePercentLow: boolean?,

	AnchorPoint: Vector2?,
	FontFace: Font?,
	Position: UDim2?,
	TextColor3: Color3?,
	TextSize: number?,
	TextStrokeColor3: Color3?,
}

type IMergeRenderProps = {
	ShowFramerate: boolean,

	ShowMax: boolean,
	ShowMin: boolean,

	ShowOnePercentLow: boolean,
	ShowPointOnePercentLow: boolean,

	AnchorPoint: Vector2,
	FontFace: Font,
	Position: UDim2,
	TextColor3: Color3,
	TextSize: number,
	TextStrokeColor3: Color3,
}

local DEFAULT_PROPS: IMergeRenderProps = {
	ShowFramerate = true;

	ShowMax = true;
	ShowMin = true;

	ShowOnePercentLow = true;
	ShowPointOnePercentLow = true;

	AnchorPoint = Vector2.yAxis;
	FontFace = Font.new("rbxasset://fonts/families/RobotoMono.json");
	Position = UDim2.fromScale(0, 1);
	TextColor3 = Color3.fromRGB(255, 239, 7);
	TextSize = 20;
	TextStrokeColor3 = Color3.fromRGB(0, 0, 0);
}

local function MergeDefaults(Properties: IRenderProps?): IMergeRenderProps
	local New = table.clone(DEFAULT_PROPS)
	if Properties then
		for Key, Value in Properties do
			New[Key] = Value
		end
	end

	return New
end

return MergeDefaults
