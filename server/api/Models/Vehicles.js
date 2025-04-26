import { Sequelize, DataTypes } from "sequelize";

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3307;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'ANSKk08aPEDbFjDO';
const DB_NAME = process.env.DB_NAME || 'testing';

const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST, 
    port: DB_PORT,
    dialect: 'mysql',
    retry: {
        max: 5,
        timeout: 60000
    }
});

const vehicle = db.define("Vehicles", {
    rental_company: DataTypes.STRING,
    model: DataTypes.STRING,
    brand: DataTypes.STRING,
    year: DataTypes.INTEGER,
    engine: DataTypes.STRING,
    doors: DataTypes.INTEGER,
    shift_model:DataTypes.STRING,
    air_conditioner: DataTypes.BOOLEAN
});

db.sync();

export default vehicle;