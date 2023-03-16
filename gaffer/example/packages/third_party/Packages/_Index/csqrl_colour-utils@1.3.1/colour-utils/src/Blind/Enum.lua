--[=[
	@interface Enums
	@within Blind
	.Blind Blind -- Types of colour blindness.
	.Group Group -- Colour blindness groups.
]=]

--[=[
	@interface Blind
	@tag Enum
	@within Blind
	.Trichromacy 0 -- No colour blindness.
	.Protanopia 1 -- Red blind.
	.Protanomaly 2 -- Red deficient.
	.Deuteranopia 3 -- Green blind.
	.Deuteranomaly 4 -- Green deficient.
	.Tritanopia 5 -- Blue blind.
	.Tritanomaly 6 -- Blue deficient.
	.Achromatopsia 7 -- All colours are absent.
	.Achromatomaly 8 -- All colours are deficient.

	.None 0 -- Trichromacy (no colour blindness).
	.NoRed 1 -- Protanopia (red blind).
	.LowRed 2 -- Protanomaly (red deficient).
	.NoGreen 3 -- Deuteranopia (green blind).
	.LowGreen 4 -- Deuteranomaly (green deficient).
	.NoBlue 5 -- Tritanopia (blue blind).
	.LowBlue 6 -- Tritanomaly (blue deficient).
	.NoColour 7 -- Achromatopsia (totally colour blind).
	.LowColour 8 -- Achromatomaly (colour deficient).

	The Blind enum is used to represent the different types of colour blindness. It
	features a number of aliases for non-scientists.
]=]

--[=[
	@interface Group
	@tag Enum
	@within Blind
	.Trichroma 0 -- Trichromacy (no colour blindness).
	.Protan 1 -- Protanopia/Protanomaly.
	.Deutan 2 -- Deuteranopia/Deuteranomaly.
	.Tritan 3 -- Tritanopia/Tritanomaly.
	.Achroma 4 -- Achromatopsia/Achromatomaly.

	The Group enum is used to represent the different groups of colour blindness.
	It is used internally by the [Simulate](#Simulate) method to determine which
	colour blindness simulation to use. It is unlikely that you will need to
	use this enum.
]=]
local Enums = {
	Blind = {
		Trichromacy = 0,
		Protanopia = 1,
		Protanomaly = 2,
		Deuteranopia = 3,
		Deuteranomaly = 4,
		Tritanopia = 5,
		Tritanomaly = 6,
		Achromatopsia = 7,
		Achromatomaly = 8,
	},

	Group = {
		Trichroma = 0,
		Protan = 1,
		Deutan = 2,
		Tritan = 3,
		Achroma = 4,
	},
}

Enums.Blind.None = Enums.Blind.Trichromacy
Enums.Blind.LowRed = Enums.Blind.Protanomaly
Enums.Blind.LowGreen = Enums.Blind.Deuteranomaly
Enums.Blind.LowBlue = Enums.Blind.Tritanomaly
Enums.Blind.LowColour = Enums.Blind.Achromatomaly

Enums.Blind.NoRed = Enums.Blind.Protanopia
Enums.Blind.NoGreen = Enums.Blind.Deuteranopia
Enums.Blind.NoBlue = Enums.Blind.Tritanopia
Enums.Blind.NoColour = Enums.Blind.Achromatopsia

return Enums
