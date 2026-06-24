/* ============================================
   Our Memory — DATA LAYER (Model)
   แก้ข้อมูลทุกอย่างได้ที่นี่ไฟล์เดียว!
   ============================================ */

var MEMO_DATA = {

  // --- 💑 ข้อมูลคู่รัก ---
  couple: {
    name1: 'ชื่อคุณ',
    name2: 'ชื่อแฟน',
    startDate: '2020-09-25',        // YYYY-MM-DD
    startDateDisplay: '25 กันยายน 2020',
  },

  // --- 🔐 Lock Screen ---
  // รหัสผ่านถูกเก็บเป็น SHA-256 hash (ไม่เก็บรหัสตรง)
  // วิธีเปลี่ยน: echo -n "รหัสใหม่" | shasum -a 256 แล้วเอามาใส่ตรงนี้
  lockScreen: {
    passwordHash: '43c275037f34eb94c1e2bab001ab1c57536ec029b03de7b7e7a13e47088474d3', // "250963" (วันครบรอบ)
    hint: '',
  },

  // --- ⏳ Countdown — วันสำคัญ ---
  // target: 'anniversary' | { month: 1-12, day: 1-31 }
  specialDates: [
    { name: 'วันครบรอบครั้งต่อไป', icon: '💝', target: 'anniversary' },
    { name: 'วันวาเลนไทน์',         icon: '💌', target: { month: 2, day: 14 } },
    { name: 'วันเกิดแฟน',           icon: '🎂', target: { month: 11, day: 5 }, birthYear: 2002 },
  ],

  // --- 📅 Timeline — เหตุการณ์สำคัญ ---
  // img: null = ใช้ gradient placeholder อัตโนมัติ
  timeline: [
    { date: '25 กันยายน 2020',    icon: '💕', title: 'วันที่เราเริ่มคบกัน',        desc: 'จุดเริ่มต้นของเรื่องราวทั้งหมด...' },
    { date: '14 กุมภาพันธ์ 2021',  icon: '🌹', title: 'วาเลนไทน์แรกของเรา',        desc: 'วันแห่งความรักครั้งแรกที่ได้ใช้ด้วยกัน' },
    { date: '25 กันยายน 2021',    icon: '🎉', title: 'ครบรอบ 1 ปี',               desc: '365 วันที่ผ่านมาด้วยกัน รักมากขึ้นทุกวัน' },
    { date: '31 ธันวาคม 2021',     icon: '🎆', title: 'เคาท์ดาวน์ด้วยกันครั้งแรก',   desc: 'เริ่มต้นปีใหม่ไปพร้อม ๆ กัน' },
    { date: '14 กุมภาพันธ์ 2022',  icon: '💐', title: 'วาเลนไทน์ที่สอง',            desc: 'ความรักยังคงอบอุ่นเช่นเคย' },
    { date: '25 กันยายน 2022',    icon: '✨', title: 'ครบรอบ 2 ปี',               desc: 'สองปีที่สวยงามที่สุดในชีวิต' },
    { date: '14 กุมภาพันธ์ 2023',  icon: '🍫', title: 'วาเลนไทน์ปีที่สาม',          desc: 'ทุกวันยังพิเศษเหมือนวันแรก' },
    { date: '25 กันยายน 2023',    icon: '💎', title: 'ครบรอบ 3 ปี',               desc: 'รักเรามั่นคงดุจเพชร' },
  ],

  // --- 🗺️ Map — สถานที่สำคัญ ---
  mapLocations: [
    { lat: 13.7563, lng: 100.5018, name: 'สถานที่พบกันครั้งแรก 💕', color: '#ff6b9d' },
    { lat: 13.7460, lng: 100.5350, name: 'ร้านเดทแรก 🍝',             color: '#c44dff' },
    { lat: 13.7700, lng: 100.5100, name: 'ที่เที่ยวด้วยกันบ่อย ๆ 🌸',   color: '#ff9a56' },
  ],

  // --- 🖼️ Gallery — รูปคู่ ---
  // type: 'tall' | 'wide' | 'square'
  gallery: [
    { src: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&h=800&fit=crop', type: 'tall',   caption: '💕 รูปแรกที่ถ่ายด้วยกัน' },
    { src: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&h=400&fit=crop', type: 'wide',   caption: '🌅 ดูพระอาทิตย์ตกด้วยกัน' },
    { src: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&h=400&fit=crop', type: 'square', caption: '🍜 เดทมื้อพิเศษ' },
    { src: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop', type: 'square', caption: '🌸 เที่ยวด้วยกัน' },
    { src: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?w=800&h=400&fit=crop', type: 'wide',   caption: '🎉 ฉลองครบรอบ' },
    { src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=400&fit=crop', type: 'square', caption: '🎁 ของขวัญจากแฟน' },
    { src: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&h=800&fit=crop', type: 'tall',   caption: '❤️ กอดที่อบอุ่นที่สุด' },
    { src: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=400&fit=crop', type: 'square', caption: '🎂 วันเกิดอุ้ย' },
  ],

  // --- 📝 Bucket List — สิ่งที่อยากทำด้วยกัน ---
  bucketList: [
    '👩‍🚀 ดูดาวด้วยกันสักคืน',
    '✈️ ไปเที่ยวต่างประเทศด้วยกัน',
    '🍳 ทำอาหารเช้าให้กัน',
    '🎨 วาดรูปคู่กัน',
    '🏕️ ไปแคมป์ปิ้งด้วยกัน',
    '🐶 เลี้ยงหมา (หรือแมว) ด้วยกันสักตัว',
    '🎢 เล่นสวนสนุกด้วยกัน',
    '📖 อ่านหนังสือให้กันฟัง',
    '🧘 เรียนอะไรใหม่ ๆ ด้วยกัน',
    '💒 แต่งงานกัน',
  ],

};
