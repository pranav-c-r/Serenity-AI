import React from 'react';
import { Button, Input } from '../common';
import './AuthForm.scss';

const AuthForm = ({ isLogin, onSubmit, loading }) => {
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    name: !isLogin ? '' : undefined
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {!isLogin && (
        <Input
          label="Full Name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
        />
      )}
      
      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      
      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        minLength="6"
      />
      
      <Button type="submit" disabled={loading}>
        {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default AuthForm;