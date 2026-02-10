const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const multer = require('multer');
const fs = require('fs');


const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'expiry',
    password: '1234',
    database: 'user',
});

const nodemailer = require('nodemailer');

const uploadsDir = path.join(__dirname, 'uploads'); 
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const userId = req.body.user_id || 'guest'; 
        const ext = path.extname(file.originalname); 
        cb(null, `${userId}_${Date.now()}${ext}`); 
    }
});

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/login')));
app.use(express.static(path.join(__dirname, '/home_contact')));
app.use(express.static(path.join(__dirname, '/setting')));
app.use(express.static(path.join(__dirname, '/main')));
app.use(express.static(path.join(__dirname, '/Admin')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: storage });
app.use(express.static(path.join(__dirname, 'public'))); // ให้บริการไฟล์ static (ถ้ามี)
app.use('/uploads', express.static(uploadsDir));



app.post('/api/register',(req,res) => {
    const {email,password} = req.body;
    const sql = "INSERT INTO userdata (email, password) VALUES (?,?)";

    pool.query(sql, [email, password],(err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message:"เกิดข้อผิดพลาด"});
        }
        res.json({success: true, message:"ลงทะเบียนสำเร็จ!"});
    });
});
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const sql = "SELECT id, email, role, status FROM userdata WHERE email = ? AND password = ?";
    
    pool.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดที่ฐานข้อมูล" });
        }
        
        if (results.length > 0) {
            const user = results[0];
            if (user.status === 'banned') {
                return res.json({ 
                    success: false, 
                    message: `บัญชีของคุณถูกระงับการใช้งาน!` 
                });
            }
            res.json({ 
                success: true, 
                role: results[0].role, 
                user_id: results[0].id,
                email: results[0].email 
            });
        } else {
            res.json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }
    });
});
app.post('/api/send-otp', (req, res) => {
    const { email } = req.body;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

   
    const expireTime = new Date(Date.now() + 5 * 60000); 

    const sql = "INSERT INTO otp (email, otp_code, status, expired) VALUES (?, ?, 'pending', ?)";
    pool.query(sql, [email, otpCode, expireTime], (err) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false, message: "บันทึกข้อมูลไม่สำเร็จ" });
        }
        console.log(`Email: ${email}, OTP: ${otpCode}, Expires at: ${expireTime}`);
        res.json({ success: true, message: "บันทึกรหัสลงฐานข้อมูลแล้ว" });
    });
});
app.post('/api/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const sql = `
        SELECT * FROM otp 
        WHERE email = ? 
        AND otp_code = ? 
        AND status = 'pending' 
        AND expired > NOW() 
        ORDER BY id DESC LIMIT 1
    `;
    
    pool.query(sql, [email, otp], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }
        
        if (results.length > 0) {
            pool.query("UPDATE otp SET status = 'used' WHERE id = ?", [results[0].id]);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: "รหัส OTP ไม่ถูกต้อง" });
        }
    });
});
app.post('/api/update-password', (req, res) => {
    const { email, newPassword } = req.body;

    const sql = "UPDATE userdata SET password = ? WHERE email = ?";
    
    pool.query(sql, [newPassword, email], (err, result) => {
        if (err) {
            console.error("Update Password Error:", err);
            return res.status(500).json({ success: false });
        }
        
        if (result.affectedRows > 0) {
            res.json({ success: true, message: "อัปเดตรหัสผ่านสำเร็จ" });
        } else {
            res.json({ success: false, message: "ไม่พบผู้ใช้งาน" });
        }
    });
});

app.post('/api/update-email', (req, res) => {
    const { oldEmail, newEmail } = req.body;

    const sql = "UPDATE userdata SET email=? WHERE email=?";

    pool.query(sql, [newEmail, oldEmail], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false });
        }

        if (result.affectedRows > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});
function calculateStatus(expDate, activateDate, expAfter) {
    let finalExpiry = new Date(expDate);

    // ถ้ามีการเปิดใช้งาน และกำหนดจำนวนวันหลังเปิดไว้
    if (activateDate && expAfter) {
        const openExpiry = new Date(activateDate);
        openExpiry.setDate(openExpiry.getDate() + parseInt(expAfter));
        
        // เลือกวันที่มาถึงก่อน (วันหมดอายุจริง หรือ วันหมดอายุหลังเปิดขวด)
        if (openExpiry < finalExpiry) {
            finalExpiry = openExpiry;
        }
    }

    finalExpiry.setHours(23, 59, 59, 999);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((finalExpiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return 2;      
    if (diffDays <= 7) return 1;      
    return 0;                         
}

app.post('/api/add-product', upload.single('product_image'), (req, res) => {
console.log("BODY =", req.body);
try {
    const { user_id, category_id, name, mfg, exp, activate, activate_exp } = req.body;
    
    // แปลงค่าให้เป็นตัวเลขที่ถูกต้อง
    const expAfterActivate = activate_exp ? parseInt(activate_exp) : null;
    const image_path = req.file ? `/uploads/${req.file.filename}` : null; 

    // คำนวณสถานะเริ่มต้น
    const status = calculateStatus(exp, activate, expAfterActivate);

    // บันทึกค่าลง DB ให้ตรงคอลัมน์ (รวมถึงรูปภาพที่ขาดไปในโค้ดเดิม)
    const sql = `INSERT INTO products 
      (user_id, category_id, product_name, status, mfg_date, exp_date, activate_date, exp_after_activate, image_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    pool.query(sql, [
        user_id, 
        category_id, 
        name, 
        status, 
        mfg || null, 
        exp || null, 
        activate || null, 
        expAfterActivate, 
        image_path
    ], (err) => {
        if (err) {
          console.log("INSERT ERROR:", err);
          return res.json({ success: false, message: "เพิ่มสินค้าไม่สำเร็จ" });
        }
        res.json({ success: true, message: "เพิ่มสินค้าสำเร็จ" });
      }
    );
  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.json({ success: false, message: "server error" });
  }
});




