export enum Units {
	Milliliter,
	Liter,
	Gallon,
	Quart,
	Pint,
	Cup,
	FluidOunce,
	Tablespoon,
	Teaspoon,
	Pound,
	Ounce,
	Unit,
	Can
}

export const SingularUnitMap: Record<Units, string> = {
	[Units.Milliliter]: 'mL',
	[Units.Liter]: 'L',
	[Units.Gallon]: 'gal',
	[Units.Quart]: 'quart',
	[Units.Pint]: 'pint',
	[Units.Cup]: 'cup',
	[Units.FluidOunce]: 'fl oz',
	[Units.Tablespoon]: 'Tbsp',
	[Units.Teaspoon]: 'tsp',
	[Units.Pound]: 'lb',
	[Units.Ounce]: 'oz',
	[Units.Unit]: '',
	[Units.Can]: 'can'
};

export const PluralUnitMap: Record<Units, string> = {
	[Units.Milliliter]: 'mL',
	[Units.Liter]: 'L',
	[Units.Gallon]: 'gal',
	[Units.Quart]: 'quarts',
	[Units.Pint]: 'pints',
	[Units.Cup]: 'cups',
	[Units.FluidOunce]: 'fl oz',
	[Units.Tablespoon]: 'Tbsp',
	[Units.Teaspoon]: 'tsp',
	[Units.Pound]: 'lbs',
	[Units.Ounce]: 'oz',
	[Units.Unit]: '',
	[Units.Can]: 'cans'
};

export const UnitMap: Record<string, Units> = {
	ml: Units.Milliliter,
	milliliter: Units.Milliliter,
	milliliters: Units.Milliliter,
	liter: Units.Liter,
	liters: Units.Liter,
	l: Units.Liter,
	gallons: Units.Gallon,
	gallon: Units.Gallon,
	g: Units.Gallon,
	gal: Units.Gallon,
	quarts: Units.Quart,
	quart: Units.Quart,
	q: Units.Quart,
	qt: Units.Quart,
	pints: Units.Pint,
	pint: Units.Pint,
	p: Units.Pint,
	pnt: Units.Pint,
	pt: Units.Pint,
	cup: Units.Cup,
	cups: Units.Cup,
	c: Units.Cup,
	cp: Units.Cup,
	'fluid ounces': Units.FluidOunce,
	'fluid ounce': Units.FluidOunce,
	'fl oz': Units.FluidOunce,
	floz: Units.FluidOunce,
	tablespoons: Units.Tablespoon,
	tablespoon: Units.Tablespoon,
	tbsp: Units.Tablespoon,
	teaspoons: Units.Teaspoon,
	teaspoon: Units.Teaspoon,
	tsp: Units.Teaspoon,
	pounds: Units.Pound,
	pound: Units.Pound,
	lb: Units.Pound,
	lbs: Units.Pound,
	ounces: Units.Ounce,
	ounce: Units.Ounce,
	oz: Units.Ounce,
	units: Units.Unit,
	unit: Units.Unit,
	can: Units.Can,
	cans: Units.Can
};

export const orderedUnits = Object.entries(UnitMap).sort(([a], [b]) => b.length - a.length);