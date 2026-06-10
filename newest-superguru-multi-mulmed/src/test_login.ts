import db from "./db";

try {
  console.log("Testing tables...");
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log("Existing tables:", tables);

  const email = "murid@gmail.com";
  const password = "murid123";

  console.log("Testing login query for email:", email);
  const user = db.prepare(`
    SELECT u.id, u.email, u.full_name, u.role, u.saldo_koin,
      COALESCE(gp.bio, mp.bio) as bio,
      gp.tarif, gp.session_duration, gp.kampus, gp.gender, gp.lokasi,
      gp.status,
      COALESCE(gp.avatar_url, mp.avatar_url) as avatar_url,
      (SELECT AVG(rating) FROM reviews WHERE reviewee_id = u.id AND status = 'approved') as avg_rating,
      (SELECT COUNT(*) FROM reviews WHERE reviewee_id = u.id AND status = 'approved') as review_count
    FROM users u 
    LEFT JOIN guru_profiles gp ON u.id = gp.user_id
    LEFT JOIN murid_profiles mp ON u.id = mp.user_id
    WHERE u.email = ? AND u.password = ?
  `).get(email, password);

  console.log("Query succeeded! Result:", user);
} catch (err: any) {
  console.error("DIAGNOSTIC ERROR RECEIVED:", err.message, err.stack);
}
