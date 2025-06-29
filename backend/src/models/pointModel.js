const db = require('../database/db');

const Point = {
  getByEmployeeId: (employee_id) =>
    db('points')
      .where({ employee_id })
      .orderBy('created_at', 'desc'),

  create: (data) =>
    db('points').insert(data),

  update: (id, data) =>
    db('points').where({ id }).update(data),

  remove: (id) =>
    db('points').where({ id }).del(),

  getById: (id) =>
    db('points').where({ id }).first(),
};

module.exports = Point;
c