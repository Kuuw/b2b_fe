import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserLogin } from '../../../models/user';
import Card from '../../atoms/Card';
import Title from '../../atoms/Title';
import LoginForm from '../../molecules/LoginForm/LoginForm';
import { LoginProps } from './Login.types';
import { useAuth } from '../../../contexts/AuthContext';
import clsx from 'clsx';

const Login: React.FC<LoginProps> = ({ className }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>();

  const handleLogin = async (data: UserLogin) => {
    try {
      await login(data);
      navigate('/products');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className={clsx("min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8", className)}>
      <Card className="max-w-md w-full space-y-8" padding="large">
        <Title variant="h2" align="center">
          Sign in to your account
        </Title>
        <LoginForm onSubmit={handleLogin} error={error} />
      </Card>
    </div>
  );
};

export default Login; 