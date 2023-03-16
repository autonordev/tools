--!optimize 2
local CircularBuffer = {}
CircularBuffer.ClassName = "CircularBuffer"
CircularBuffer.__index = CircularBuffer

function CircularBuffer.new(MaxCapacity: number)
	return setmetatable({
		Capacity = MaxCapacity;
		Data = table.create(MaxCapacity);
		Index = MaxCapacity + 1;
	}, CircularBuffer)
end

function CircularBuffer.FromPreallocation<T>(MaxCapacity: number, _: T): CircularBuffer<T>
	return (
		setmetatable({
			Capacity = MaxCapacity;
			Data = table.create(MaxCapacity);
			Index = MaxCapacity + 1;
		}, CircularBuffer) :: any
	) :: CircularBuffer<T>
end

function CircularBuffer.Is(Value)
	return type(Value) == "table" and getmetatable(Value) == CircularBuffer
end

function CircularBuffer:Clear()
	table.clear(self.Data)
	return self
end

function CircularBuffer:GetCapacity()
	return self.Capacity
end

function CircularBuffer:GetMaxCapacity()
	return self.Capacity
end

function CircularBuffer:IsEmpty()
	return #self.Data == 0
end

function CircularBuffer:IsFull()
	return #self.Data == self.Capacity
end

function CircularBuffer:Push(NewData: any)
	local Data = self.Data
	table.insert(Data, 1, NewData)
	return table.remove(Data, self.Index)
end

function CircularBuffer:Replace(Index: number, NewData: any)
	local Data = self.Data
	local OldData = Data[Index]
	if OldData ~= nil then
		Data[Index] = NewData
	else
		error(
			string.format(
				"[CircularBuffer.Replace] - Data[%d] does not exist and cannot be replaced as a result.",
				Index
			),
			2
		)
	end

	return OldData
end

function CircularBuffer:Insert(Index: number, NewData: any)
	local Data = self.Data
	table.insert(Data, Index, NewData)
	return table.remove(Data, self.Index)
end

function CircularBuffer:PeekAt(Index: number?)
	return self.Data[if Index then Index else 1]
end

function CircularBuffer:Iterator()
	return ipairs(self.Data)
end

function CircularBuffer:__tostring()
	local Data = self.Data
	if #Data <= 10 then
		local NewData = table.clone(Data)
		for Index, Value in ipairs(NewData) do
			NewData[Index] = tostring(Value)
		end

		return string.format("CircularBuffer<[%*]>", table.concat(NewData, ", "))
	else
		return "CircularBuffer<[...]>"
	end
end

export type CircularBuffer<T> = {
	ClassName: "CircularBuffer",

	Capacity: number,
	Data: {T},
	Index: number,

	Clear: (self: CircularBuffer<T>) -> CircularBuffer<T>,

	GetCapacity: (self: CircularBuffer<T>) -> number,
	GetMaxCapacity: (self: CircularBuffer<T>) -> number,

	IsEmpty: (self: CircularBuffer<T>) -> boolean,
	IsFull: (self: CircularBuffer<T>) -> boolean,

	Push: (self: CircularBuffer<T>, NewData: T) -> T?,
	Replace: (self: CircularBuffer<T>, Index: number, NewData: T) -> T?,
	Insert: (self: CircularBuffer<T>, Index: number, NewData: T) -> T?,

	PeekAt: (self: CircularBuffer<T>, Index: number) -> T?,
	Iterator: (self: CircularBuffer<T>) -> () -> (number, T),
}

table.freeze(CircularBuffer)
return CircularBuffer
