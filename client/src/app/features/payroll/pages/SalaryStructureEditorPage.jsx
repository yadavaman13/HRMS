import { useState, useEffect } from 'react';
import { usePayroll } from '../hooks/usePayroll';
import { useEmployee } from '@/app/features/employees/hooks/useEmployee';
import SalaryStructureEditor from '../components/SalaryStructureEditor/SalaryStructureEditor';
import Dropdown from '@/components/Shared/Form/Dropdown/Dropdown';
import Spinner from '@/components/Shared/Feedback/Spinner/Spinner';
import './SalaryStructureEditorPage.scss';

export default function SalaryStructureEditorPage() {
    const { salaryStructure, fetchSalaryStructure, handleSaveSalaryStructure, loading } =
        usePayroll();
    const { employees, fetchEmployees } = useEmployee();

    const [selectedEmpId, setSelectedEmpId] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const safeEmployees = Array.isArray(employees) ? employees : [];

    useEffect(() => {
        if (selectedEmpId) {
            fetchSalaryStructure(selectedEmpId);
        } else if (safeEmployees.length > 0 && !selectedEmpId) {
            setSelectedEmpId(safeEmployees[0]?.id || '');
            fetchSalaryStructure(safeEmployees[0]?.id || '');
        }
    }, [selectedEmpId, safeEmployees.length]);

    const employeeOptions = safeEmployees.map((e) => ({
        label: `${e?.firstName || ''} ${e?.lastName || ''} (${e?.employeeCode || e?.code || 'EMP'})`,
        value: e?.id || '',
    }));

    return (
        <div className="salary-editor-page">
            <div className="salary-editor-page__header">
                <div>
                    <h1 className="salary-editor-page__title">
                        Salary Structure & Compensation Engine
                    </h1>
                    <p className="salary-editor-page__subtitle">
                        Configure contractual wage packages with automatic percentage breakdown and
                        dynamic residual Fixed Allowance balancing.
                    </p>
                </div>

                <div className="employee-select-box">
                    <Dropdown
                        label="Select Employee"
                        options={employeeOptions}
                        value={selectedEmpId}
                        onChange={(val) => setSelectedEmpId(val)}
                        placeholder="Choose Employee..."
                    />
                </div>
            </div>

            {loading && !salaryStructure ? (
                <div className="salary-editor-page__loading">
                    <Spinner label="Loading compensation parameters..." />
                </div>
            ) : (
                <div className="salary-editor-page__content">
                    <SalaryStructureEditor
                        initialData={salaryStructure}
                        onSave={(data) => handleSaveSalaryStructure(selectedEmpId, data)}
                        loading={loading}
                    />
                </div>
            )}
        </div>
    );
}
