import React from "react";
import { FieldInputProps, FieldMetaProps } from "formik";

interface TextAreaFieldProps {
    name: string;
    label: string;
    field: FieldInputProps<any>;
    meta: FieldMetaProps<any>;
    rows?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
    label,
    field,
    meta,
    rows = 2,
}) => (
    <label className="block">
        <span className="text-gray-700">{label}</span>
        <textarea
            {...field}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
            rows={rows}
        />
        {meta.touched && meta.error && (
            <div className="text-red-500 text-sm mt-1">{meta.error}</div>
        )}
    </label>
);

export default TextAreaField;
