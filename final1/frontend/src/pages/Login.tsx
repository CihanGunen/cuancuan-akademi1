import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch (error: any) { alert('Hatalı giriş!'); }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>CuanCuan <span style={{color: '#6366f1'}}>Akademi</span></h1>
        <p style={styles.subtitle}>Eğitimin Yeni Adresi</p>
        <form onSubmit={handleLogin} style={styles.form}>
          <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          <button type="submit" style={styles.button}>Giriş Yap</button>
        </form>
        <p style={styles.footerText}>Hesabın yok mu? <Link to="/register" style={styles.link}>Kayıt Ol</Link></p>
      </div>
    </div>
  );
};

const styles: any = {
  page: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  card: { backgroundColor: '#fff', padding: '50px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', width: '100%', maxWidth: '400px', textAlign: 'center' },
  logo: { fontSize: '30px', fontWeight: '900', marginBottom: '10px' },
  subtitle: { color: '#64748b', marginBottom: '30px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0', outline: 'none' },
  button: { padding: '16px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' },
  footerText: { marginTop: '20px', color: '#64748b' },
  link: { color: '#6366f1', fontWeight: '700', textDecoration: 'none' }
};

export default Login;