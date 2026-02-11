-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.13.0.7147
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for user
CREATE DATABASE IF NOT EXISTS `user` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `user`;

-- Dumping structure for table user.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `category_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table user.categories: ~7 rows (approximately)
INSERT INTO `categories` (`category_id`, `category_name`) VALUES
	(1, 'อาหารแห้ง/เครื่องปรุง'),
	(2, 'อาหารสด/แช่แข็ง'),
	(3, 'ผลิตภัณฑ์นม/ไข่'),
	(4, 'เครื่องดื่ม/ขนม'),
	(5, 'ยา/เวชภัณฑ์'),
	(6, 'ของใช้ส่วนตัว/เครื่องสำอาง'),
	(7, 'สัตว์เลี้ยง');

-- Dumping structure for table user.notification_setting
CREATE TABLE IF NOT EXISTS `notification_setting` (
  `setting_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL DEFAULT 0,
  `days_before_expire` int(3) NOT NULL DEFAULT 0,
  `notify_email` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `unique_user_day` (`user_id`,`days_before_expire`),
  CONSTRAINT `FK_notification_setting_userdata` FOREIGN KEY (`user_id`) REFERENCES `userdata` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table user.notification_setting: ~0 rows (approximately)
INSERT INTO `notification_setting` (`setting_id`, `user_id`, `days_before_expire`, `notify_email`) VALUES
	(1, 6, 7, 0);

-- Dumping structure for table user.notifications_log
CREATE TABLE IF NOT EXISTS `notifications_log` (
  `log_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned NOT NULL,
  `product_id` int(11) unsigned NOT NULL,
  `notify_date` date DEFAULT curdate(),
  `type` tinyint(1) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`log_id`),
  KEY `FK_notifications_log_userdata` (`user_id`),
  KEY `FK_notifications_log_products` (`product_id`),
  CONSTRAINT `FK_notifications_log_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_notifications_log_userdata` FOREIGN KEY (`user_id`) REFERENCES `userdata` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table user.notifications_log: ~2 rows (approximately)
INSERT INTO `notifications_log` (`log_id`, `user_id`, `product_id`, `notify_date`, `type`, `message`, `created_at`) VALUES
	(1, 6, 4, '2026-02-11', 7, 'สินค้า นม เหลือ 7 วัน', '2026-02-10 20:27:07'),
	(2, 6, 4, '2026-02-11', 3, 'สินค้า นม เหลือ 3 วัน', '2026-02-10 20:27:07'),
	(3, 6, 4, '2026-02-11', 1, 'สินค้า นม เหลือ 1 วัน', '2026-02-10 20:27:07');

-- Dumping structure for table user.otp
CREATE TABLE IF NOT EXISTS `otp` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `expired` datetime NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  `otp_code` char(6) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `FK_otp_userdata` (`email`),
  CONSTRAINT `FK_otp_userdata` FOREIGN KEY (`email`) REFERENCES `userdata` (`email`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table user.otp: ~13 rows (approximately)
INSERT INTO `otp` (`id`, `expired`, `status`, `otp_code`, `email`, `created_at`) VALUES
	(1, '0000-00-00 00:00:00', 0, '447709', 'test123@gmail.com', '2026-02-08 21:12:34'),
	(2, '0000-00-00 00:00:00', 0, '996747', 'test123@gmail.com', '2026-02-08 21:12:38'),
	(3, '0000-00-00 00:00:00', 0, '455589', 'test123@gmail.com', '2026-02-08 21:12:39'),
	(4, '0000-00-00 00:00:00', 0, '332615', 'test123@gmail.com', '2026-02-08 21:12:45'),
	(5, '0000-00-00 00:00:00', 0, '805631', 'test123@gmail.com', '2026-02-08 21:13:09'),
	(6, '0000-00-00 00:00:00', 0, '160531', 'test123@gmail.com', '2026-02-08 21:13:16'),
	(7, '0000-00-00 00:00:00', 0, '937162', 'test123@gmail.com', '2026-02-08 21:19:22'),
	(8, '0000-00-00 00:00:00', 0, '316917', 'test123@gmail.com', '2026-02-08 21:28:40'),
	(9, '0000-00-00 00:00:00', 0, '507439', 'test123@gmail.com', '2026-02-08 21:29:38'),
	(10, '0000-00-00 00:00:00', 0, '998289', 'test123@gmail.com', '2026-02-08 21:31:02'),
	(11, '0000-00-00 00:00:00', 0, '473967', 'test123@gmail.com', '2026-02-08 21:31:36'),
	(12, '2026-02-08 22:26:34', 0, '195472', 'test123@gmail.com', '2026-02-08 22:21:34'),
	(14, '2026-02-10 00:24:26', 0, '756144', 'test123@gmail.com', '2026-02-10 00:19:26'),
	(15, '2026-02-11 04:13:38', 0, '411283', 'test123@gmail.com', '2026-02-11 04:08:38'),
	(16, '2026-02-11 04:21:38', 0, '107254', 'test123@gmail.com', '2026-02-11 04:16:38');

-- Dumping structure for table user.products
CREATE TABLE IF NOT EXISTS `products` (
  `product_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `category_id` int(11) unsigned NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `product_name` varchar(50) NOT NULL,
  `status` tinyint(1) DEFAULT 0 COMMENT '0:normal, 1:expirysoon, 2:expired',
  `mfg_date` date DEFAULT NULL,
  `exp_date` date DEFAULT NULL,
  `activate_date` date DEFAULT NULL,
  `exp_after_activate` int(3) DEFAULT NULL,
  `barcode` varchar(50) DEFAULT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_activated` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`product_id`) USING BTREE,
  KEY `FK_products_userdata` (`user_id`),
  KEY `FK_category` (`category_id`),
  CONSTRAINT `FK_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`),
  CONSTRAINT `FK_products_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_products_userdata` FOREIGN KEY (`user_id`) REFERENCES `userdata` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table user.products: ~3 rows (approximately)
INSERT INTO `products` (`product_id`, `user_id`, `category_id`, `image_path`, `product_name`, `status`, `mfg_date`, `exp_date`, `activate_date`, `exp_after_activate`, `barcode`, `create_at`, `is_activated`) VALUES
	(4, 6, 3, 'http://localhost:3000/uploads/6_1770571092765.png', 'นม', 2, '2026-02-01', '2026-02-11', '2026-02-08', 0, NULL, '2026-02-08 17:18:12', 0),
	(6, 6, 1, 'http://localhost:3000/uploads/6_1770572326593.jpg', 'มาม่า', 2, '2026-02-08', '2026-02-26', '2026-02-08', 0, NULL, '2026-02-08 17:38:46', 0),
	(16, 6, 5, 'http://localhost:3000/uploads/6_1770731842278.jpg', 'ยา', 1, '2026-02-01', '2026-02-21', '2026-02-10', 4, NULL, '2026-02-10 13:57:22', 1);

-- Dumping structure for table user.userdata
CREATE TABLE IF NOT EXISTS `userdata` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `status` enum('active','banned') DEFAULT 'active',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table user.userdata: ~4 rows (approximately)
INSERT INTO `userdata` (`id`, `username`, `email`, `password`, `role`, `status`) VALUES
	(1, '', 'admin1234@gmail.com', 'admin1234', 'admin', 'active'),
	(2, '', 'siriya@gmail.com', 'aa1234', 'user', 'banned'),
	(5, '', 'bb@gmail.com', 'bb123', 'user', 'active'),
	(6, 'wisarut_ks', 'test123@gmail.com', 'test123', 'user', 'active');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
