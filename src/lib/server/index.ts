import Chapter from '$lib/models/Chapter';
import Hadith from '$lib/models/Hadith';
import Scholar from '$lib/models/Scholar';

import { Sequelize } from '@sequelize/core';
import dotenv from 'dotenv';

dotenv.config();
const connString = process.env.DATABASE_URL;
const sequelize = new Sequelize(connString!, { logging: false });

if (!Hadith.isInitialized()) {
	sequelize.addModels([Hadith]);
}
if (!Chapter.isInitialized()) {
	sequelize.addModels([Chapter]);
}
if (!Scholar.isInitialized()) {
	sequelize.addModels([Scholar]);
}

sequelize.sync({ alter: true });

try {
	await sequelize.authenticate();
	console.log('Connection has been established successfully.');
} catch (error) {
	console.error('Unable to connect to the database:', error);
}

export default sequelize;
