import {
  findAllClients,
  findClientById,
} from '../services/client.services.js';

export async function getClients(req, res, next) {
  try {
    const clients = await findAllClients();

    res.status(200).json({
      ok: true,
      data: clients,
    });
  } catch (error) {
    next(error);
  }
}

export async function getClientById(req, res, next) {
  try {
    const id = Number(req.params.id);

    // Valida que el id recibido por URL sea un numero.
    if (Number.isNaN(id)) {
      const error = new Error('El id debe ser un numero');
      error.status = 400;
      return next(error);
    }

    const client = await findClientById(id);

    // Valida que exista un cliente activo con ese id.
    if (!client) {
      const error = new Error('Cliente no encontrado');
      error.status = 404;
      return next(error);
    }

    res.status(200).json({
      ok: true,
      data: client,
    });
  } catch (error) {
    next(error);
  }
}

export async function createClient(req, res, next) {
  try {
    const error = new Error('Create client pendiente de implementar');
    error.status = 501;
    return next(error);
  } catch (error) {
    next(error);
  }
}

export async function updateClient(req, res, next) {
  try {
    const error = new Error('Update client pendiente de implementar');
    error.status = 501;
    return next(error);
  } catch (error) {
    next(error);
  }
}

export async function deleteClient(req, res, next) {
  try {
    const error = new Error('Delete client pendiente de implementar');
    error.status = 501;
    return next(error);
  } catch (error) {
    next(error);
  }
}

