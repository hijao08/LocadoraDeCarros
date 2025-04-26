import { Sequelize, DataTypes } from "sequelize";

const db = new Sequelize('testing', 'root', 'ANSKk08aPEDbFjDO', {
    host: 'localhost', 
    port: 3307,
    dialect: 'mysql'
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