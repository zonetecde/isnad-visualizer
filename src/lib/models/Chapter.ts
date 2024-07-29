import {
	DataTypes,
	Model,
	type CreationOptional,
	type InferAttributes,
	type InferCreationAttributes
} from '@sequelize/core';

import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

export default class Chapter extends Model<
	InferAttributes<Chapter>,
	InferCreationAttributes<Chapter>
> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare id: CreationOptional<number>;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare source: string;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare chapterNumber: number;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare chapterTitle: string;
}
