-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for carechild_db
DROP DATABASE IF EXISTS `carechild_db`;
CREATE DATABASE IF NOT EXISTS `carechild_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `carechild_db`;

-- Dumping structure for table carechild_db.addresses
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `address_type` enum('ทะเบียนบ้าน','ที่อยู่ปัจจุบัน','ที่อยู่ผู้ปกครอง','ที่อยู่เด็ก','ที่อยู่ติดต่อ') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `house_no` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `village` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subdistrict` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `child_id` (`child_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `addresses_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.addresses: ~0 rows (approximately)
DELETE FROM `addresses`;

-- Dumping structure for table carechild_db.announcements
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE IF NOT EXISTS `announcements` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`announcement_id`),
  KEY `center_id` (`center_id`),
  CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.announcements: ~0 rows (approximately)
DELETE FROM `announcements`;

-- Dumping structure for table carechild_db.attendance
DROP TABLE IF EXISTS `attendance`;
CREATE TABLE IF NOT EXISTS `attendance` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('มา','ลา','ขาด') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attendance_id`),
  KEY `child_id` (`child_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.attendance: ~0 rows (approximately)
DELETE FROM `attendance`;

-- Dumping structure for table carechild_db.centers
DROP TABLE IF EXISTS `centers`;
CREATE TABLE IF NOT EXISTS `centers` (
  `center_id` int NOT NULL AUTO_INCREMENT,
  `school_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `district` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `LGO` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ORG_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.centers: ~1 rows (approximately)
DELETE FROM `centers`;
INSERT INTO `centers` (`center_id`, `school_id`, `name`, `district`, `province`, `phone`, `email`, `LGO`, `ORG_code`, `created_at`) VALUES
	(1, '3030615601', 'ศพด.ตำบลหนองน้ำแดง', 'ปากช่อง', 'นครราชสีมา', '044000360', NULL, 'อบต.หนองน้ำแดง', '06302109', '2025-12-20 03:39:03');

-- Dumping structure for table carechild_db.children
DROP TABLE IF EXISTS `children`;
CREATE TABLE IF NOT EXISTS `children` (
  `child_id` int NOT NULL AUTO_INCREMENT,
  `child_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `classroom_id` int DEFAULT NULL,
  `prefix` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nickname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `citizen_id` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ethnicity` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nationality` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `religion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `blood` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `treatment` text COLLATE utf8mb4_unicode_ci,
  `reimbursement` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vaccine` text COLLATE utf8mb4_unicode_ci,
  `eat` text COLLATE utf8mb4_unicode_ci,
  `needs` text COLLATE utf8mb4_unicode_ci,
  `enter_study` date DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `enrollment_id` int DEFAULT NULL,
  PRIMARY KEY (`child_id`),
  UNIQUE KEY `enrollment_id` (`enrollment_id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `children_ibfk_1` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroom_id`),
  CONSTRAINT `fk_children_enrollment` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollments` (`enrollment_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.children: ~0 rows (approximately)
DELETE FROM `children`;

-- Dumping structure for table carechild_db.child_food_allergies
DROP TABLE IF EXISTS `child_food_allergies`;
CREATE TABLE IF NOT EXISTS `child_food_allergies` (
  `allergy_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `food_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reaction` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `severity` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`allergy_id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `child_food_allergies_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.child_food_allergies: ~0 rows (approximately)
DELETE FROM `child_food_allergies`;

-- Dumping structure for table carechild_db.classrooms
DROP TABLE IF EXISTS `classrooms`;
CREATE TABLE IF NOT EXISTS `classrooms` (
  `classroom_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int NOT NULL,
  `teacher_id` int DEFAULT NULL,
  `classroom_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`classroom_id`),
  KEY `center_id` (`center_id`),
  CONSTRAINT `classrooms_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.classrooms: ~2 rows (approximately)
DELETE FROM `classrooms`;
INSERT INTO `classrooms` (`classroom_id`, `center_id`, `teacher_id`, `classroom_name`, `created_at`) VALUES
	(1, 1, 1, 'ห้องต่ำกว่า 3 ขวบ', '2025-12-20 03:46:30'),
	(2, 1, NULL, 'ห้อง 3 ขวบ', '2025-12-20 03:46:30');

-- Dumping structure for table carechild_db.daily_menu
DROP TABLE IF EXISTS `daily_menu`;
CREATE TABLE IF NOT EXISTS `daily_menu` (
  `daily_menu_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int DEFAULT NULL,
  `menu_date` date DEFAULT NULL,
  `main_menu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stir_menu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `soup_menu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fried_menu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dessert_menu` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`daily_menu_id`),
  KEY `center_id` (`center_id`),
  KEY `created_by` (`created_by`),
  KEY `updated_by` (`updated_by`),
  CONSTRAINT `daily_menu_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`),
  CONSTRAINT `daily_menu_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `teachers` (`teacher_id`),
  CONSTRAINT `daily_menu_ibfk_3` FOREIGN KEY (`updated_by`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.daily_menu: ~0 rows (approximately)
DELETE FROM `daily_menu`;

-- Dumping structure for table carechild_db.enrollments
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `enrollment_id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `center_id` int DEFAULT NULL,
  `status` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `parent_phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extra_json` json DEFAULT NULL,
  `files_json` json DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`enrollment_id`),
  KEY `parent_id` (`parent_id`),
  KEY `center_id` (`center_id`),
  CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `enrollments_ibfk_2` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.enrollments: ~2 rows (approximately)
