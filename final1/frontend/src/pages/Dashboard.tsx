import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [view, setView] = useState<'all' | 'my'>('all');
  const [searchTerm, setSearchTerm] = useState(''); // Arama için
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDesc, setCourseDesc] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses');
      setCourses(response.data);
    } catch (error) { console.error("Hata:", error); }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) navigate('/login');
    else {
      setUser(JSON.parse(savedUser));
      fetchCourses();
    }
  }, [navigate]);

  const handleSaveCourse = async () => {
    if (!courseTitle || !courseDesc) return alert("Lütfen alanları doldurun.");
    try {
      if (editingId) {
        await api.put(`/courses/${editingId}`, { title: courseTitle, description: courseDesc });
      } else {
        await api.post('/courses', { title: courseTitle, description: courseDesc, instructorId: user.id });
      }
      setCourseTitle(''); setCourseDesc(''); setEditingId(null);
      fetchCourses();
    } catch (error) { alert('İşlem başarısız.'); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Bu eğitimi silmek istediğinize emin misiniz?")) {
      try { await api.delete(`/courses/${id}`); fetchCourses(); } catch (error) { alert('Silme hatası.'); }
    }
  };

  const handleEnroll = async (courseId: number) => {
    try { await api.post(`/courses/${courseId}/enroll`, { userId: user.id }); fetchCourses(); } catch (error) { alert('Hata!'); }
  };

  const handleUnenroll = async (courseId: number) => {
    try { await api.post(`/courses/${courseId}/unenroll`, { userId: user.id }); fetchCourses(); } catch (error) { alert('Hata!'); }
  };

  // Filtreleme ve Arama Mantığı
  const filtered = (view === 'all' ? courses : courses.filter(c => c.students?.some((s: any) => s.id === user?.id)))
    .filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!user) return <div style={styles.loading}>CuanCuan Akademi Yükleniyor...</div>;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <h1 style={styles.logo}>CuanCuan <span style={{color: '#6366f1'}}>Akademi</span></h1>
            <p style={styles.welcome}>Hoş geldin, <b>{user.name}</b></p>
          </div>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={styles.logoutBtn}>Güvenli Çıkış</button>
        </header>

        {user.role === 'admin' && (
          <div style={styles.adminCard}>
            <h2 style={styles.cardHeader}>{editingId ? '✏️ Eğitimi Düzenle' : '➕ Yeni Eğitim Tasarla'}</h2>
            <input placeholder="Eğitim Başlığı" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} style={styles.input} />
            <textarea placeholder="Eğitim İçeriği" value={courseDesc} onChange={e => setCourseDesc(e.target.value)} style={styles.textarea} />
            <div style={{display:'flex', gap:'10px'}}>
               <button onClick={handleSaveCourse} style={styles.primaryBtn}>{editingId ? 'Kaydet' : 'Yayına Al'}</button>
               {editingId && <button onClick={() => {setEditingId(null); setCourseTitle(''); setCourseDesc('');}} style={styles.cancelBtn}>Vazgeç</button>}
            </div>
          </div>
        )}

        <div style={styles.controls}>
          <div style={styles.tabWrapper}>
            <button onClick={() => setView('all')} style={{...styles.tabBtn, ...(view === 'all' ? styles.activeTabAll : {})}}>🌟 Keşfet</button>
            {user.role === 'student' && <button onClick={() => setView('my')} style={{...styles.tabBtn, ...(view === 'my' ? styles.activeTabMy : {})}}>📚 Kurslarım</button>}
          </div>
          <input 
            type="text" 
            placeholder="Eğitim ara..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            style={styles.searchInput} 
          />
        </div>

        <div style={styles.courseGrid}>
          {filtered.map(course => {
            const isEnrolled = course.students?.some((s: any) => s.id === user.id);
            const isMyCourse = course.instructor?.id === user.id;

            return (
              <div key={course.id} style={styles.courseCard}>
                <div style={styles.cardHeaderRow}>
                  <span style={styles.instructorTag}>👨‍🏫 {course.instructor?.name}</span>
                  {isEnrolled && <span style={styles.enrolledBadge}>Kayıtlı</span>}
                </div>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseDesc}>{course.description.substring(0, 80)}...</p>
                
                <div style={styles.actionArea}>
                  <button onClick={() => navigate(`/course/${course.id}`)} style={styles.detailBtn}>İçeriği Gör</button>
                  {user.role === 'student' && (
                    !isEnrolled ? (
                      <button onClick={() => handleEnroll(course.id)} style={styles.enrollBtn}>Kayıt Ol</button>
                    ) : (
                      <button onClick={() => handleUnenroll(course.id)} style={styles.unenrollBtn}>Ayrıl</button>
                    )
                  )}
                  {isMyCourse && (
                    <div style={{display:'flex', gap:'5px', marginTop:'10px'}}>
                      <button onClick={() => {setEditingId(course.id); setCourseTitle(course.title); setCourseDesc(course.description); window.scrollTo(0,0);}} style={styles.editBtn}>Düzenle</button>
                      <button onClick={() => handleDelete(course.id)} style={styles.deleteBtn}>Sil</button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const styles: any = {
  page: { minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "'Inter', sans-serif", paddingBottom:'50px' },
  container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  logo: { margin: 0, fontSize: '28px', fontWeight: '900', color: '#1e293b' },
  welcome: { margin: 0, color: '#64748b' },
  logoutBtn: { backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' },
  adminCard: { backgroundColor: '#fff', padding: '30px', borderRadius: '24px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', marginBottom: '30px', border:'1px solid #e2e8f0' },
  input: { width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', marginBottom: '10px', outline: 'none' },
  textarea: { width: '100%', padding: '12px', borderRadius: '12px', border: '1.5px solid #e2e8f0', marginBottom: '10px', minHeight: '80px' },
  primaryBtn: { flex: 2, padding: '12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' },
  cancelBtn: { flex: 1, backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', cursor: 'pointer' },
  controls: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' },
  tabWrapper: { display: 'flex', gap: '10px' },
  tabBtn: { padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '700', backgroundColor: '#e2e8f0', color: '#64748b' },
  activeTabAll: { backgroundColor: '#6366f1', color: 'white' },
  activeTabMy: { backgroundColor: '#10b981', color: 'white' },
  searchInput: { padding: '10px 20px', borderRadius: '12px', border: '1.5px solid #e2e8f0', outline: 'none', minWidth: '250px' },
  courseGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  courseCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column' },
  cardHeaderRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' },
  instructorTag: { fontSize: '11px', fontWeight: '700', color: '#64748b', backgroundColor: '#f8fafc', padding: '4px 10px', borderRadius: '8px' },
  enrolledBadge: { fontSize: '10px', fontWeight: '800', color: '#166534', backgroundColor: '#dcfce7', padding: '4px 10px', borderRadius: '8px' },
  courseTitle: { fontSize: '18px', color: '#1e293b', margin: '0 0 10px 0', fontWeight: '800' },
  courseDesc: { fontSize: '13px', color: '#475569', lineHeight: '1.6', flexGrow: 1, marginBottom: '20px' },
  detailBtn: { width: '100%', padding: '10px', borderRadius: '10px', border: '1.5px solid #6366f1', backgroundColor: '#fff', color: '#6366f1', fontWeight: '700', cursor: 'pointer', marginBottom: '8px' },
  enrollBtn: { width: '100%', padding: '10px', borderRadius: '10px', border: 'none', backgroundColor: '#6366f1', color: '#fff', fontWeight: '700', cursor: 'pointer' },
  unenrollBtn: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #ef4444', backgroundColor: '#fff', color: '#ef4444', fontWeight: '700', cursor: 'pointer' },
  editBtn: { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', color: '#6366f1', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  deleteBtn: { flex: 1, padding: '8px', borderRadius: '8px', border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  loading: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '20px', fontWeight: '800', color: '#6366f1' }
};

export default Dashboard;