import React, { useState, useEffect } from 'react';

export default function EmployeeFormModal({ visible, onClose, onSave, employee }) {
  const [form, setForm] = useState({ name: '', role: '', photo: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [editingPoint, setEditingPoint] = useState(null);
  const [pointForm, setPointForm] = useState({ amount: '', reason: '' });

  useEffect(() => {
    if (employee) {
      setForm(employee);
      setSelectedFile(null);
      fetchEmployeeDetails();
    } else {
      setForm({ name: '', role: '', photo: '' });
      setSelectedFile(null);
      setEmployeeDetails(null);
    }
  }, [employee, visible]);

  const fetchEmployeeDetails = async () => {
    if (!employee) return;

    try {
      const response = await fetch(`http://localhost:3000/employees/${employee.id}`);
      const data = await response.json();
      console.log('Employee details fetched:', data);
      setEmployeeDetails(data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = employee ? 'PUT' : 'POST';

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('role', form.role);

    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    const url = employee
      ? `http://localhost:3000/employees/${employee.id}`
      : `http://localhost:3000/employees`;

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (res.ok) {
      onSave();
      onClose();
    } else {
      console.error('Erro ao salvar colaborador.');
    }
  };

  const handlePointEdit = (point) => {
    console.log('Editing point:', point);
    setEditingPoint(point.id);
    setPointForm({ amount: point.amount.toString(), reason: point.reason });
  };

  const handlePointSave = async () => {
    console.log('Saving point with ID:', editingPoint, 'and form data:', pointForm);
    try {
      const res = await fetch(`http://localhost:3000/points/${editingPoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseInt(pointForm.amount),
          reason: pointForm.reason
        }),
      });

      console.log('Response status:', res.status);
      if (res.ok) {
        setEditingPoint(null);
        setPointForm({ amount: '', reason: '' });
        fetchEmployeeDetails();
        onSave();
      } else {
        const errorText = await res.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error updating point:', error);
    }
  };

  const handlePointDelete = async (pointId) => {
    if (!confirm('Deseja realmente excluir estes pontos?')) return;

    try {
      const res = await fetch(`http://localhost:3000/points/${pointId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchEmployeeDetails();
        onSave();
      } else {
        console.error('Erro ao excluir pontos.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePointCancel = () => {
    setEditingPoint(null);
    setPointForm({ amount: '', reason: '' });
  };

  if (!visible) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9,
          cursor: 'pointer'
        }}
        onClick={onClose}
      />

      <div className="modal" style={{
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '20px',
        margin: '20px auto',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10
      }}>
        <h2 style={{ color: '#434343', fontSize: '22px', marginBottom: '20px' }}>{employee ? 'Editar Colaborador' : 'Adicionar Colaborador'}</h2>

        <form onSubmit={handleSubmit} style={{ flex: '0 0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="file-input-container">
              <input
                type="file"
                id="photo"
                name="photo"
                onChange={handleFileChange}
                accept="image/*"
                required={!employee}
                style={{ display: 'none' }}
              />

              <label htmlFor="photo" className="custom-file-circle" style={{ display: 'flex', justifyContent: 'center' }}>
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Preview"
                    className="preview-image"
                  />
                ) : employee?.photo ? (
                  <img
                    src={`http://localhost:3000${employee.photo}`}
                    alt="Foto atual"
                    className="preview-image"
                  />
                ) : (
                  <div className="file-new-input">
                    <span>Carregar</span>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '18px', color: '#434343' }}>Nome:*</span>
            <br />
            <input
              style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #B3B3B3' }}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nome do Colaborador"
              required
            />
          </div>
          <br />
          <div>
            <span style={{ fontSize: '18px', color: '#434343' }}>Cargo:*</span>
            <br />
            <input
              style={{ width: '100%', height: '40px', borderRadius: '10px', border: '1px solid #B3B3B3' }}
              name="role"
              value={form.role}
              onChange={handleChange}
              placeholder="Cargo do Colaborador"
              required
            />
          </div>
          <br />

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
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

        {employee && (
          <div style={{
            borderTop: '2px solid #eee',
            paddingTop: '20px',
            marginTop: '20px',
            flex: '1 1 auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h3 style={{ color: '#434343', fontSize: '20px', marginBottom: '15px', flex: '0 0 auto' }}>Pontos</h3>

            {employeeDetails?.history && employeeDetails.history.length > 0 ? (
              <div style={{
                flex: '1 1 auto',
                overflowY: 'auto',
                overflowX: 'hidden',
                paddingRight: '5px'
              }}>
                {employeeDetails.history.map((point, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '1px solid #e9ecef'
                    }}
                  >
                    {editingPoint === point.id ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <input
                            style={{
                              width: '60%',
                              padding: '8px',
                              borderRadius: '5px',
                              border: '1px solid #B3B3B3',
                              fontSize: '14px'
                            }}
                            value={pointForm.reason}
                            onChange={(e) => setPointForm({ ...pointForm, reason: e.target.value })}
                            placeholder="Motivo"
                          />
                          <input
                            style={{
                              width: '30%',
                              padding: '8px',
                              borderRadius: '5px',
                              border: '1px solid #B3B3B3',
                              fontSize: '14px'
                            }}
                            type="number"
                            value={pointForm.amount}
                            onChange={(e) => setPointForm({ ...pointForm, amount: e.target.value })}
                            placeholder="Pontos"
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button
                            style={{
                              background: 'white',
                              border: '1px solid #dc3545',
                              color: '#dc3545',
                              padding: '5px 10px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                            onClick={handlePointCancel}
                          >
                            Cancelar
                          </button>
                          <button
                            style={{
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '5px 10px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                            onClick={handlePointSave}
                          >
                            Salvar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '16px', color: '#465068', marginBottom: '5px' }}>
                            {point.reason}
                          </div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {new Date(point.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{
                            fontWeight: 'bold',
                            fontSize: '18px',
                            color: point.amount >= 0 ? '#28a745' : '#dc3545'
                          }}>
                            {point.amount}pts
                          </span>
                          <button
                            style={{
                              background: 'white',
                              border: '1px solid #007bff',
                              color: '#007bff',
                              padding: '3px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                            onClick={() => handlePointEdit(point)}
                          >
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="rgb(0, 123, 255)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="rgb(0, 123, 255)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>
                          <button
                            style={{
                              background: 'white',
                              border: '1px solid #dc3545',
                              color: '#dc3545',
                              padding: '3px 8px',
                              borderRadius: '3px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                            onClick={() => handlePointDelete(point.id)}
                          >
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" stroke="rgb(220, 53, 69)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '14px', color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                Nenhuma pontuação registrada
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}
