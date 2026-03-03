import { useState } from 'react';

const useForm = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
    if (touched[name] && validate) {
      const errs = validate({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    if (validate) {
      const errs = validate(values);
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    if (validate) {
      const errs = validate(values);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    onSubmit(values);
  };

  const reset = () => { setValues(initialValues); setErrors({}); setTouched({}); };

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, reset, setValues };
};

export default useForm;
