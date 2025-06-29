const db = require('../database/db');

module.exports = {
  async store(req, res) {
    const { employee_id, amount, reason } = req.body;
    await db('points').insert({ employee_id, amount, reason });
    res.sendStatus(201);
  },

  async update(req, res) {
    const { id } = req.params;
    const { amount, reason } = req.body;

    await db('points').where({ id }).update({ amount, reason });
    res.sendStatus(204);
  },

  async destroy(req, res) {
    const { id } = req.params;
    await db('points').where({ id }).del();
    res.sendStatus(204);
  }
};
