export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;
  return passwordRegex.test(password);
};

export const validateCode = (code: string) => {
  const codeRegex = /^\d{6}$/;
  return codeRegex.test(code);
};

export const validateNumeric = (number: string) => {
  const numberRegex = /^\d*$/;
  return numberRegex.test(number);
};

interface SigninValue {
  email: string;
  password: string;
}

export const validateMassage = {
  email: "이메일 형식을 확인해주세요",
  password: "하나 이상의 숫자와 문자를 포함하여 8자 이상으로 작성해주세요.",
  emailCode: "입력한 코드를 다시 확인해주세요.",
};

export const validateSigin = (formValue: SigninValue) => {
  let errors: Partial<SigninValue> = {};

  if (!validateEmail(formValue.email)) {
    errors.email = validateMassage.email;
  }

  if (!validatePassword(formValue.password)) {
    errors.password = validateMassage.password;
  }

  return errors;
};
