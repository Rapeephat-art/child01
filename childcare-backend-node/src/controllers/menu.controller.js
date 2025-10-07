// src/controllers/menu.controller.js
import { pool } from '../config/db.js';

/** GET /api/foods
 * คืนรายการอาหารพื้นฐานจากตาราง foods
 * - มีคอลัมน์ food_type จะส่งกลับด้วย (ถ้าไม่มีจะเป็น null)
 */
export async function listFoods(_req, res) {
  try {
    const [cols] = await pool.query(`SHOW COLUMNS FROM foods LIKE 'food_type'`);
    const hasType = cols?.length > 0;

    const sql = hasType
      ? `SELECT food_id, name, food_type FROM foods ORDER BY name`
      : `SELECT food_id, name, NULL AS food_type FROM foods ORDER BY name`;

    const [rows] = await pool.query(sql);
    return res.json(rows || []);
  } catch (e) {
    console.error('[menus.listFoods]', e);
    return res.status(500).json({ message: 'โหลดรายการอาหารไม่สำเร็จ' });
  }
}

/** GET /api/menus?year=YYYY&month=M หรือ ?date=YYYY-MM-DD
 * ดึงเมนูรายเดือน (รองรับ items/note)
 */
export async function listByMonth(req, res) {
  try {
    let { year, month, date } = req.query;

    let y = parseInt(year, 10);
    let m = parseInt(month, 10);

    // ถ้าไม่ครบ ลองจาก ?date หรือใช้วันนี้
    if (!(y > 0 && m >= 1 && m <= 12)) {
      const base = date ? new Date(date) : new Date();
      if (Number.isNaN(base.getTime())) {
        return res.status(422).json({ message: 'year & month required' });
      }
      y = base.getFullYear();
      m = base.getMonth() + 1; // 1-12
    }

    const [rows] = await pool.query(
      `SELECT 
         DATE_FORMAT(dm.menu_date, '%Y-%m-%d') AS menu_date,
         dm.food_id,
         f.name AS food_name,
         dm.items,
         dm.note
       FROM daily_menus dm
       LEFT JOIN foods f ON f.food_id = dm.food_id
       WHERE YEAR(dm.menu_date) = ? AND MONTH(dm.menu_date) = ?
       ORDER BY dm.menu_date`,
      [y, m]
    );

    const data = (rows || []).map(r => ({
      menu_date: r.menu_date,
      food_id  : r.food_id ?? null,
      food_name: r.food_name ?? null,
      items    : r.items ?? null,
      note     : r.note ?? null,
    }));

    return res.json(data);
  } catch (e) {
    console.error('[menus.listByMonth]', e);
    return res.status(500).json({ message: 'โหลดเมนูเดือนไม่สำเร็จ' });
  }
}

/** POST /api/menus
 * Body: { menu_date, food_id?, items?, note? }
 * - บังคับเฉพาะ menu_date
 * - ใช้กลยุทธ์ UPDATE ก่อน ถ้าไม่เจอแถวจึง INSERT (หลีกเลี่ยง VALUES())
 */
export async function upsertMenu(req, res) {
  try {
    const { menu_date, food_id = null, items, note } = req.body || {};
    if (!menu_date) {
      return res.status(422).json({ message: 'menu_date required' });
    }

    const teacherId = req.user?.type === 'teacher' ? req.user.id : null;

    // 1) UPDATE ถ้ามีอยู่แล้ว
    const [upd] = await pool.query(
      `UPDATE daily_menus
         SET food_id=?, items=?, note=?, teacher_id=?
       WHERE menu_date=?`,
      [food_id, items || null, note || null, teacherId, menu_date]
    );

    // 2) ถ้าไม่พบแถวเดิม → INSERT
    if (upd.affectedRows === 0) {
      await pool.query(
        `INSERT INTO daily_menus (menu_date, food_id, items, note, teacher_id)
         VALUES (?,?,?,?,?)`,
        [menu_date, food_id, items || null, note || null, teacherId]
      );
    }

    // ส่งข้อมูลวันนั้นกลับ
    const [[row]] = await pool.query(
      `SELECT DATE_FORMAT(dm.menu_date, '%Y-%m-%d') AS menu_date,
              dm.food_id, f.name AS food_name, dm.items, dm.note
         FROM daily_menus dm
         LEFT JOIN foods f ON f.food_id=dm.food_id
        WHERE dm.menu_date=? LIMIT 1`,
      [menu_date]
    );

    return res.json({
      ok: true,
      upsert: upd.affectedRows ? 'update' : 'insert',
      data: row
        ? {
            menu_date: row.menu_date,
            food_id  : row.food_id,
            food_name: row.food_name ?? null,
            items    : row.items ?? null,
            note     : row.note ?? null,
          }
        : null,
    });
  } catch (e) {
    console.error('[menus.upsertMenu]', e);
    return res.status(500).json({ message: 'บันทึกเมนูไม่สำเร็จ' });
  }
}

/** DELETE /api/menus/:date (YYYY-MM-DD) */
export async function removeMenu(req, res) {
  try {
    const dateStr = req.params.date;
    if (!dateStr) return res.status(422).json({ message: 'date required' });

    const [ret] = await pool.query(
      `DELETE FROM daily_menus WHERE menu_date=?`,
      [dateStr]
    );
    return res.json({ ok: true, deleted: ret?.affectedRows ?? 0 });
  } catch (e) {
    console.error('[menus.removeMenu]', e);
    return res.status(500).json({ message: 'ลบเมนูไม่สำเร็จ' });
  }
}
