import React from 'react';

interface Props {
  checked: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
}

const RadioButton: React.FC<Props> = ({
  checked,
  handleChange,
  name,
  label,
}) => {
  return (
    <div>
      <label>
        <input
          type='radio'
          value='summary'
          name={name}
          checked={checked}
          onChange={handleChange}
        />
        {label}
      </label>
    </div>
  );
};

export default RadioButton;
