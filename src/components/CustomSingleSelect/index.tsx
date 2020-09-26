import React, { FunctionComponent } from "react";
import Select from "react-select";

import { styles, theme, SelectBlock } from "./styles";

interface CustomSingleSelectProps {
  name: string;
  label: string;
  value?: any;
  onChange: (key: string, value: any) => void;
  options?: any;
  className?: string;
}

const CustomSingleSelect: FunctionComponent<CustomSingleSelectProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  className,
  ...rest
}: CustomSingleSelectProps) => {
  return (
    <SelectBlock className={className}>
      <label htmlFor={name}>{label}</label>
      <Select
        id={name}
        isClearable={false}
        onChange={(option: any) => onChange(name, option?.value)}
        options={options}
        styles={styles}
        placeholder=""
        theme={theme}
        value={value}
        {...rest}
      />
    </SelectBlock>
  );
};

export default CustomSingleSelect;