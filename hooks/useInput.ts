import { ChangeEvent, useCallback, useState } from "react";

const useInput = (initValue: string) => {
  const [value, setValue] = useState(initValue);

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    },
    []
  );

  const setInputValue = useCallback((value: string) => {
    setValue(value);
  }, []);

  const resetValue = useCallback(() => {
    setValue(initValue);
  }, [initValue]);

  return { value, onChange, setInputValue, resetValue };
};

export default useInput;