DELETE FROM `enrollments`;
INSERT INTO `enrollments` (`enrollment_id`, `parent_id`, `center_id`, `status`, `note`, `parent_phone`, `extra_json`, `files_json`, `created_by`, `created_at`) VALUES
	(3, NULL, NULL, 'pending', NULL, NULL, '{"reg_moo": "2", "curr_moo": "2", "birth_date": "2022-10-10", "father_job": "รับจ้าง", "mother_job": "รับจ้าง", "reg_amphur": "ปากช่อง", "reg_tambon": "หนองน้ำแดง", "apply_level": "ต่ำกว่า 3 ปี", "curr_amphur": "ปากช่อง", "curr_tambon": "หนองน้ำแดง", "oral_health": "", "birth_height": "100", "birth_weight": "25", "father_phone": "0543127788", "mother_phone": "0543778325", "reg_house_no": "511", "reg_province": "นครราชสีมา", "sender_phone": "0543127788", "caregiver_job": "-", "curr_house_no": "511", "curr_province": "นครราชสีมา", "father_idcard": "316500064911", "father_income": "10000", "father_prefix": "", "mother_idcard": "451874661154", "mother_income": "10000", "mother_prefix": "", "sender_prefix": "", "father_reg_moo": "2", "mother_reg_moo": "2", "student_idcard": "152450009467", "student_prefix": "เด็กชาย", "caregiver_phone": "-", "father_curr_moo": "2", "father_lastname": "mamo", "mother_curr_moo": "2", "mother_lastname": "mamo", "sender_lastname": "mamo", "sender_relation": "บิดา", "care_responsible": "บิดาและมารดา", "caregiver_income": "-", "caregiver_prefix": "", "father_birthdate": "1990-10-15", "father_firstname": "roro", "mother_birthdate": "1993-10-08", "mother_firstname": "mama", "sender_firstname": "roro", "student_lastname": "mamo", "student_nickname": "ta", "father_reg_amphur": "ปากช่อง", "father_reg_tambon": "หนองน้ำแดง", "mother_reg_amphur": "ปากช่อง", "mother_reg_tambon": "หนองน้ำแดง", "student_firstname": "tata", "caregiver_lastname": "-", "father_curr_amphur": "ปากช่อง", "father_curr_tambon": "หนองน้ำแดง", "mother_curr_amphur": "ปากช่อง", "mother_curr_tambon": "หนองน้ำแดง", "caregiver_firstname": "-", "father_reg_house_no": "511", "father_reg_province": "นครราชสีมา", "mother_reg_house_no": "511", "mother_reg_province": "นครราชสีมา", "father_curr_house_no": "511", "father_curr_province": "นครราชสีมา", "mother_curr_house_no": "511", "mother_curr_province": "นครราชสีมา"}', '{"child_house_reg": "uploads\\\\enrollments\\\\1766227905332-2559.pdf", "father_house_reg": "uploads\\\\enrollments\\\\1766227905338-boonsri1,+Journal+manager,+71_à¸ªà¸¸à¸à¸£à¸£à¸©à¸² (1).pdf", "mother_house_reg": "uploads\\\\enrollments\\\\1766227905367-à¸ªà¸µà¸à¸²à¸§ à¸ªà¸µà¸à¸³ à¹à¸£à¸µà¸¢à¸à¸à¹à¸²à¸¢ à¸¡à¸´à¸à¸´à¸¡à¸­à¸¥ à¹à¸£à¸à¸¹à¹à¸¡à¹à¸ªà¸¡à¸±à¸à¸£à¸à¸²à¸ (2).pdf", "father_idcard_file": "uploads\\\\enrollments\\\\1766227905333-023-à¸à¸à¸à¸§à¸²à¸¡à¸§à¸´à¸à¸²à¸à¸²à¸£+(à¸ à¸²à¸¢à¹à¸)++à¸¥à¸ à¸±à¸ªà¸£à¸à¸²++à¸à¹à¸­à¸¢à¹à¸­à¸µà¹à¸¢à¸¡++à¸§à¸£à¸à¸¤à¸+à¹à¸à¸·à¹à¸­à¸à¸à¹à¸²à¸+à¹à¸¥à¹à¸¡+2++65 (3).pdf", "mother_idcard_file": "uploads\\\\enrollments\\\\1766227905356-boonsri1,+Journal+manager,+71_à¸ªà¸¸à¸à¸£à¸£à¸©à¸².pdf", "child_birth_certificate": "uploads\\\\enrollments\\\\1766227905317-023-à¸à¸à¸à¸§à¸²à¸¡à¸§à¸´à¸à¸²à¸à¸²à¸£+(à¸ à¸²à¸¢à¹à¸)++à¸¥à¸ à¸±à¸ªà¸£à¸à¸²++à¸à¹à¸­à¸¢à¹à¸­à¸µà¹à¸¢à¸¡++à¸§à¸£à¸à¸¤à¸+à¹à¸à¸·à¹à¸­à¸à¸à¹à¸²à¸+à¹à¸¥à¹à¸¡+2++65 (4).pdf"}', NULL, '2025-12-20 10:51:45');

