import React, { useState, useEffect } from 'react';
import EmployeeFormModal from './components/EmployeeFormModal';
import PointsFormModal from './components/PointsFormModal';
import EmployeeInfo from './components/EmployeeInfo';

export default function App() {
	const [employees, setEmployees] = useState([]);
	const [showEmployeeModal, setShowEmployeeModal] = useState(false);
	const [showPointsModal, setShowPointsModal] = useState(false);
	const [editingEmployee, setEditingEmployee] = useState(null);
	const topEmployee = employees[0];

	useEffect(() => {
		fetchEmployees();
	}, []);

	const fetchEmployees = async () => {
		const res = await fetch('http://localhost:3000/employees');
		const data = await res.json();

		setEmployees(data);
	};

	const handleDelete = async (id) => {
		if (!confirm('Deseja realmente excluir este colaborador?')) return;

		await fetch(`http://localhost:3000/employees/${id}`, { method: 'DELETE' });
		fetchEmployees();
	};

	return (
		<div className="container" style={{ position: 'relative', margin: '0 auto' }}>
			<div style={{ display: 'flex' }}>
				<div style={{ margin: '10px' }}>
					<EmployeeInfo employee={topEmployee} />
				</div>
				<div style={{ margin: '10px', overflow: 'hidden' }}>
					<div style={{
						maxHeight: '400px',
						overflowY: 'auto',
						border: '2px solid #8E5F2B',
						borderRadius: '4px',
						overflowX: 'hidden',
						position: 'relative',
						backgroundColor: 'white'
					}}>
						<div style={{
							backgroundColor: '#8E5F2B',
							color: 'white',
							padding: '10px',
							textAlign: 'center',
							fontWeight: 'bold',
							fontSize: '18px',
							borderTopLeftRadius: '2px',
							borderTopRightRadius: '2px'
						}}>
							RANKING
						</div>
						<table style={{
							borderCollapse: 'collapse',
							tableLayout: 'fixed',
							backgroundColor: 'white',
							position: 'relative',
							zIndex: 1,
							boxSizing: 'border-box',
							width: '100%'
						}}>
							<thead>

							</thead>
							<tbody>
								{employees.map((e, index) => (
									<tr
										key={e.id}
										style={{ borderBottom: '1px solid #eee', background: '#F4EDDF' }}
									>
										<td style={{ padding: '12px', textAlign: 'center', width: '60px' }}>
											<div style={{ position: 'relative', display: 'inline-block' }}>
												<img
													src={`/assets/img/${index < 4 ? (index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : 'fourth') : 'fourth'}.png`}
													alt={`${index + 1}º lugar`}
													width="80"
													height="80"
													style={{ objectFit: 'contain' }}
												/>
												<span style={{
													position: 'absolute',
													top: '50%',
													left: '50%',
													transform: 'translate(-50%, -50%)',
													fontWeight: 'bold',
													color: '#fff',
													fontSize: '12px',
													textShadow: '1px 1px 1px rgba(255,255,255,0.8)'
												}}>
													{index + 1}
												</span>
											</div>
										</td>
										<td style={{ padding: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
											<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0 }}>
												<img src={`http://localhost:3000${e.photo}`} alt="foto" width="40" height="40" style={{ borderRadius: '50%', flexShrink: 0 }} />
												<span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.name}</span>
											</div>
										</td>
										<td style={{ padding: '12px' }}>
											<span style={{
												fontWeight: 'bold',
												color: '#465068'
											}}>
												{e.total_points || 0}pts
											</span>
										</td>
										<td style={{ padding: '12px' }}>
											<button className='edit-button' onClick={() => {
												setEditingEmployee(e);
												setShowEmployeeModal(true);
											}}>
												<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
													<path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
												</svg>
											</button>
											<button className='delete-button' onClick={() => handleDelete(e.id)}>
												<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
												</svg>
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className='flex' style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
						<div>
							<button className='' style={{ textTransform: 'uppercase' }} onClick={() => {
								setEditingEmployee(null);
								setShowEmployeeModal(true);
							}}>
								Novo Colaborador
							</button>

							<button className='' style={{ textTransform: 'uppercase' }} onClick={() => {
								setShowPointsModal(true);
							}}>
								Atribuir Pontos
							</button>
						</div>
					</div>
				</div>
			</div>

			<EmployeeFormModal
				visible={showEmployeeModal}
				onClose={() => setShowEmployeeModal(false)}
				onSave={fetchEmployees}
				employee={editingEmployee}
			/>

			<PointsFormModal
				visible={showPointsModal}
				onClose={() => setShowPointsModal(false)}
				onSave={fetchEmployees}
				employees={employees}
			/>
		</div>
	);
}
