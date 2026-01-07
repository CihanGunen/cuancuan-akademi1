import React, { useState } from 'react';
import api from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, email, password, role });
      alert('Hesabınız başarıyla oluşturuldu!');
      navigate('/login');
    } catch (error: any) {
      alert('Kayıt işlemi başarısız.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.logo}>CuanCuan <span style={{color: '#6366f1'}}>Akademi</span></h1>
        <p style={styles.subtitle}>Eğitim Yolculuğuna Bugün Başla</p>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" placeholder="Ad Soyad" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
          <input type="email" placeholder="E-posta Adresi" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          <input type="password" placeholder="Şifre Belirleyin" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          
          <div style={{textAlign: 'left'}}>
            <label style={styles.label}>Hesap Türü</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
              <option value="student">Öğrenci</option>
              <option value="admin">Eğitmen (Admin)</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>Hesabımı Oluştur</button>
        </form>

        <p style={styles.footerText}>
          Zaten üye misiniz? <Link to="/login" style={styles.link}>Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
};

// Stiller Login sayfası ile aynıdır
const styles: any = {
  page: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif" },
  card: { backgroundColor: '#ffffff', padding: '50px', borderRadius: '32px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px', textAlign: 'center', border: '1px solid #f1f5f9' },
  logo: { fontSize: '30px', fontWeight: '900', color: '#1e293b', marginBottom: '10px' },
  subtitle: { color: '#64748b', marginBottom: '35px', fontSize: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#64748b', marginBottom: '5px', display: 'block', marginLeft: '5px' },
  input: { width: '100%', padding: '14px', borderRadius: '14px', border: '1.5px solid #e2e8f0', outline: 'none', fontSize: '15px', boxSizing: 'border-box' },
  button: { padding: '16px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '10px', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' },
  footerText: { marginTop: '25px', color: '#64748b', fontSize: '14px' },
  link: { color: '#6366f1', textDecoration: 'none', fontWeight: '700' }
};

export default Register;