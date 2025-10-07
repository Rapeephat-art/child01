-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for childcare_db
CREATE DATABASE IF NOT EXISTS `childcare_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `childcare_db`;

-- Dumping structure for table childcare_db.announcements
CREATE TABLE IF NOT EXISTS `announcements` (
  `announcement_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `posted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `semester` tinyint DEFAULT NULL,
  `academic_year` year DEFAULT NULL,
  `title` varchar(200) DEFAULT NULL,
  `body` text,
  PRIMARY KEY (`announcement_id`),
  KEY `fk_announce_teacher` (`teacher_id`),
  CONSTRAINT `fk_announce_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.attendance_records
CREATE TABLE IF NOT EXISTS `attendance_records` (
  `record_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `session_id` bigint unsigned NOT NULL,
  `child_id` bigint unsigned NOT NULL,
  `status` enum('มา','ขาด','สาย','ลา') DEFAULT 'มา',
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`record_id`),
  UNIQUE KEY `uq_attend` (`session_id`,`child_id`),
  KEY `fk_attend_child` (`child_id`),
  CONSTRAINT `fk_attend_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attend_session` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.attendance_sessions
CREATE TABLE IF NOT EXISTS `attendance_sessions` (
  `session_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `period` enum('เช้า','กลางวัน') NOT NULL,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `checked_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `semester` tinyint DEFAULT NULL,
  `academic_year` year DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  KEY `fk_session_teacher` (`teacher_id`),
  CONSTRAINT `fk_session_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `audit_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `action_at` datetime NOT NULL,
  `before_data` json DEFAULT NULL,
  `after_data` json DEFAULT NULL,
  PRIMARY KEY (`audit_id`),
  KEY `fk_audit_teacher` (`teacher_id`),
  KEY `fk_audit_parent` (`parent_id`),
  CONSTRAINT `fk_audit_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_audit_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.bio_parents
CREATE TABLE IF NOT EXISTS `bio_parents` (
  `bio_parent_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `citizen_id` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `relation_id` bigint unsigned NOT NULL COMMENT 'ควรเป็น บิดา/มารดา เท่านั้นในตารางนี้',
  `marital_status` varchar(50) DEFAULT NULL COMMENT 'สถานภาพ',
  `religion_id` bigint unsigned DEFAULT NULL,
  `job_id` bigint unsigned DEFAULT NULL,
  `income` decimal(10,2) DEFAULT NULL,
  `status` enum('อนุมัติ','ไม่อนุมัติ','รอการอนุมัติ') DEFAULT 'รอการอนุมัติ',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bio_parent_id`),
  KEY `fk_bioparent_child` (`child_id`),
  KEY `fk_bioparent_relation` (`relation_id`),
  KEY `fk_bioparent_religion` (`religion_id`),
  KEY `fk_bioparent_job` (`job_id`),
  CONSTRAINT `fk_bioparent_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `fk_bioparent_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_bioparent_relation` FOREIGN KEY (`relation_id`) REFERENCES `relations` (`relation_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_bioparent_religion` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`religion_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.centers
CREATE TABLE IF NOT EXISTS `centers` (
  `center_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL COMMENT 'ชื่อศูนย์พัฒนาเด็กเล็ก',
  `phone` varchar(20) DEFAULT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `village` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `subdistrict_id` bigint unsigned DEFAULT NULL,
  `district_id` bigint unsigned DEFAULT NULL,
  `province_id` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`center_id`),
  KEY `fk_center_subdistrict` (`subdistrict_id`),
  KEY `fk_center_district` (`district_id`),
  KEY `fk_center_province` (`province_id`),
  CONSTRAINT `fk_center_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_center_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_center_subdistrict` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`subdistrict_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.children
CREATE TABLE IF NOT EXISTS `children` (
  `child_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `center_id` bigint unsigned NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `gender` enum('ชาย','หญิง','อื่นๆ') DEFAULT NULL,
  `citizen_id` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL COMMENT 'ผู้ปกครองหลัก (1 คนต่อเด็ก)',
  `nationality_id` bigint unsigned DEFAULT NULL,
  `race_id` bigint unsigned DEFAULT NULL,
  `religion_id` bigint unsigned DEFAULT NULL,
  `father_id` bigint unsigned DEFAULT NULL COMMENT 'ชี้ไปที่ bio_parents (บิดา)',
  `mother_id` bigint unsigned DEFAULT NULL COMMENT 'ชี้ไปที่ bio_parents (มารดา)',
  `teacher1_id` bigint unsigned DEFAULT NULL,
  `teacher2_id` bigint unsigned DEFAULT NULL,
  `allergy` varchar(255) DEFAULT NULL,
  `disease` varchar(255) DEFAULT NULL,
  `tuition_benefit` enum('มี','ไม่มี') DEFAULT 'ไม่มี',
  `medical_benefit` enum('มี','ไม่มี') DEFAULT 'ไม่มี',
  `status` enum('อนุมัติ','ไม่อนุมัติ','รอการอนุมัติ') DEFAULT 'รอการอนุมัติ',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`child_id`),
  UNIQUE KEY `citizen_id` (`citizen_id`),
  KEY `fk_child_center` (`center_id`),
  KEY `fk_child_parent` (`parent_id`),
  KEY `fk_child_national` (`nationality_id`),
  KEY `fk_child_race` (`race_id`),
  KEY `fk_child_religion` (`religion_id`),
  KEY `fk_child_teacher1` (`teacher1_id`),
  KEY `fk_child_teacher2` (`teacher2_id`),
  KEY `fk_child_father` (`father_id`),
  KEY `fk_child_mother` (`mother_id`),
  CONSTRAINT `fk_child_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_child_father` FOREIGN KEY (`father_id`) REFERENCES `bio_parents` (`bio_parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_mother` FOREIGN KEY (`mother_id`) REFERENCES `bio_parents` (`bio_parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_national` FOREIGN KEY (`nationality_id`) REFERENCES `nationalities` (`nationality_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_race` FOREIGN KEY (`race_id`) REFERENCES `races` (`race_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_religion` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`religion_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_teacher1` FOREIGN KEY (`teacher1_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_teacher2` FOREIGN KEY (`teacher2_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.current_addresses
CREATE TABLE IF NOT EXISTS `current_addresses` (
  `address_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `village` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `subdistrict_id` bigint unsigned NOT NULL,
  `district_id` bigint unsigned NOT NULL,
  `province_id` bigint unsigned NOT NULL,
  `postal_code` varchar(5) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `uq_current_child` (`child_id`),
  KEY `fk_current_subdistrict` (`subdistrict_id`),
  KEY `fk_current_district` (`district_id`),
  KEY `fk_current_province` (`province_id`),
  CONSTRAINT `fk_current_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_current_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_current_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_current_subdistrict` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`subdistrict_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.daily_menus
CREATE TABLE IF NOT EXISTS `daily_menus` (
  `daily_menu_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `menu_date` date NOT NULL,
  `food_id` bigint unsigned NOT NULL,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`daily_menu_id`),
  UNIQUE KEY `uq_menu_day_food` (`menu_date`,`food_id`),
  KEY `fk_dailymenu_food` (`food_id`),
  KEY `fk_dailymenu_teacher` (`teacher_id`),
  CONSTRAINT `fk_dailymenu_food` FOREIGN KEY (`food_id`) REFERENCES `foods` (`food_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_dailymenu_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.districts
CREATE TABLE IF NOT EXISTS `districts` (
  `district_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name_th` varchar(150) NOT NULL COMMENT 'ชื่ออำเภอ',
  `province_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`district_id`),
  KEY `idx_districts_province` (`province_id`),
  CONSTRAINT `fk_district_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.document_images
CREATE TABLE IF NOT EXISTS `document_images` (
  `document_image_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `document_type_id` bigint unsigned NOT NULL,
  `file_path` varchar(255) NOT NULL COMMENT 'พาธไฟล์รูป/เอกสาร',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`document_image_id`),
  KEY `fk_docimg_child` (`child_id`),
  KEY `fk_docimg_parent` (`parent_id`),
  KEY `fk_docimg_doctype` (`document_type_id`),
  CONSTRAINT `fk_docimg_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_docimg_doctype` FOREIGN KEY (`document_type_id`) REFERENCES `document_types` (`document_type_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_docimg_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.document_types
CREATE TABLE IF NOT EXISTS `document_types` (
  `document_type_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL COMMENT 'ชื่อเอกสาร เช่น สูติบัตร/ทะเบียนบ้าน',
  `sample_image` varchar(255) DEFAULT NULL COMMENT 'ไฟล์ตัวอย่าง/ตัวอย่างภาพ (ถ้ามี)',
  PRIMARY KEY (`document_type_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.foods
CREATE TABLE IF NOT EXISTS `foods` (
  `food_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL COMMENT 'ชื่ออาหาร',
  PRIMARY KEY (`food_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.health_records
CREATE TABLE IF NOT EXISTS `health_records` (
  `record_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `height_cm` decimal(5,2) DEFAULT NULL,
  `hair` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `eyes` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `mouth` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `teeth` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `ears` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `nose` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `nails` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `skin` enum('ปกติ','ผิดปกติเล็กน้อย','ผิดปกติรุนแรง') DEFAULT 'ปกติ',
  `recorded_at` datetime NOT NULL,
  `semester` tinyint DEFAULT NULL,
  `academic_year` year DEFAULT NULL,
  PRIMARY KEY (`record_id`),
  KEY `fk_health_child` (`child_id`),
  KEY `fk_health_teacher` (`teacher_id`),
  CONSTRAINT `fk_health_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_health_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.home_addresses
CREATE TABLE IF NOT EXISTS `home_addresses` (
  `address_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `village` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `subdistrict_id` bigint unsigned NOT NULL,
  `district_id` bigint unsigned NOT NULL,
  `province_id` bigint unsigned NOT NULL,
  `postal_code` varchar(5) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `uq_home_child` (`child_id`),
  KEY `fk_home_subdistrict` (`subdistrict_id`),
  KEY `fk_home_district` (`district_id`),
  KEY `fk_home_province` (`province_id`),
  CONSTRAINT `fk_home_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_home_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_home_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`province_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_home_subdistrict` FOREIGN KEY (`subdistrict_id`) REFERENCES `subdistricts` (`subdistrict_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.images
CREATE TABLE IF NOT EXISTS `images` (
  `image_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `announcement_id` bigint unsigned NOT NULL,
  `image_path` varchar(255) NOT NULL COMMENT 'รูปกิจกรรม',
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `fk_image_announce` (`announcement_id`),
  CONSTRAINT `fk_image_announce` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`announcement_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `job_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'ชื่ออาชีพ',
  PRIMARY KEY (`job_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.nationalities
CREATE TABLE IF NOT EXISTS `nationalities` (
  `nationality_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'ชื่อสัญชาติ',
  PRIMARY KEY (`nationality_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.parents
CREATE TABLE IF NOT EXISTS `parents` (
  `parent_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL COMMENT 'ชื่อผู้ใช้เข้าสู่ระบบ',
  `password` varchar(255) NOT NULL COMMENT 'รหัสผ่าน (เก็บแบบ plain ตามข้อกำหนด)',
  `prefix` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `citizen_id` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `relation_id` bigint unsigned DEFAULT NULL COMMENT 'ความเกี่ยวข้องหลักกับเด็ก',
  `religion_id` bigint unsigned DEFAULT NULL,
  `job_id` bigint unsigned DEFAULT NULL,
  `income` decimal(10,2) DEFAULT NULL,
  `role_id` bigint unsigned NOT NULL COMMENT 'สิทธิ์ผู้ใช้งาน',
  `status` enum('อนุมัติ','ไม่อนุมัติ','รอการอนุมัติ') DEFAULT 'รอการอนุมัติ',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`parent_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `uq_parent_citizen` (`citizen_id`),
  KEY `fk_parent_relation` (`relation_id`),
  KEY `fk_parent_religion` (`religion_id`),
  KEY `fk_parent_job` (`job_id`),
  KEY `fk_parent_role` (`role_id`),
  CONSTRAINT `fk_parent_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_parent_relation` FOREIGN KEY (`relation_id`) REFERENCES `relations` (`relation_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_parent_religion` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`religion_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_parent_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.positions
CREATE TABLE IF NOT EXISTS `positions` (
  `position_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'ชื่อตำแหน่ง/หน้าที่',
  PRIMARY KEY (`position_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.provinces
CREATE TABLE IF NOT EXISTS `provinces` (
  `province_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name_th` varchar(150) NOT NULL COMMENT 'ชื่อจังหวัด',
  PRIMARY KEY (`province_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.races
CREATE TABLE IF NOT EXISTS `races` (
  `race_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'ชื่อเชื้อชาติ',
  PRIMARY KEY (`race_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.relations
CREATE TABLE IF NOT EXISTS `relations` (
  `relation_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'ชื่อความเกี่ยวข้อง เช่น บิดา/มารดา/ปู่/ย่า',
  PRIMARY KEY (`relation_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.religions
CREATE TABLE IF NOT EXISTS `religions` (
  `religion_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'ชื่อศาสนา',
  PRIMARY KEY (`religion_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT 'ชื่อสิทธิ์ใช้งาน',
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.subdistricts
CREATE TABLE IF NOT EXISTS `subdistricts` (
  `subdistrict_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name_th` varchar(150) NOT NULL COMMENT 'ชื่อตำบล',
  `district_id` bigint unsigned NOT NULL,
  `postal_code` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`subdistrict_id`),
  KEY `idx_subdistricts_district` (`district_id`),
  CONSTRAINT `fk_subdistrict_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`district_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.teachers
CREATE TABLE IF NOT EXISTS `teachers` (
  `teacher_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL COMMENT 'ชื่อผู้ใช้เข้าสู่ระบบ',
  `password` varchar(255) NOT NULL COMMENT 'รหัสผ่าน (plain ตามข้อกำหนด)',
  `prefix` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` enum('ชาย','หญิง','อื่นๆ') DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `center_id` bigint unsigned DEFAULT NULL,
  `position_id` bigint unsigned DEFAULT NULL COMMENT 'รหัสตำแหน่ง/หน้าที่ (ครูมี 1 ตำแหน่ง)',
  `role_id` bigint unsigned NOT NULL COMMENT 'สิทธิ์ผู้ใช้งาน',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_teacher_center` (`center_id`),
  KEY `fk_teacher_position` (`position_id`),
  KEY `fk_teacher_role` (`role_id`),
  CONSTRAINT `fk_teacher_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_position` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
