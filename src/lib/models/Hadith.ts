import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from '@sequelize/core';

import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';
import type Scholar from './Scholar';

export default class Hadith extends Model<InferAttributes<Hadith>, InferCreationAttributes<Hadith>> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare id: CreationOptional<number>;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare hadithId: number;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare source: string;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare chapterNumber: number;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare hadithNumber: number;

	@Attribute(DataTypes.ARRAY(DataTypes.INTEGER))
	@NotNull
	declare chain: number[];

	@Attribute(DataTypes.TEXT)
	@NotNull
	declare textArabic: string;

	@Attribute(DataTypes.TEXT)
	@NotNull
	declare textEnglish: string;

	declare transmissionChain: Scholar[];
}
