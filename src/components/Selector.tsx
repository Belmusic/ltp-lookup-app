import React from 'react';

interface Props {
  value: string;
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder: string;
  title: string;
  items: Item[];
  name: string;
  disabled?: boolean;
}

type Item = {
  value: string;
  key: string;
};

const Selector: React.FC<Props> = ({
  value,
  placeholder,
  handleChange,
  title,
  items,
  name,
  disabled = false,
}: Props) => {
  return (
    <div>
      <label>
        <span>{title}</span>
        <select
          value={value}
          onChange={handleChange}
          name={name}
          disabled={disabled}
        >
          <option value=''>{placeholder}</option>
          {items.map((item: Item) => (
            <option key={item?.key} value={item?.value}>
              {item?.key}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Selector;
