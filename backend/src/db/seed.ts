import { db } from './index.js';
import { questions, tryoutPackages } from './schema/index.js';
import { config } from 'dotenv';

// Load environment variables
config();

const sampleQuestions = [
  {
    question_text: "Jika x + 2y = 10 dan 2x - y = 5, maka nilai x + y adalah...",
    options: [
      { id: "A", text: "5" },
      { id: "B", text: "6" },
      { id: "C", text: "7" },
      { id: "D", text: "8" },
      { id: "E", text: "9" }
    ],
    correct_answer: "C",
    explanation: "Dari sistem persamaan: x + 2y = 10 dan 2x - y = 5. Eliminasi y: x + 2y = 10, 4x - 2y = 10. Jumlahkan: 5x = 20, x = 4. Substitusi: 4 + 2y = 10, y = 3. Jadi x + y = 7.",
    subject: "matematika",
    sub_topic: "sistem_persamaan_linear",
    difficulty_level: "sedang",
    order_index: 1
  },
  {
    question_text: "Bacalah teks berikut!\n\nPerkembangan teknologi digital telah mengubah cara manusia berkomunikasi. Media sosial menjadi platform utama untuk berinteraksi, berbagi informasi, dan membangun relasi. Namun, penggunaan media sosial yang berlebihan dapat menimbulkan dampak negatif seperti kecanduan, cyberbullying, dan penyebaran informasi palsu.\n\nIde pokok paragraf tersebut adalah...",
    options: [
      { id: "A", text: "Teknologi digital mengubah komunikasi manusia" },
      { id: "B", text: "Media sosial memiliki dampak positif dan negatif" },
      { id: "C", text: "Perkembangan teknologi digital dan pengaruhnya terhadap komunikasi" },
      { id: "D", text: "Dampak negatif penggunaan media sosial" },
      { id: "E", text: "Media sosial sebagai platform komunikasi utama" }
    ],
    correct_answer: "C",
    explanation: "Ide pokok paragraf adalah perkembangan teknologi digital dan pengaruhnya terhadap komunikasi, yang mencakup baik aspek positif (platform komunikasi) maupun negatif (dampak buruk).",
    subject: "bahasa_indonesia",
    sub_topic: "pemahaman_bacaan",
    difficulty_level: "sedang",
    order_index: 2
  },
  {
    question_text: "Perhatikan gambar berikut!\n\n[Gambar menunjukkan grafik fungsi kuadrat yang membuka ke atas dengan titik puncak di (2, -4)]\n\nFungsi kuadrat yang sesuai dengan grafik tersebut adalah...",
    options: [
      { id: "A", text: "f(x) = x² - 4x" },
      { id: "B", text: "f(x) = x² - 4x + 4" },
      { id: "C", text: "f(x) = x² - 4x - 4" },
      { id: "D", text: "f(x) = (x - 2)² - 4" },
      { id: "E", text: "f(x) = (x + 2)² - 4" }
    ],
    correct_answer: "D",
    explanation: "Dari grafik terlihat titik puncak di (2, -4). Bentuk vertex dari fungsi kuadrat adalah f(x) = a(x - h)² + k dengan (h, k) adalah titik puncak. Karena grafik membuka ke atas, a = 1. Jadi f(x) = (x - 2)² - 4.",
    subject: "matematika",
    sub_topic: "fungsi_kuadrat",
    difficulty_level: "sulit",
    order_index: 3
  },
  {
    question_text: "Dalam sebuah penelitian, ditemukan bahwa 80% siswa yang rajin belajar mendapat nilai baik. Jika dari 100 siswa yang rajin belajar, berapa siswa yang diperkirakan mendapat nilai baik?",
    options: [
      { id: "A", text: "70 siswa" },
      { id: "B", text: "75 siswa" },
      { id: "C", text: "80 siswa" },
      { id: "D", text: "85 siswa" },
      { id: "E", text: "90 siswa" }
    ],
    correct_answer: "C",
    explanation: "80% dari 100 siswa = 80/100 × 100 = 80 siswa.",
    subject: "matematika",
    sub_topic: "persentase",
    difficulty_level: "mudah",
    order_index: 4
  },
  {
    question_text: "Kalimat berikut yang menggunakan kata baku adalah...",
    options: [
      { id: "A", text: "Dia sudah mengkonfirmasi kehadirannya" },
      { id: "B", text: "Dia sudah mengkonfirmasikan kehadirannya" },
      { id: "C", text: "Dia sudah konfirmasi kehadirannya" },
      { id: "D", text: "Dia sudah mengonfirmasi kehadirannya" },
      { id: "E", text: "Dia sudah konfirmasikan kehadirannya" }
    ],
    correct_answer: "D",
    explanation: "Kata baku yang benar adalah 'mengonfirmasi' bukan 'mengkonfirmasi'. Awalan 'meng-' + 'konfirmasi' = 'mengonfirmasi'.",
    subject: "bahasa_indonesia",
    sub_topic: "kata_baku",
    difficulty_level: "mudah",
    order_index: 5
  },
  {
    question_text: "Jika log 2 = 0,301 dan log 3 = 0,477, maka nilai log 12 adalah...",
    options: [
      { id: "A", text: "1,079" },
      { id: "B", text: "1,176" },
      { id: "C", text: "1,204" },
      { id: "D", text: "1,255" },
      { id: "E", text: "1,301" }
    ],
    correct_answer: "A",
    explanation: "log 12 = log (4 × 3) = log 4 + log 3 = log 2² + log 3 = 2 log 2 + log 3 = 2(0,301) + 0,477 = 0,602 + 0,477 = 1,079.",
    subject: "matematika",
    sub_topic: "logaritma",
    difficulty_level: "sulit",
    order_index: 6
  },
  {
    question_text: "Bacalah kutipan teks berikut!\n\n'Pendidikan karakter merupakan upaya yang dilakukan secara sengaja untuk mengembangkan karakter yang baik berdasarkan kebajikan-kebajikan inti yang secara objektif baik bagi individu maupun masyarakat.'\n\nMakna kata 'objektif' dalam kutipan tersebut adalah...",
    options: [
      { id: "A", text: "Berdasarkan pendapat pribadi" },
      { id: "B", text: "Berdasarkan fakta yang ada" },
      { id: "C", text: "Berdasarkan pengalaman" },
      { id: "D", text: "Berdasarkan teori" },
      { id: "E", text: "Berdasarkan asumsi" }
    ],
    correct_answer: "B",
    explanation: "Kata 'objektif' berarti berdasarkan fakta yang ada, tidak dipengaruhi oleh perasaan atau pendapat pribadi.",
    subject: "bahasa_indonesia",
    sub_topic: "makna_kata",
    difficulty_level: "sedang",
    order_index: 7
  },
  {
    question_text: "Sebuah kotak berisi 5 bola merah, 3 bola biru, dan 2 bola hijau. Jika diambil satu bola secara acak, peluang terambilnya bola yang bukan merah adalah...",
    options: [
      { id: "A", text: "1/2" },
      { id: "B", text: "3/5" },
      { id: "C", text: "2/5" },
      { id: "D", text: "1/5" },
      { id: "E", text: "3/10" }
    ],
    correct_answer: "A",
    explanation: "Total bola = 5 + 3 + 2 = 10. Bola bukan merah = 3 + 2 = 5. Peluang = 5/10 = 1/2.",
    subject: "matematika",
    sub_topic: "peluang",
    difficulty_level: "sedang",
    order_index: 8
  }
];

