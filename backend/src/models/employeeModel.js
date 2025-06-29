const db = require('../database/db');

const Employee = {
  getAll: () => db('employees').select('*'),

  getById: (id) =>
    db('employees')
      .where({ id })
      .first(),

  getWithPoints: async () => {
    return db('employees')
      .leftJoin('points', 'employees.id', 'points.employee_id')
      .select(
        'employees.id',
        'employees.name',
        'employees.role',
        'employees.photo'
      )
      .sum({ total_points: 'points.amount' })
      .groupBy('employees.id')
      .orderBy('total_points', 'desc');
  },

  create: (data) =>
    db('employees').insert(data),

  update: (id, data) =>
    db('employees').where({ id }).update(data),

  remove: (id) =>
    db('employees').where({ id }).del(),
};

module.exports = Employee;
