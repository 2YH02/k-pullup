import { ChangeEvent, useState } from "react";

const useInput = (initValue: string) => {
  const [value, setValue] = useState(initValue);

  const onChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    setValue(e.target.value);
  };

  const setInputValue = (value: string) => {
    setValue(value);
  };

  const resetValue = () => {
    setValue("");
  };

  return { value, onChange, setInputValue, resetValue };
};

export default useInput;
