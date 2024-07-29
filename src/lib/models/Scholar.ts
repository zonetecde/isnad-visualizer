import {
	DataTypes,
	Model,
	type CreationOptional,
	type InferAttributes,
	type InferCreationAttributes
} from '@sequelize/core';

import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

export default class Scholar extends Model<
	InferAttributes<Scholar>,
	InferCreationAttributes<Scholar>
> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare id: CreationOptional<number>;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare scholarId: number;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare nameArabic: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare nameEnglish: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare grade: string;
}
