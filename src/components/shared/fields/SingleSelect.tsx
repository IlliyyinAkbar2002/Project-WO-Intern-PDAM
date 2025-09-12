import { OptionType } from "@/constants/options";
import React, { useEffect, useState } from "react";
import Select from "react-select";

type SingleSelectProps = {
  label?: string;
  required?: boolean;
  variant?: "clear" | "default" | "inline";
  placeholder: string;
  isSearchable?: boolean;
  isDisabled?: boolean;
  options: OptionType[];
  value: OptionType | null;
  onBlur?: () => void;
  onChange: (selected: OptionType) => void;
  menuPlacement?: "auto" | "top" | "bottom";
  unit?: string | null;
  description?: string | null;
};

const SingleSelect: React.FC<SingleSelectProps> = ({
  label,
  required,
  variant = "default",
  placeholder,
  isSearchable = false,
  isDisabled = false,
  options,
  value,
  onBlur,
  onChange,
  menuPlacement = "auto",
  unit,
  description,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  const variantStyles = {
    clear: {
      control: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        height: "40px",
        border: `2px solid ${state.isFocused ? "#2A83C6" : "#E2E8F0"}`,
        width: "88px",
        boxShadow: "none",
        fontSize: "14px",
        fontWeight: 500,
        ":hover": {
          borderColor: `${state.isFocused ? "#2A83C6" : "#E2E8F0"}`,
          cursor: "pointer",
        },
      }),
      placeholder: (provided: any) => ({
        ...provided,
        color: "#000000",
        fontSize: "14px",
        fontWeight: 500,
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#007bff"
          : state.isFocused
          ? "#e0e0e0"
          : "#ffffff",
        color: state.isSelected ? "white" : "black",
        fontWeight: 500,
        fontSize: "14px",
        padding: "10px",
      }),
      dropdownIndicator: (provided: any) => ({
        ...provided,
        color: "#87878B",
        backgroundColor: "transparent",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
    },
    default: {
      control: (provided: any, state: any) => ({
        ...provided,
        width: "100%",
        height: "40px",
        fontSize: "16px",
        backgroundColor: state.isDisabled ? "#F3F4F6" : "#FFFFFF",
        border: state.isDisabled
          ? "2px solid #E2E8F0"
          : `2px solid ${state.isFocused ? "#2A83C6" : "#2D499B"}`,
        boxShadow: "none",
        borderRadius: "8px",
        cursor: "pointer",
        ":hover": {
          borderColor: `${state.isFocused ? "#2A83C6" : "#2D499B"}`,
        },
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#2A83C6"
          : state.isFocused
          ? "#f0f0f0"
          : "#ffffff",
        color: state.isSelected ? "white" : "black",
        fontSize: "16px",
        padding: "8px 10px",
      }),
      dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        color: "#87878B",
        ":hover": { color: "#000000" },
        visibility: state.isDisabled ? "hidden" : "visible",
        backgroundColor: "transparent",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: "#000000",
        opacity: 1,
      }),
      menu: (provided: any) => ({
        ...provided,
        borderRadius: "8px",
        overflow: "hidden",
      }),
      menuList: (provided: any) => ({
        ...provided,
        maxHeight: "204px",
      }),
    },
    inline: {
      control: (provided: any, state: any) => ({
        ...provided,
        width: "150px",
        height: "32px",
        minHeight: "0px",
        textAlign: "left",
        fontSize: "14px",
        backgroundColor: "#FAFAFA",
        border: state.isDisabled
          ? "2px solid #E2E8F0"
          : `2px solid ${state.isFocused ? "#2A83C6" : "#2D499B"}`,
        boxShadow: "none",
        borderRadius: "8px",
        cursor: "pointer",
        ":hover": {
          borderColor: `${state.isFocused ? "#2A83C6" : "#2D499B"}`,
        },
      }),
      option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected
          ? "#2A83C6"
          : state.isFocused
          ? "#f0f0f0"
          : "#ffffff",
        color: state.isSelected ? "white" : "black",
        fontSize: "14px",
        padding: "4px 10px",
      }),
      dropdownIndicator: (provided: any, state: any) => ({
        ...provided,
        color: "#87878B",
        visibility: state.isDisabled ? "hidden" : "visible",
        backgroundColor: "transparent",
        padding: "0px 8px",
      }),
      indicatorSeparator: () => ({
        display: "none",
      }),
      singleValue: (provided: any) => ({
        ...provided,
        color: "#000000",
        opacity: 1,
      }),
      menu: (provided: any) => ({
        ...provided,
        borderRadius: "8px",
        overflow: "hidden",
      }),
      menuList: (provided: any) => ({
        ...provided,
        maxHeight: "124px",
      }),
      menuPortal: (base: any) => ({
        ...base,
        zIndex: 9999,
      }),
    },
  };

  const customStyles = variantStyles[variant];

  return (
    <div>
      {label && (
        <label className="block text-base font-medium text-primary-500 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="flex items-center gap-2">
        <div className="w-full">
          <Select
            options={options}
            placeholder={placeholder}
            styles={customStyles}
            isSearchable={isSearchable}
            isDisabled={isDisabled}
            value={value}
            onBlur={onBlur}
            onChange={(selected) => onChange(selected as OptionType)}
            menuPlacement={menuPlacement}
            menuPortalTarget={
              variant === "inline" && typeof window !== "undefined"
                ? document.body
                : null
            }
          />
        </div>
        {unit && <span className="text-sm text-black">{unit}</span>}
      </div>
      {description && (
        <span className="text-grey-500 text-xs">{description}</span>
      )}
    </div>
  );
};

export default SingleSelect;
