import React from "react";
import { FieldInputProps, FieldMetaProps } from "formik";

interface SelectFieldProps {
    name: string;
    label: string;
    field: FieldInputProps<any>;
    meta: FieldMetaProps<any>;
    options: { value: string; label: string }[];
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({
    label,
    field,
    meta,
    options,
    onChange,
}) => (
    <label className="block">
        <span className="text-gray-700">{label}</span>
        <select
            {...field}
            onChange={(e) => {
                field.onChange(e);
                if (onChange) onChange(e);
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
        >
            <option value="">Select {label}</option>
            {options.map((option, index) => (
                <option key={index} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        {meta.touched && meta.error && (
            <div className="text-red-500 text-sm mt-1">{meta.error}</div>
        )}
    </label>
);

export default SelectField;
