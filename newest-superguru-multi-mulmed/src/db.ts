import Database from 'better-sqlite3';

const db = new Database('swipeguru.db');
db.exec('PRAGMA foreign_keys = ON;');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT CHECK(role IN ('guru', 'murid', 'admin')) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS guru_profiles (
    user_id INTEGER PRIMARY KEY,
    bio TEXT,
    tarif INTEGER DEFAULT 0,
    session_duration INTEGER DEFAULT 60,
    kampus TEXT,
    gender TEXT,
    lokasi TEXT,
    avatar_url TEXT,
    ktp_url TEXT,
    ktm_url TEXT,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS murid_profiles (
    user_id INTEGER PRIMARY KEY,
    bio TEXT,
    avatar_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS mata_pelajaran (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama_mapel TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS guru_mapel (
    guru_id INTEGER,
    mapel_id INTEGER,
    PRIMARY KEY(guru_id, mapel_id),
    FOREIGN KEY(guru_id) REFERENCES guru_profiles(user_id) ON DELETE CASCADE,
    FOREIGN KEY(mapel_id) REFERENCES mata_pelajaran(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS swipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    swiper_id INTEGER NOT NULL,
    swiped_id INTEGER NOT NULL,
    direction TEXT CHECK(direction IN ('left', 'right')) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(swiper_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(swiped_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user1_id INTEGER NOT NULL,
    user2_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(user2_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    match_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(match_id) REFERENCES matches(id) ON DELETE CASCADE,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    murid_id INTEGER NOT NULL,
    guru_id INTEGER NOT NULL,
    match_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    session_count INTEGER DEFAULT 1,
    session_date DATETIME NOT NULL,
    status TEXT CHECK(status IN ('requested', 'unpaid', 'paid', 'completed', 'cancelled')) DEFAULT 'requested',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(murid_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(guru_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(match_id) REFERENCES matches(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_id INTEGER NOT NULL,
    reviewer_id INTEGER NOT NULL,
    reviewee_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'approved',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY(reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(reviewee_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    badge TEXT,
    instructor TEXT,
    price INTEGER DEFAULT 0,
    image_url TEXT,
    subject TEXT
  );

  CREATE TABLE IF NOT EXISTS course_lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER,
    type TEXT CHECK(type IN ('video', 'quiz')) NOT NULL,
    title TEXT NOT NULL,
    content_url TEXT,
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS course_quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL,
    explanation TEXT,
    FOREIGN KEY(lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_courses (
    user_id INTEGER,
    course_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, course_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    user_id INTEGER,
    lesson_id INTEGER,
    score INTEGER DEFAULT NULL,
    total_questions INTEGER DEFAULT NULL,
    completed TEXT CHECK(completed IN ('true', 'false')) DEFAULT 'true',
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, lesson_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS openplay_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guru_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT,
    session_date DATETIME NOT NULL,
    cost INTEGER NOT NULL,
    capacity INTEGER NOT NULL,
    lokasi TEXT DEFAULT 'Jakarta',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(guru_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS openplay_participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id INTEGER NOT NULL,
    murid_id INTEGER NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(session_id) REFERENCES openplay_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY(murid_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(session_id, murid_id)
  );
`);

try {
  db.exec("ALTER TABLE users ADD COLUMN saldo_koin INTEGER DEFAULT 150000;");
} catch (e) {
  // Column already exists, ignore
}

try {
  db.exec("ALTER TABLE openplay_sessions ADD COLUMN lokasi TEXT DEFAULT 'Jakarta';");
} catch (e) {
  // Column already exists, ignore
}

// Seed Data
const seedData = () => {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) return;

  // Insert Admin
  db.prepare('INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)').run(
    'admin@swipeguru.com', 'admin123', 'Super Admin', 'admin'
  );

  // Insert Mapel
  const mapels = ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Ekonomi'];
  mapels.forEach(m => db.prepare('INSERT INTO mata_pelajaran (nama_mapel) VALUES (?)').run(m));

  // Insert Gurus (Tutors)
  const tutors = [
    { name: 'Budi Santoso', email: 'budi@ui.ac.id', bio: 'Mahasiswa Teknik UI, hobi ngajar MTK.', tarif: 150000, kampus: 'UI', avatar: 'https://i.pravatar.cc/150?u=budi', gender: 'Laki-laki', lokasi: 'Jakarta' },
    { name: 'Siti Aminah', email: 'siti@itb.ac.id', bio: 'Expert Fisika & Kimia, santai tapi masuk.', tarif: 125000, kampus: 'ITB', avatar: 'https://i.pravatar.cc/150?u=siti', gender: 'Perempuan', lokasi: 'Bandung' },
    { name: 'Andi Wijaya', email: 'andi@ugm.ac.id', bio: 'Bahasa Inggris seru bareng debat champion.', tarif: 100000, kampus: 'UGM', avatar: 'https://i.pravatar.cc/150?u=andi', gender: 'Laki-laki', lokasi: 'Yogyakarta' },
    { name: 'Rina Kartika', email: 'rina@unpad.ac.id', bio: 'Biologi asik lewat visualisasi.', tarif: 110000, kampus: 'UNPAD', avatar: 'https://i.pravatar.cc/150?u=rina', gender: 'Perempuan', lokasi: 'Bandung' },
  ];

  tutors.forEach(t => {
    const res = db.prepare('INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)').run(
      t.email, 'password123', t.name, 'guru'
    );
    db.prepare('INSERT INTO guru_profiles (user_id, bio, tarif, kampus, avatar_url, gender, lokasi, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run(
      res.lastInsertRowid, t.bio, t.tarif, t.kampus, t.avatar, t.gender, t.lokasi, 'approved'
    );
    // Assign mapel
    db.prepare('INSERT INTO guru_mapel (guru_id, mapel_id) VALUES (?, ?)').run(res.lastInsertRowid, (Number(res.lastInsertRowid) % 6) + 1);
  });

  // Insert Murid
  const muridRes = db.prepare('INSERT INTO users (email, password, full_name, role) VALUES (?, ?, ?, ?)').run(
    'murid@gmail.com', 'murid123', 'Abyan Murid', 'murid'
  );
  db.prepare('INSERT INTO murid_profiles (user_id, bio, avatar_url) VALUES (?, ?, ?)').run(
    muridRes.lastInsertRowid, 'Siswa SMA butuh tutor sabar.', 'https://i.pravatar.cc/150?u=abyan'
  );

  // Seed OpenPlay Sessions
  const openplayCount = db.prepare('SELECT COUNT(*) as count FROM openplay_sessions').get() as { count: number };
  if (openplayCount.count === 0) {
    const gurus = db.prepare("SELECT id, full_name FROM users WHERE role = 'guru'").all() as { id: number, full_name: string }[];
    if (gurus.length > 0) {
      const todayStr = new Date().toISOString().split('T')[0] + ' 19:00:00';
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0] + ' 15:00:00';
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 3);
      const nextWeekStr = nextWeek.toISOString().split('T')[0] + ' 13:00:00';

      // Today's session
      db.prepare(`
        INSERT INTO openplay_sessions (guru_id, title, subject, description, session_date, cost, capacity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        gurus[0].id,
        "Group Study Matematika Dasar: Persiapan Ujian Akhir",
        "Matematika",
        "Belajar bareng konsep Aljabar dan Geometri dasar biar lancar di ujian akhir semester. Sesi tanya jawab interaktif!",
        todayStr,
        30000,
        5
      );

      // Tomorrow's session
      if (gurus.length > 1) {
        db.prepare(`
          INSERT INTO openplay_sessions (guru_id, title, subject, description, session_date, cost, capacity)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          gurus[1].id,
          "Kupas Tuntas Praktikum Fisika: Optika & Lensa",
          "Fisika",
          "Jangan bingung rumus lensa cembung dan cekung! Di sesi ini kita akan bahas tuntas trik gambar diagram pembentukan bayangan.",
          tomorrowStr,
          40000,
          8
        );
      }

      // Next session
      if (gurus.length > 2) {
        db.prepare(`
          INSERT INTO openplay_sessions (guru_id, title, subject, description, session_date, cost, capacity)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          gurus[2].id,
          "Percakapan Bahasa Inggris: TOEFL Speaking Practice",
          "Bahasa Inggris",
          "Yuk latih kelancaran bicaramu (fluency & pronunciation) untuk TOEFL Speaking section bersama teman-teman seperjuangan.",
          nextWeekStr,
          50000,
          4
        );
      }
    }
  }
};

const seedCourseData = () => {
  const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number };
  const lessonCount = db.prepare("SELECT COUNT(*) as count FROM course_lessons WHERE content_url = 'LX9-CgAJLtM'").get() as { count: number };
  if (courseCount.count > 0 && lessonCount.count > 0) return;

  // Clean slate of CourseGuru tables prior to fresh seeding
  db.prepare('DELETE FROM course_quizzes').run();
  db.prepare('DELETE FROM course_lessons').run();
  db.prepare('DELETE FROM courses').run();

  // 1. Matematika
  const mathRes = db.prepare(`
    INSERT INTO courses (title, description, badge, instructor, price, image_url, subject)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Matematika Kelas 6 SD: Bangun Ruang & Volume',
    'Kuasai konsep bangun ruang kelas 6 SD secara menyeluruh! Mulai dari Kubus, Balok, Prisma, hingga Tabung dan Kerucut. Dilengkapi visual interaktif dan pembahasan kuis yang mudah dicerna.',
    'Matematika',
    'Siti Aminah, S.Pd.',
    45000,
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=700',
    'Matematika'
  );
  const mathId = mathRes.lastInsertRowid;

  // Math Lessons
  const ml1 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    mathId, 'video', 'Cara Menghitung Volume Bangun Ruang Campuran (Kubus & Balok)', 'LX9-CgAJLtM', 1
  ).lastInsertRowid;
  
  const ml2 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    mathId, 'video', 'Rumus Cepat Luas Permukaan Tabung, Kerucut, & Bola kelas 6', 'ptpA6eWRx4k', 2
  ).lastInsertRowid;

  const ml3 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    mathId, 'quiz', 'Latihan Soal & Tes Pemahaman Bangun Ruang SD Kelas 6', 'Kuis interaktif pilihan ganda dengan pembahasan langsung.', 3
  ).lastInsertRowid;

  // Math Quizzes
  const mathQuizStmt = db.prepare(`
    INSERT INTO course_quizzes (lesson_id, question, option_a, option_b, option_c, option_d, correct_option, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  mathQuizStmt.run(
    ml3,
    'Sebuah kubus memiliki panjang sisi/rusuk 6 cm. Berapakah volume kubus tersebut?',
    '36 cm³',
    '124 cm³',
    '216 cm³',
    '256 cm³',
    'C',
    'Volume kubus dihitung dengan rumus V = s x s x s. Maka volume kubus = 6 x 6 x 6 = 216 cm³.'
  );
  mathQuizStmt.run(
    ml3,
    'Berapakah jumlah rusuk pada bangun ruang Limas Segiempat?',
    '4 buah',
    '6 buah',
    '8 buah',
    '12 buah',
    'C',
    'Limas segiempat memiliki alas berbentuk segiempat (4 rusuk) dan bagian selimut segitiga tegak (4 rusuk). Total rusuk = 4 + 4 = 8.'
  );
  mathQuizStmt.run(
    ml3,
    'Rumus manakah yang benar untuk menghitung volume Tabung (Silinder)?',
    'V = π x r² x t',
    'V = 2 x π x r x t',
    'V = 1/3 x π x r² x t',
    'V = π x r x s',
    'A',
    'Volume Tabung adalah luas alas (lingkaran = π x r²) dikali tinggi tabung. Maka V = π x r² x t.'
  );

  // 2. IPA
  const ipaRes = db.prepare(`
    INSERT INTO courses (title, description, badge, instructor, price, image_url, subject)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Sains IPA Kelas 6 SD: Menguak Misteri Tata Surya',
    'Menjelajahi keajaiban galaksi Bima Sakti khususnya sistem tata surya kita! Pelajari delapan planet, komet, asteroid, satelit, serta gerhana bulan dan bumi secara visual yang seru.',
    'Sains IPA',
    'Siti Aminah, S.Pd.',
    0, // Free Course!
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=700',
    'Sains IPA'
  );
  const ipaId = ipaRes.lastInsertRowid;

  // IPA Lessons
  const il1 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    ipaId, 'video', 'Petualangan Seru Keliling Tata Surya Kita - Animasi Pendidikan', 'wAr5DARC6rc', 1
  ).lastInsertRowid;

  const il2 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    ipaId, 'video', 'Mengenal Ciri Khas Unik Setiap Planet Dalam Tata Surya', 'EZBmHvdCNRY', 2
  ).lastInsertRowid;

  const il3 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    ipaId, 'quiz', 'Evaluasi Sains Kelas 6 SD: Sistem Tata Surya', 'Uji pemahamanmu tentang benda langit dan planet.', 3
  ).lastInsertRowid;

  // IPA Quizzes
  const ipaQuizStmt = db.prepare(`
    INSERT INTO course_quizzes (lesson_id, question, option_a, option_b, option_c, option_d, correct_option, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  ipaQuizStmt.run(
    il3,
    'Planet apakah yang dijuluki sebagai "Planet Merah" dalam tata surya kita?',
    'Merkurius',
    'Venus',
    'Bumi',
    'Mars',
    'D',
    'Mars sering dijuluki Planet Merah karena kandungan besi oksida (karat) yang melimpah di permukaannya, memberi rona kemerahan yang khas.'
  );
  ipaQuizStmt.run(
    il3,
    'Benda langit berbentuk bongkahan es, debu, dan batu yang mengorbit matahari dengan ekor gas panjang bercahaya disebut...',
    'Asteroid',
    'Komet',
    'Meteor',
    'Satelit Alami',
    'B',
    'Komet adalah benda langit es yang ketika mendekati matahari akan menguap dan membentuk ekor bercahaya panjang yang selalu menjauhi matahari.'
  );
  ipaQuizStmt.run(
    il3,
    'Manakah di bawah ini urutan planet-planet dalam yang paling dekat dengan matahari?',
    'Mars, Bumi, Venus, Jupiter',
    'Merkurius, Venus, Bumi, Mars',
    'Bumi, Mars, Jupiter, Saturnus',
    'Merkurius, Venus, Jupiter, Neptunus',
    'B',
    'Empat planet dalam (terestrial) yang paling dekat dengan matahari secara berurutan adalah Merkurius, Venus, Bumi, dan Mars.'
  );

  // 3. Bahasa Inggris
  const engRes = db.prepare(`
    INSERT INTO courses (title, description, badge, instructor, price, image_url, subject)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'Bahasa Inggris Kelas 6 SD: Daily Conversation & Fun Vocabulary',
    'Belajar bahasa Inggris kelas 6 SD dengan cara interaktif dan menyenangkan! Tingkatkan kosa kata seputar benda sekolah, hewan, hobi, serta percakapan sederhana sehari-hari gratis kuis evaluasi.',
    'Bahasa Inggris',
    'Andi Wijaya, M.Si.',
    60000,
    'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=700',
    'Bahasa Inggris'
  );
  const engId = engRes.lastInsertRowid;

  // Eng Lessons
  const el1 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    engId, 'video', 'Simple English Conversation for Kids to Learn at Home', 'by1QAoRcc-U', 1
  ).lastInsertRowid;

  const el2 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    engId, 'video', 'Common School Vocabulary & Classroom Objects in En', 'AS5nhKzaOqo', 2
  ).lastInsertRowid;

  const el3 = db.prepare('INSERT INTO course_lessons (course_id, type, title, content_url, order_index) VALUES (?, ?, ?, ?, ?)').run(
    engId, 'quiz', 'English Knowledge Test: Vocabularies & Basics', 'Test your grammar and vocabulary in interactive ways.', 3
  ).lastInsertRowid;

  // Eng Quizzes
  const engQuizStmt = db.prepare(`
    INSERT INTO course_quizzes (lesson_id, question, option_a, option_b, option_c, option_d, correct_option, explanation)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  engQuizStmt.run(
    el3,
    'Complete this sentence precisely: "Siti ... her homework right now."',
    'does',
    'did',
    'is doing',
    'done',
    'C',
    'Sinyal waktu "right now" menunjukkan Present Continuous Tense, sehingga to be "is" dipasang dengan verb-ing "doing".'
  );
  engQuizStmt.run(
    el3,
    'What is the English vocabulary for "Ruang Perpustakaan"?',
    'Library',
    'Laboratory',
    'Gymnasium',
    'Canteen',
    'A',
    '"Ruang Perpustakaan" dalam bahasa Inggris diterjemahkan sebagai "Library".'
  );
  engQuizStmt.run(
    el3,
    'Which of the following creatures lives primarily in the ocean / water?',
    'Giraffe',
    'Dolphin',
    'Elephant',
    'Monkey',
    'B',
    'Lumba-lumba ("Dolphin") adalah mamalia air yang tinggal di ekosistem lautan, berbeda dengan jerapah, gajah, dan monyet.'
  );

  console.log('Course App mock data seeded successfully!');
};

seedData();
seedCourseData();

export default db;
