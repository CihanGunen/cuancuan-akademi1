import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Backend'deki 404 hatası düzelince burası çalışacak
    api.get(`/courses/${id}`)
      .then(res => setCourse(res.data))
      .catch(() => navigate('/dashboard'));
  }, [id, navigate]);

  if (!course) return <div style={{textAlign:'center', padding:'50px'}}>Yükleniyor...</div>;

  return (
    <div style={{padding:'40px', maxWidth:'800px', margin:'0 auto', fontFamily:'Inter'}}>
      <button onClick={() => navigate(-1)} style={{border:'none', background:'none', color:'#6366f1', cursor:'pointer', fontWeight:'bold', marginBottom:'20px'}}>← Panale Dön</button>
      
      <div style={{backgroundColor:'#6366f1', color:'white', padding:'40px', borderRadius:'32px', marginBottom:'30px', boxShadow: '0 20px 25px -5px rgba(99, 102, 241, 0.2)'}}>
        <h1 style={{margin:0, fontSize: '32px'}}>{course.title}</h1>
        <p style={{opacity:0.9, marginTop: '10px'}}>👨‍🏫 Eğitmen: {course.instructor?.name}</p>
        <div style={{marginTop: '20px', display: 'flex', gap: '10px'}}>
           <span style={{background:'rgba(255,255,255,0.2)', padding:'6px 15px', borderRadius:'50px', fontSize:'13px', fontWeight: '600'}}>👥 {course.students?.length} Kayıtlı Öğrenci</span>
        </div>
      </div>

      <div style={{backgroundColor:'white', padding:'40px', borderRadius:'32px', border:'1px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}}>
        <h2 style={{marginTop:0, color: '#1e293b'}}>Eğitim İçeriği</h2>
        <p style={{lineHeight:'1.8', color:'#475569', fontSize: '16px'}}>{course.description}</p>
        
        <div style={{marginTop:'40px', padding:'30px', backgroundColor:'#f8fafc', borderRadius:'20px', border:'2px dashed #e2e8f0', textAlign:'center'}}>
           <p style={{color: '#64748b', fontWeight: '600'}}>📺 Kurs videoları ve kaynak dosyalar çok yakında yüklenecektir!</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;