app.get('/api/get-products', (req, res) => {
    const updateSql = `
        UPDATE products 
        SET status = CASE 
            WHEN DATEDIFF(LEAST(exp_date, IFNULL(DATE_ADD(activate_date, INTERVAL exp_after_activate DAY), exp_date)), CURDATE()) < 0 THEN 2
            WHEN DATEDIFF(LEAST(exp_date, IFNULL(DATE_ADD(activate_date, INTERVAL exp_after_activate DAY), exp_date)), CURDATE()) <= 7 THEN 1
            ELSE 0 
        END`;
    pool.query(updateSql, (updateErr) => {
        if (updateErr) {
            console.error("Auto Update Error during Page Load:", updateErr);
        }

    const sql = `
        SELECT
            product_id as id,
            product_name as name,
            status,
            DATE_FORMAT(mfg_date, '%Y-%m-%d') as mfgDate,
            DATE_FORMAT(exp_date, '%Y-%m-%d') as expiryDate,
            DATE_FORMAT(activate_date, '%Y-%m-%d') as activateDate,
            exp_after_activate as expAfterActivate,
            is_activated = 1 as isActivated,
            image_path as Image,
            category_id as category
        FROM products`;
    
    pool.query(sql, (err, results) => {
        if (err) {
            console.error("Database Error:", err);
            return res.status(500).json({ success: false });
        }
        res.json(results); 
    });
    });
});
app.put('/api/update-product/:id', (req, res) => {
    const id = req.params.id;
    const { name, mfgDate, expiryDate, category, Image, activateDate, expAfterActivate, isActivated } = req.body;
    const status = calculateStatus(expiryDate, activateDate, expAfterActivate);

    const sql = `UPDATE products 
                SET product_name=?, 
                mfg_date=?, 
                exp_date=?, 
                category_id=?, 
                image_path=?, 
                status=?,
                activate_date=?,
                exp_after_activate=?,
                is_activated=?
                WHERE product_id=?
                `;

    const isActivatedValue = isActivated ? 1 : 0;

    pool.query(sql, [
        name,
        mfgDate,
        expiryDate,
        category,
        Image,
        status,
        activateDate,
        expAfterActivate,
        isActivatedValue,
        id
    ], (err) => {
        if (err) {
            console.error("Update Error:", err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});


app.delete('/api/delete-product/:id', (req, res) => {
    const id = req.params.id;

    pool.query("DELETE FROM products WHERE product_id=?", [id], (err) => {
        if (err) {
            console.error("Delete Error:", err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});
app.put('/api/update-user', (req, res) => {
    const { id, username } = req.body;

    const sql = "UPDATE userdata SET username=? WHERE id=?";

    pool.query(sql, [username, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});
app.get('/api/user/:email', (req, res) => {
    const email = req.params.email;

    pool.query(
        "SELECT email, password, username FROM userdata WHERE email=?",
        [email],
        (err, results) => {
            if (err) return res.status(500).json({ success: false });

            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.json({ success: false });
            }
        }
    );
});
app.post("/api/save-notification-setting", (req, res) => {
  const { user_id, days } = req.body;

  const checkSql = "SELECT * FROM notification_setting WHERE user_id = ?";

  pool.query(checkSql, [user_id], (err, result) => {
    if (err) return res.status(500).json({ success: false });

    if (result.length > 0) {
      pool.query(
        "UPDATE notification_setting SET days_before_expire=? WHERE user_id=?",
        [days, user_id],
        (err2) => {
          if (err2) return res.status(500).json({ success: false });
          res.json({ success: true });
        }
      );
    } else {
      pool.query(
        "INSERT INTO notification_setting(user_id, days_before_expire) VALUES (?,?)",
        [user_id, days],
        (err2) => {
          if (err2) return res.status(500).json({ success: false });
          res.json({ success: true });
        }
      );
    }
  });
});
app.get("/api/notification-setting/:user_id", (req, res) => {
  const userId = req.params.user_id;

  pool.query(
    "SELECT days_before_expire FROM notification_setting WHERE user_id=?",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ success: false });

      if (result.length > 0) {
        res.json({ days: result[0].days_before_expire });
      } else {
        res.json({ days: 7 }); // default
      }
    }
  );
});



app.post("/add-notification-log", (req, res) => {
  const { user_id, product_id, message, type } = req.body;

  const sql = `
    INSERT INTO notifications_log
    (user_id, product_id, message, type, notify_date, created_at)
    VALUES (?, ?, ?, ?, CURDATE(), NOW())
  `;

  pool.query(sql, [user_id, product_id, message, type], (err) => {
    if (err) {
      console.error("insert notification log error:", err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

app.get("/notification-log/:user_id", (req, res) => {
  const userId = req.params.user_id;

  const sql = `
    SELECT n.*, p.product_name
    FROM notifications_log n
    JOIN products p ON p.product_id = n.product_id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
  `;

  pool.query(sql, [userId], (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.json(result);
  });
});
app.delete("/notification-log/clear/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    DELETE FROM notifications_log
    WHERE user_id = ?
  `;

  pool.query(sql, [userId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "ลบไม่สำเร็จ" });
    }

    res.json({
      message: "ลบประวัติเรียบร้อย",
      deleted: result.affectedRows
    });
  });
});
app.get('/api/admin/users', (req, res) => {
    pool.query(
        "SELECT id, username, email, role, status FROM userdata",
        (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }
            res.json(results);
        }
    );
});
app.put('/api/admin/ban-user/:id', (req, res) => {
    const userId = req.params.id;

    pool.query(
        "UPDATE userdata SET status='banned' WHERE id=?",
        [userId],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true });
        }
    );
});
app.put('/api/admin/unban-user/:id', (req, res) => {
    const userId = req.params.id;

    pool.query(
        "UPDATE userdata SET status='active' WHERE id=?",
        [userId],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true });
        }
    );
});



app.get('/', (req,res) => {
    res.sendFile(__dirname + '/home_contact/home.html');
}) 

app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})