import { OptionType } from "@/constants/options";
import React, { useEffect, useState } from "react";
import Select from "react-select";

type MultiSelectProps = {
  placeholder: string;
  options: OptionType[];
  value: OptionType[];
  onChange: (selected: OptionType[]) => void;
};

const MultiSelect: React.FC<MultiSelectProps> = ({
  placeholder,
  options,
  value,
  onChange,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      height: "120px",
      overflowY: "auto",
      border: `2px solid ${state.isFocused ? "#2A83C6" : "#D7DEE8"}`,
      boxShadow: "none",
      borderRadius: "8px",
      ":hover": {
        borderColor: `${state.isFocused ? "#2A83C6" : "#D7DEE8"}`,
        backgroundColor: "transparent",
        cursor: "text",
      },
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#F3F6FA",
      borderRadius: "4px",
      border: "2px solid #34A853",
      margin: "4px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      fontWeight: "500",
      color: "#2D499B",
      padding: "4px 8px",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "#8797AE",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "transparent",
        color: "#2D499B",
      },
    }),
    menuList: (provided: any) => ({
      ...provided,
      maxHeight: "120px",
      overflowY: "auto",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      display: "none",
    }),
  };

  return (
    <div>
      <Select
        options={options}
        placeholder={placeholder}
        isMulti={true}
        styles={customStyles}
        noOptionsMessage={() => "Tidak ada data"}
        value={value}
        onChange={(selected) => onChange(selected as OptionType[])}
      />
    </div>
  );
};

export default MultiSelect;
