# ระบบเเจ้งเตือนวันหมดอายุผลิตภัณฑ์
# สมาชิกกลุ่ม
* 67021703 ณัฐพล ยศเผ่น รับผิดชอบ Frontend
* 67022153 รัชชานนท์ หวลคิด รับผิดชอบ Frontend
* 67022186 วิศรุต กองสี รับผิดชอบ Frontend เเละ Backend
* 67022300 สิทธินนท์ แสนนาม รับผิดชอบ Frontend
* 67022344 สิริญากรณ์ การสมมุติ รับผิดชอบ  Frontend เเละ Mockup

# ขั้นตอนการติดตั้ง
1.ขั้นตอนการดาวโหลด library ผ่าน npm
``` 
npm i

```
2.ขั้นตอนการ import ฐานข้อมูล 
    2.1 Dowload project.sql  
    2.2 เปิดโปรเเกรม Heidisql เข้า session User = root password = "" ก่อน  
    2.3 เเล้ว load project.sql เเล้วกด Execute (F9)  
    2.4 เข้าเมนู Manage user authentication and privileges  
    2.5 Add user account ดังนี้
``` 
Username : expiry
From host : localhost
Password: 1234
Repeat Password: 1234

```  

2.6 add object เลือก database user  
2.7 เข้า Heidisql ใหม่เเละเพิ่มsession ใหม่ด้วย user account ที่พึ่งเพิ่มเข้ามา (เลือก database เป็น user ทำหรือไม่ทำก็ได้)  
2.8 เข้าด้วย session ใหม่  
3.run website  

``` 
npm run dev

```
