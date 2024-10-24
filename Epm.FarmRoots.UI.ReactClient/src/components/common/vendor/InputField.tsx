import React from 'react';
import { FieldInputProps, FieldMetaProps } from 'formik';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  field: FieldInputProps<any>;
  meta: FieldMetaProps<any>;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ label, type = "text", field, meta, disabled }) => (
  <label className="block">
    <span className="text-gray-700">{label}</span>
    <input
      {...field}
      type={type}
      disabled={disabled}
      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm"
    />
    {meta.touched && meta.error && <div className="text-red-500 text-sm mt-1">{meta.error}</div>}
  </label>
);

export default InputField;