-- Dumping structure for table carechild_db.evaluation_scores
DROP TABLE IF EXISTS `evaluation_scores`;
CREATE TABLE IF NOT EXISTS `evaluation_scores` (
  `score_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `score` tinyint DEFAULT NULL,
  PRIMARY KEY (`score_id`),
  KEY `session_id` (`session_id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `evaluation_scores_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `evaluation_sessions` (`session_id`),
  CONSTRAINT `evaluation_scores_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.evaluation_scores: ~0 rows (approximately)
DELETE FROM `evaluation_scores`;

-- Dumping structure for table carechild_db.evaluation_sessions
DROP TABLE IF EXISTS `evaluation_sessions`;
CREATE TABLE IF NOT EXISTS `evaluation_sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `evaluation_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.evaluation_sessions: ~0 rows (approximately)
DELETE FROM `evaluation_sessions`;

-- Dumping structure for table carechild_db.health_evaluations
DROP TABLE IF EXISTS `health_evaluations`;
CREATE TABLE IF NOT EXISTS `health_evaluations` (
  `health_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `evaluation_date` date DEFAULT NULL,
  `hair` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eye` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mouth` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tooth` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ear` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nose` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skin` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nail` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`health_id`),
  KEY `child_id` (`child_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `health_evaluations_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `health_evaluations_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.health_evaluations: ~0 rows (approximately)
DELETE FROM `health_evaluations`;

-- Dumping structure for table carechild_db.lunch_records
DROP TABLE IF EXISTS `lunch_records`;
CREATE TABLE IF NOT EXISTS `lunch_records` (
  `lunch_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('มา','ลา','ขาด') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`lunch_id`),
  KEY `child_id` (`child_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `lunch_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `lunch_records_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.lunch_records: ~0 rows (approximately)
DELETE FROM `lunch_records`;

-- Dumping structure for table carechild_db.milk_records
DROP TABLE IF EXISTS `milk_records`;
CREATE TABLE IF NOT EXISTS `milk_records` (
  `milk_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('มา','ลา','ขาด') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`milk_id`),
  KEY `child_id` (`child_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `milk_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `milk_records_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.milk_records: ~0 rows (approximately)
DELETE FROM `milk_records`;

-- Dumping structure for table carechild_db.monthly_measurements
DROP TABLE IF EXISTS `monthly_measurements`;
CREATE TABLE IF NOT EXISTS `monthly_measurements` (
  `measurement_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `measurement_date` date DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`measurement_id`),
  KEY `child_id` (`child_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `monthly_measurements_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `monthly_measurements_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.monthly_measurements: ~0 rows (approximately)
DELETE FROM `monthly_measurements`;

-- Dumping structure for table carechild_db.parents
DROP TABLE IF EXISTS `parents`;
CREATE TABLE IF NOT EXISTS `parents` (
  `parent_id` int NOT NULL AUTO_INCREMENT,
  `prefix` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `job` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.parents: ~4 rows (approximately)
DELETE FROM `parents`;
INSERT INTO `parents` (`parent_id`, `prefix`, `first_name`, `last_name`, `phone`, `email`, `job`, `salary`, `created_at`) VALUES
	(1, 'นางสาว', 'ทัศนาชล', 'กองพันธ์', '0849836097', NULL, 'รับจ้าง', 13000.00, '2025-12-20 04:11:00'),
	(2, 'นาย', 'ระพีพัฒน์', 'ชมพัฒน์', '0611049169', 'sunwachiraza@gmail.com', NULL, NULL, '2025-12-20 05:20:26'),
	(3, 'นาย', 'mama', 'mamo', '0951234565', '', NULL, NULL, '2025-12-20 08:10:56'),
	(4, 'นาง', 'ยาย', 'ขาวดำ', '0819762281', 'yaya@gmail.com', NULL, NULL, '2025-12-20 09:42:44');

-- Dumping structure for table carechild_db.relation
DROP TABLE IF EXISTS `relation`;
CREATE TABLE IF NOT EXISTS `relation` (
  `relation_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `parent_id` int NOT NULL,
  `relationship` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`relation_id`),
  KEY `child_id` (`child_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `relation_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `relation_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.relation: ~0 rows (approximately)
DELETE FROM `relation`;

-- Dumping structure for table carechild_db.teachers
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE IF NOT EXISTS `teachers` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `center_id` int NOT NULL,
  `classroom_id` int DEFAULT NULL,
  `prefix` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`teacher_id`),
  KEY `center_id` (`center_id`),
  KEY `classroom_id` (`classroom_id`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`),
  CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.teachers: ~0 rows (approximately)
DELETE FROM `teachers`;
INSERT INTO `teachers` (`teacher_id`, `center_id`, `classroom_id`, `prefix`, `first_name`, `last_name`, `phone`, `email`, `created_at`) VALUES
	(1, 1, 1, 'นางสาว', 'ปรียาภัทร', 'ชมพัฒน์', '0981914718', 'koysunday@gmail.com', '2025-12-20 03:53:40');

-- Dumping structure for table carechild_db.toothbrush_records
DROP TABLE IF EXISTS `toothbrush_records`;
CREATE TABLE IF NOT EXISTS `toothbrush_records` (
  `toothbrush_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` enum('มา','ลา','ขาด') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`toothbrush_id`),
  KEY `child_id` (`child_id`),
  KEY `teacher_id` (`teacher_id`),
  CONSTRAINT `toothbrush_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `toothbrush_records_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.toothbrush_records: ~0 rows (approximately)
DELETE FROM `toothbrush_records`;

-- Dumping structure for table carechild_db.uploads
DROP TABLE IF EXISTS `uploads`;
CREATE TABLE IF NOT EXISTS `uploads` (
  `upload_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `center_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`upload_id`),
  KEY `child_id` (`child_id`),
  KEY `parent_id` (`parent_id`),
  KEY `teacher_id` (`teacher_id`),
  KEY `center_id` (`center_id`),
  CONSTRAINT `uploads_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `uploads_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `uploads_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`),
  CONSTRAINT `uploads_ibfk_4` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.uploads: ~0 rows (approximately)
DELETE FROM `uploads`;

-- Dumping structure for table carechild_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('admin','teacher','parent') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `center_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  KEY `teacher_id` (`teacher_id`),
  KEY `parent_id` (`parent_id`),
  KEY `center_id` (`center_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`),
  CONSTRAINT `users_ibfk_2` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `users_ibfk_3` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table carechild_db.users: ~6 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`user_id`, `username`, `password`, `role`, `teacher_id`, `parent_id`, `center_id`, `created_at`) VALUES
	(1, 'admin', '1234', 'admin', NULL, NULL, NULL, '2025-12-20 04:42:48'),
	(2, 'palida', '1234', 'teacher', 1, NULL, 1, '2025-12-20 03:50:01'),
	(3, 'ทัศนาชล', '4567', 'parent', NULL, 1, 1, '2025-12-20 04:11:41'),
	(7, 'rapeephat', '2544', 'parent', NULL, 2, 1, '2025-12-20 05:20:26'),
	(8, 'mama', '6789', 'parent', NULL, 3, 1, '2025-12-20 08:10:56'),
	(9, 'ยายอุ', '4561', 'parent', NULL, 4, 1, '2025-12-20 09:42:44');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