const samplePackages = [
  {
    title: "Tryout SNBT Paket 1 - Dasar",
    description: "Paket tryout untuk siswa yang baru memulai persiapan SNBT. Berisi soal-soal dengan tingkat kesulitan dasar hingga menengah.",
    package_type: "utbk_snbt",
    category: "campuran",
    difficulty_level: "mudah",
    total_questions: 8,
    duration_minutes: 180, // 3 hours in minutes
    price: 0, // Free package
    is_active: true,
    is_premium: false
  },
  {
    title: "Tryout SNBT Paket 2 - Menengah",
    description: "Paket tryout untuk siswa yang sudah memiliki dasar yang kuat. Berisi soal-soal dengan tingkat kesulitan menengah hingga sulit.",
    package_type: "utbk_snbt",
    category: "campuran",
    difficulty_level: "sedang",
    total_questions: 8,
    duration_minutes: 180,
    price: 25000, // 25k IDR
    is_active: true,
    is_premium: true
  },
  {
    title: "Tryout SNBT Paket 3 - Intensif",
    description: "Paket tryout untuk persiapan intensif SNBT. Berisi soal-soal dengan tingkat kesulitan tinggi yang menyerupai soal ujian sesungguhnya.",
    package_type: "utbk_snbt",
    category: "campuran",
    difficulty_level: "sulit",
    total_questions: 8,
    duration_minutes: 180,
    price: 50000, // 50k IDR
    is_active: true,
    is_premium: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🗑️ Clearing existing data...');
    await db.delete(questions);
    await db.delete(tryoutPackages);

    // Insert tryout packages first
    console.log('📦 Inserting tryout packages...');
    const insertedPackages = await db
      .insert(tryoutPackages)
      .values(samplePackages.map(pkg => ({
        ...pkg,
        created_at: new Date(),
        updated_at: new Date()
      })))
      .returning({ id: tryoutPackages.id, title: tryoutPackages.title });

    console.log(`✅ Inserted ${insertedPackages.length} tryout packages`);

    // Insert questions and assign them to packages
    console.log('❓ Inserting questions...');
    const questionsWithPackages = sampleQuestions.map((question, index) => {
      // Distribute questions across packages
      const packageIndex = index % insertedPackages.length;
      return {
        ...question,
        tryout_package_id: insertedPackages[packageIndex].id,
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    const insertedQuestions = await db
      .insert(questions)
      .values(questionsWithPackages)
      .returning({ id: questions.id, question_text: questions.question_text });

    console.log(`✅ Inserted ${insertedQuestions.length} questions`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Tryout Packages: ${insertedPackages.length}`);
    console.log(`   - Questions: ${insertedQuestions.length}`);
    
    insertedPackages.forEach((pkg, index) => {
      const questionCount = questionsWithPackages.filter(q => q.tryout_package_id === pkg.id).length;
      console.log(`   - ${pkg.title}: ${questionCount} questions`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };