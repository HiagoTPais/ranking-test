import React, { useState, useEffect } from 'react';

export default function PointsFormModal({ visible, onClose, onSave, employees }) {
    const [form, setForm] = useState({
        employee_id: '',
        reason: '',
        amount: ''
    });

    useEffect(() => {
        setForm({ employee_id: '', reason: '', amount: '' });
    }, [visible]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://localhost:3000/points';

        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            onSave();
            onClose();
        } else {
            console.error('Erro ao atribuir pontos.');
        }
    };

    if (!visible) return null;

    return (
        <div className="modal">
            <h2 style={{ color: '#434343', fontSize: '22px' }}>Atribuir Pontos</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <span style={{ fontSize: '18px', color: '#434343' }}>Colaborador:*</span>
                    <br />
                    <select
                        style={{
                            width: '100%',
                            height: '40px',
                            borderRadius: '10px',
                            border: '1px solid #B3B3B3',
                            padding: '0 10px',
                            fontSize: '16px'
                        }}
                        name="employee_id"
                        value={form.employee_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um colaborador</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.name} - {employee.role}
                            </option>
                        ))}
                    </select>
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ fontSize: '18px', color: '#434343' }}>Motivo da Pontuação:*</span>
                        <br />
                        <input
                            style={{
                                width: '100%',
                                borderRadius: '10px',
                                border: '1px solid #B3B3B3',
                                padding: '10px',
                                fontSize: '16px',
                                resize: 'vertical'
                            }}
                            name="reason"
                            value={form.reason}
                            onChange={handleChange}
                            placeholder="Justifique a pontuação"
                            required
                        />
                    </div>
                    <div style={{ marginRight: '24px' }}>
                        <span style={{ fontSize: '18px', color: '#434343' }}>Pontos:*</span>
                        <br />
                        <input
                            style={{
                                width: '100%',
                                height: '42px',
                                borderRadius: '10px',
                                border: '1px solid #B3B3B3',
                                padding: '0 10px',
                                fontSize: '16px',
                            }}
                            type="number"
                            name="amount"
                            value={form.amount}
                            onChange={handleChange}
                            placeholder="Quantidade de pontos"
                            required
                        />
                    </div>
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button
                        style={{
                            background: 'white',
                            border: '2px solid #64779C',
                            color: '#64779C',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        type="button"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button
                        style={{
                            backgroundColor: '#64779C',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '5px',
                            cursor: 'pointer'
                        }}
                        type="submit"
                    >
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );
} 