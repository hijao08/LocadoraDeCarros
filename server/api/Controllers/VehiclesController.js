import Vehicle from "../Models/Vehicles";

const index = async (req, res) => {
  try {
    const vehicle = await Vehicle.findAll();
    return res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao buscar veículo." });
  }
};

const findOne = async (req, res) => {
  const { params: { id } } = req;
  const vehicle = await Vehicle.findByPk(id);

  if (!vehicle) {
    return res.status(404).json({ error: "Veículo não encontrado." });
  }

  return res.json(vehicle);
};

const create = async (req, res) => {
  try {
    const {
      rental_company,
      model,
      brand,
      year,
      engine,
      doors,
      shift_model,
      air_conditioner,
    } = req.body;

    const newvehicle = await Vehicle.create({
      rental_company,
      model,
      brand,
      year,
      engine,
      doors,
      shift_model,
      air_conditioner,
    });

    res.status(201).json(newvehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

const update = async (req, res) => {
  try {
    const { params: { id } } = req;
    const {
      rental_company,
      model,
      brand,
      year,
      engine,
      doors,
      shift_model,
      air_conditioner,
    } = req.body;

    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

    await vehicle.update({
      rental_company,
      model,
      brand,
      year,
      engine,
      doors,
      shift_model,
      air_conditioner,
    });
    return res.json(vehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao atualizar veículo." });
  }
};

const remove = async (req, res) => {
    const { params: { id } } = req;
    const vehicle = await Vehicle.findByPk(id);

    if (!vehicle) {
      return res.status(404).json({ error: "Veículo não encontrado." });
    }

    await vehicle.destroy();
    return res.status(200).json("Veículo deletado com sucesso!");
};

export default {
    index, 
    findOne,
    create,
    update,
    remove
}
