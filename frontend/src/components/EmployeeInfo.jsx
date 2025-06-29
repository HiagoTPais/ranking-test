import React, { useState, useEffect } from 'react';

export default function EmployeeInfo({ employee }) {
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (employee) {
            fetchEmployeeDetails();
        }
    }, [employee]);

    const fetchEmployeeDetails = async () => {
        if (!employee) return;

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/employees/${employee.id}`);
            const data = await response.json();
            setEmployeeDetails(data);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!employee) return (
        <div className="info">
            <p>Nenhum colaborador disponível</p>
        </div>
    );

    const imageUrl = employee.photo ? `http://localhost:3000${employee.photo}` : null;

    return (
        <div className="info">
            <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", flexDirection: 'column' }}>
                {imageUrl ? (
                    <img src={imageUrl} alt="Foto" width="110" height="110" style={{ borderRadius: "50%" }} />
                ) : (
                    <div style={{ width: "100px", height: "100px", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                        <span style={{ color: "#999" }}>Sem foto</span>
                    </div>
                )}
                <h3 style={{ lineHeight: '5px', margin: '12px', color: '#465068', fontWeight:'700' }}>{employee.name}</h3>
                <p style={{ lineHeight: '5px', margin: '12px', color: '#465068' }}> {employee.role}</p>
            </div>

            <p className='score-list'>PONTUAÇÃO</p>

            <div style={{ marginTop: '10px' }}>
                {loading ? (
                    <p style={{ fontSize: '12px', color: '#666' }}>Carregando...</p>
                ) : employeeDetails?.history && employeeDetails.history.length > 0 ? (
                    <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {employeeDetails.history.map((point, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '8px',
                                    marginBottom: '5px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#465068', marginTop: '2px', fontSize: '18px' }}>
                                        {point.reason}
                                    </span>
                                    <span style={{
                                        fontWeight: 'bold',
                                        fontSize: '18px',
                                        color: point.amount >= 0 ? '#28a745' : '#dc3545'
                                    }}>
                                        {point.amount}pts
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                        Nenhuma pontuação
                    </p>
                )}
            </div>
        </div>
    );
}
