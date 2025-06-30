const db = require('../database/db');

module.exports = {
    async index(req, res) {
        const employees = await db('employees')
            .leftJoin('points', 'employees.id', 'points.employee_id')
            .select(
                'employees.id',
                'employees.name',
                'employees.role',
                'employees.photo'
            )
            .sum('points.amount as total_points')
            .groupBy('employees.id', 'employees.name', 'employees.role', 'employees.photo')
            .orderBy('total_points', 'desc');

        res.json(employees);
    },

    async show(req, res) {
        const { id } = req.params;

        const employee = await db('employees').where({ id }).first();
        if (!employee) return res.status(404).json({ error: 'Colaborador não encontrado' });

        const history = await db('points')
            .where({ employee_id: id })
            .select('id', 'amount', 'reason', 'created_at')
            .orderBy('created_at', 'desc');

        res.json({ ...employee, history });
    },

    async store(req, res) {
        const { name, role } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : null;

        const [id] = await db('employees').insert({
            name,
            role,
            photo,
        });

        return res.status(201).json({ id });
    },

    async update(req, res) {
        const { id } = req.params;
        const { name, role } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : req.body.photo;

        const updateData = { name, role };
        if (photo) {
            updateData.photo = photo;
        }

        await db('employees').where({ id }).update(updateData);
        res.sendStatus(204);
    },

    async destroy(req, res) {
        const { id } = req.params;
        await db('points').where({ employee_id: id }).del();
        await db('employees').where({ id }).del();
        res.sendStatus(204);
    }
};
