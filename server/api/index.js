import express from "express";
import cors from 'cors';
import VehiclesController from "./Controllers/VehiclesController";

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.get('/veiculos', async (req, res) => await VehiclesController.index(req, res));

app.get('/veiculos/:id', async (req, res) => await VehiclesController.findOne(req, res));

app.post('/veiculos', async (req, res) => await VehiclesController.create(req, res));

app.put('/veiculos/:id', async (req, res) => await VehiclesController.update(req, res));

app.delete('/veiculos/:id', async (req, res) => await VehiclesController.remove(req, res));

app.listen(3333, () => {
    console.log('%cServidor rodando na porta 3333', 'color: green');
});

export default {
    path: '/api', 
    handler: app
}
