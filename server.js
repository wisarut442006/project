const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ storage: storage });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
    
    const sql = "SELECT id, email, role FROM userdata WHERE email = ? AND password = ?";
    
    pool.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดที่ฐานข้อมูล" });
        }
        
        if (results.length > 0) {
            res.json({ 
                success: true, 
                role: results[0].role, 
                user_id: results[0].id 
            });
        } else {
            res.json({ success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }
    });
});
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', 
        pass: 'your-app-password'    
    }
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

app.post('/api/add-product', upload.single('product_image'), (req, res) => {
    const { user_id, category_id, name, mfg, exp, activate } = req.body;
    
    const image_path = req.file ? `/uploads/${req.file.filename}` : null; 

    const sql = "INSERT INTO products (user_id, category_id, product_name, mfg_date, exp_date, activate_date, image_path) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    pool.query(sql, [user_id, category_id, name, mfg || null, exp, activate || null, image_path], (err, result) => {
        if (err) {
            console.error("Database Error:", err);
            if (req.file) {
                fs.unlinkSync(req.file.path); 
            }
            return res.status(500).json({ success: false, message: "บันทึกข้อมูลไม่สำเร็จ" });
        }
        res.json({ success: true, message: "บันทึกสินค้าพร้อมรูปภาพเรียบร้อย!" });
    });
});

app.get('/api/get-products', (req, res) => {
    const sql = `
    SELECT 
        product_id as id, 
        product_name as name, 
        DATE_FORMAT(mfg_date, '%Y-%m-%d') as mfgDate,
        DATE_FORMAT(exp_date, '%Y-%m-%d') as expiryDate,
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
app.put('/api/update-product/:id', (req, res) => {
    const id = req.params.id;
    const { name, mfgDate, expiryDate, category, Image } = req.body;


    const sql = `
    UPDATE products 
    SET product_name=?, mfg_date=?, exp_date=?, category_id=?, image_path=?
    WHERE product_id=?`;

    pool.query(sql, [name,mfgDate, expiryDate, category, Image, id], (err) => {
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


app.get('/', (req,res) => {
    res.sendFile(__dirname + '/home_contact/home.html');
}) 

app.listen(port, () =>[
    console.log(`server is running on http://localhost:${port}`)
])