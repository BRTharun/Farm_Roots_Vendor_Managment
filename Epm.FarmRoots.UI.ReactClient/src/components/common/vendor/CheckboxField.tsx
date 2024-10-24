import React from 'react';
import { FieldInputProps, FieldMetaProps } from 'formik';

interface CheckboxFieldProps {
    name: string;
    label: string;
    field: FieldInputProps<any>;
    meta: FieldMetaProps<any>;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, field, meta }) => (
    <label className="block">
        <span className="text-gray-700">{label}</span>
        <input
            {...field}
            type="checkbox"
            className="mt-1 block"
        />
        {meta.touched && meta.error && <div className="text-red-500 text-sm mt-1">{meta.error}</div>}
    </label>
);

export default CheckboxField;