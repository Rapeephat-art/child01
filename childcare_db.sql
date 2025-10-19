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
/*!40014 SET @OLD_FOREIGN_KEY_ฤCHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for childcare_db
DROP DATABASE IF EXISTS `childcare_db`;
CREATE DATABASE IF NOT EXISTS `childcare_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `childcare_db`;

-- Dumping structure for table childcare_db.announcements
CREATE TABLE IF NOT EXISTS `announcements` (
  `announcement_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `title` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT 'หัวข้อ',
  `body` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'เนื้อหา',
  `posted_date` date NOT NULL COMMENT 'วันที่โพสต์',
  `posted_time` time NOT NULL COMMENT 'เวลาที่โพสต์',
  `semester` tinyint DEFAULT NULL COMMENT 'ภาคเรียน',
  `academic_year` year DEFAULT NULL COMMENT 'ปีการศึกษา',
  PRIMARY KEY (`announcement_id`),
  KEY `fk_announce_teacher` (`teacher_id`),
  CONSTRAINT `fk_announce_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.attendances
CREATE TABLE IF NOT EXISTS `attendances` (
  `attendance_id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'รหัสการเช็คชื่อ',
  `child_id` bigint unsigned NOT NULL COMMENT 'รหัสเด็กที่เช็คชื่อ',
  `teacher_id` bigint unsigned DEFAULT NULL COMMENT 'รหัสครูผู้เช็คชื่อ',
  `status` enum('มา','ขาด','ลา') NOT NULL DEFAULT 'มา' COMMENT 'สถานะการมาเรียน',
  `note` text COMMENT 'หมายเหตุ เช่น ป่วย/ลากิจ',
  `attendance_date` date NOT NULL COMMENT 'วัน/เดือน/ปี ที่เช็คชื่อ',
  `attendance_time` time NOT NULL COMMENT 'เวลาในการเช็คชื่อ',
  `semester` enum('1','2') NOT NULL COMMENT 'ภาคเรียน',
  `academic_year` year NOT NULL COMMENT 'ปีการศึกษา',
  PRIMARY KEY (`attendance_id`),
  KEY `fk_attendance_child` (`child_id`),
  KEY `fk_attendance_teacher` (`teacher_id`),
  CONSTRAINT `fk_attendance_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_attendance_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='บันทึกการเช็คชื่อประจำวัน';

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.attendances_lunch
CREATE TABLE IF NOT EXISTS `attendances_lunch` (
  `attendance_lunch_id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'รหัสการเช็คชื่อ',
  `child_id` bigint unsigned NOT NULL COMMENT 'รหัสเด็กที่เช็ค',
  `teacher_id` bigint unsigned DEFAULT NULL COMMENT 'รหัสครูผู้เช็ค',
  `attendance_id` bigint unsigned DEFAULT NULL,
  `status` enum('ทาน','ไม่ได้ทาน') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ทาน' COMMENT 'สถานะ',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'หมายเหตุ เช่น ป่วย/ลากิจ',
  `attendance_date` date NOT NULL COMMENT 'วัน/เดือน/ปี ที่เช็คชื่อ',
  `attendance_time` time NOT NULL COMMENT 'เวลาในการเช็คชื่อ',
  `semester` enum('1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ภาคเรียน',
  `academic_year` year NOT NULL COMMENT 'ปีการศึกษา',
  PRIMARY KEY (`attendance_lunch_id`) USING BTREE,
  KEY `fk_attendance_lunch_child` (`child_id`) USING BTREE,
  KEY `fk_attendance_lunch_teacher` (`teacher_id`) USING BTREE,
  KEY `fk_attendance_lunch_attendance` (`attendance_id`) USING BTREE,
  CONSTRAINT `attendances_lunch_attendance_id` FOREIGN KEY (`attendance_id`) REFERENCES `attendances` (`attendance_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `attendances_lunch_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_lunch_ibfk_2` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='บันทึกการเช็ครับประทานอาหารกลางวันประจำวัน';

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.attendances_milk
CREATE TABLE IF NOT EXISTS `attendances_milk` (
  `attendance_lunch_id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'รหัสการเช็คชื่อ',
  `child_id` bigint unsigned NOT NULL COMMENT 'รหัสเด็กที่เช็ค',
  `teacher_id` bigint unsigned DEFAULT NULL COMMENT 'รหัสครูผู้เช็ค',
  `attendance_id` bigint unsigned DEFAULT NULL,
  `status` enum('ดื่ม','ไม่ได้ดื่ม') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'ดื่ม' COMMENT 'สถานะ',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci COMMENT 'หมายเหตุ เช่น ป่วย/ลากิจ',
  `attendance_date` date NOT NULL COMMENT 'วัน/เดือน/ปี ที่เช็คชื่อ',
  `attendance_time` time NOT NULL COMMENT 'เวลาในการเช็คชื่อ',
  `semester` enum('1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ภาคเรียน',
  `academic_year` year NOT NULL COMMENT 'ปีการศึกษา',
  PRIMARY KEY (`attendance_lunch_id`) USING BTREE,
  KEY `fk_attendance_lunch_child` (`child_id`) USING BTREE,
  KEY `fk_attendance_lunch_teacher` (`teacher_id`) USING BTREE,
  KEY `fk_attendance_lunch_attendance` (`attendance_id`) USING BTREE,
  CONSTRAINT `attendances_milk_ibfk_1` FOREIGN KEY (`attendance_id`) REFERENCES `attendances` (`attendance_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `attendances_milk_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `attendances_milk_ibfk_3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='บันทึกการเช็ครับประทานอาหารกลางวันประจำวัน';

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.audit_logs
CREATE TABLE IF NOT EXISTS `audit_logs` (
  `audit_id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'รหัสรายการบันทึก',
  `teacher_id` bigint unsigned NOT NULL COMMENT 'รหัสครูผู้ดำเนินการ',
  `table_name` varchar(100) NOT NULL COMMENT 'ชื่อตารางที่ถูกดำเนินการ',
  `record_id` bigint unsigned DEFAULT NULL COMMENT 'รหัสข้อมูลที่ถูกกระทำ',
  `action_type` enum('INSERT','UPDATE','DELETE') NOT NULL COMMENT 'ประเภทการกระทำ',
  `action_date` date NOT NULL COMMENT 'วันที่ทำรายการ',
  `action_time` time NOT NULL COMMENT 'เวลาที่ทำรายการ',
  PRIMARY KEY (`audit_id`),
  KEY `fk_audit_teacher` (`teacher_id`),
  CONSTRAINT `fk_audit_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='บันทึกการกระทำของครูในระบบ';

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
  `relation` varchar(50) NOT NULL DEFAULT '' COMMENT 'ควรเป็น บิดา/มารดา เท่านั้นในตารางนี้',
  `marital_status` varchar(50) DEFAULT NULL COMMENT 'สถานภาพ',
  `religion` varchar(70) DEFAULT NULL,
  `job` varchar(70) DEFAULT NULL,
  `income` decimal(10,2) DEFAULT NULL,
  `status` enum('อนุมัติ','ไม่อนุมัติ','รอการอนุมัติ') DEFAULT 'รอการอนุมัติ',
  `created_date` date NOT NULL COMMENT 'วันที่สร้าง',
  `created_time` time NOT NULL COMMENT 'เวลาที่สร้าง',
  PRIMARY KEY (`bio_parent_id`),
  KEY `fk_bioparent_child` (`child_id`),
  CONSTRAINT `fk_bioparent_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.centers
CREATE TABLE IF NOT EXISTS `centers` (
  `center_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL COMMENT 'ชื่อศูนย์พัฒนาเด็กเล็ก',
  `phone` varchar(20) DEFAULT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `village` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `subdistrict` varchar(70) DEFAULT NULL,
  `district` varchar(70) DEFAULT NULL,
  `province` varchar(70) DEFAULT NULL,
  `enroll_open` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`center_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.children
CREATE TABLE IF NOT EXISTS `children` (
  `child_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `center_id` bigint unsigned DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `classroom_id` bigint unsigned DEFAULT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `nickname` varchar(100) DEFAULT NULL,
  `gender` enum('ชาย','หญิง') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `citizen_id` varchar(20) DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL COMMENT 'ผู้ปกครองหลัก (1 คนต่อเด็ก)',
  `nationality` varchar(50) DEFAULT NULL,
  `race` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `father_id` bigint unsigned DEFAULT NULL COMMENT 'ชี้ไปที่ bio_parents (บิดา)',
  `mother_id` bigint unsigned DEFAULT NULL COMMENT 'ชี้ไปที่ bio_parents (มารดา)',
  `teacher_id` bigint unsigned DEFAULT NULL,
  `allergy` varchar(255) DEFAULT NULL,
  `disease` varchar(255) DEFAULT NULL,
  `tuition_benefit` enum('มี','ไม่มี') DEFAULT 'ไม่มี',
  `medical_benefit` enum('มี','ไม่มี') DEFAULT 'ไม่มี',
  `status` enum('อนุมัติ','ไม่อนุมัติ','รอการอนุมัติ') DEFAULT 'รอการอนุมัติ',
  `created_date` date NOT NULL COMMENT 'วันที่สร้าง',
  `created_time` time NOT NULL COMMENT 'เวลาที่สร้าง',
  PRIMARY KEY (`child_id`),
  UNIQUE KEY `citizen_id` (`citizen_id`),
  KEY `fk_child_center` (`center_id`),
  KEY `fk_child_parent` (`parent_id`),
  KEY `fk_child_father` (`father_id`),
  KEY `fk_child_mother` (`mother_id`),
  KEY `fk_child_teacher` (`teacher_id`) USING BTREE,
  KEY `fk_child_classroom` (`classroom_id`) USING BTREE,
  CONSTRAINT `fk_child_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_child_classroom` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroom_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_father` FOREIGN KEY (`father_id`) REFERENCES `bio_parents` (`bio_parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_mother` FOREIGN KEY (`mother_id`) REFERENCES `bio_parents` (`bio_parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.classrooms
CREATE TABLE IF NOT EXISTS `classrooms` (
  `classroom_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `center_id` bigint unsigned NOT NULL,
  `name` varchar(100) NOT NULL,
  `current_count` int unsigned DEFAULT '0',
  `capacity` int unsigned NOT NULL,
  `age_group` enum('ต่ำกว่า 3 ปี','3 ปีขึ้นไป') NOT NULL,
  PRIMARY KEY (`classroom_id`),
  KEY `fk_classroom_center` (`center_id`),
  CONSTRAINT `fk_classroom_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.current_addresses
CREATE TABLE IF NOT EXISTS `current_addresses` (
  `address_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `village` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `subdistrict` varchar(100) NOT NULL DEFAULT '',
  `district` varchar(100) NOT NULL DEFAULT '',
  `province` varchar(100) NOT NULL DEFAULT '',
  `postal_code` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_date` date NOT NULL COMMENT 'วันที่สร้าง',
  `created_time` time NOT NULL COMMENT 'เวลาที่สร้าง',
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `uq_current_child` (`child_id`),
  CONSTRAINT `fk_current_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.document
CREATE TABLE IF NOT EXISTS `document` (
  `document_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned DEFAULT NULL,
  `parent_id` bigint unsigned DEFAULT NULL,
  `document_type` varchar(255) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_file` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ไฟล์รูป/เอกสาร',
  `unload_date` date NOT NULL,
  `unload_time` time NOT NULL,
  PRIMARY KEY (`document_id`) USING BTREE,
  KEY `fk_docimg_child` (`child_id`),
  KEY `fk_docimg_parent` (`parent_id`),
  CONSTRAINT `fk_docimg_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_docimg_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.enrollments
CREATE TABLE IF NOT EXISTS `enrollments` (
  `enrollment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` bigint unsigned DEFAULT NULL,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `center_id` bigint unsigned DEFAULT NULL,
  `prefix` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `first_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('ชาย','หญิง') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `citizen_id` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `parent_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `document_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('รอการอนุมัติ','อนุมัติ','ไม่อนุมัติ') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'รอการอนุมัติ',
  `created_date` date NOT NULL COMMENT 'วันที่สร้าง',
  `created_time` time NOT NULL COMMENT 'เวลาที่สร้าง',
  `approved_by` bigint unsigned DEFAULT NULL COMMENT 'อนุมัติโดยครู(teachers.id)',
  `child_id` bigint unsigned DEFAULT NULL,
  `extra_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `files_json` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`enrollment_id`),
  KEY `idx_enroll_parent` (`parent_id`),
  CONSTRAINT `fk_enroll_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.growth_records
CREATE TABLE IF NOT EXISTS `growth_records` (
  `growth_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `record_id` bigint unsigned DEFAULT NULL COMMENT 'อ้างอิงไป health_records.record_id',
  `teacher_id` bigint unsigned DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `height_cm` decimal(5,2) DEFAULT NULL,
  `bmi` decimal(6,3) GENERATED ALWAYS AS ((case when ((`height_cm` is not null) and (`height_cm` > 0) and (`weight_kg` is not null)) then (`weight_kg` / pow((`height_cm` / 100),2)) else NULL end)) STORED,
  `note` varchar(255) DEFAULT NULL,
  `measured_date` date NOT NULL,
  `semester` tinyint DEFAULT NULL,
  `academic_year` year DEFAULT NULL,
  PRIMARY KEY (`growth_id`),
  KEY `fk_gr_teacher` (`teacher_id`),
  KEY `idx_gr_child_date` (`child_id`,`measured_date`) USING BTREE,
  KEY `idx_growth_record_id` (`record_id`),
  CONSTRAINT `fk_gr_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_gr_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_growth_health` FOREIGN KEY (`record_id`) REFERENCES `health_records` (`record_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.health_records
CREATE TABLE IF NOT EXISTS `health_records` (
  `record_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `teacher_id` bigint unsigned DEFAULT NULL,
  `hair` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `eyes` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `mouth` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `teeth` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `ears` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `nose` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `nails` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `skin` enum('1','2','3') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '3',
  `recorded_date` date NOT NULL,
  `semester` tinyint DEFAULT NULL,
  `academic_year` year DEFAULT NULL,
  PRIMARY KEY (`record_id`),
  KEY `fk_health_child` (`child_id`),
  KEY `fk_health_teacher` (`teacher_id`),
  CONSTRAINT `fk_health_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_health_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.home_addresses
CREATE TABLE IF NOT EXISTS `home_addresses` (
  `address_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `child_id` bigint unsigned NOT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `village` varchar(50) DEFAULT NULL,
  `street` varchar(150) DEFAULT NULL,
  `subdistrict` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `district` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `province` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `postal_code` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_date` date NOT NULL COMMENT 'วันที่สร้าง',
  `created_time` time NOT NULL COMMENT 'เวลาที่สร้าง',
  PRIMARY KEY (`address_id`),
  UNIQUE KEY `uq_home_child` (`child_id`),
  CONSTRAINT `fk_home_child` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.images
CREATE TABLE IF NOT EXISTS `images` (
  `image_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `announcement_id` bigint unsigned NOT NULL,
  `image_path` varchar(255) NOT NULL COMMENT 'รูปกิจกรรม',
  `unload_date` date NOT NULL,
  `unload_time` time NOT NULL,
  PRIMARY KEY (`image_id`),
  KEY `fk_image_announce` (`announcement_id`),
  CONSTRAINT `fk_image_announce` FOREIGN KEY (`announcement_id`) REFERENCES `announcements` (`announcement_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.menus
CREATE TABLE IF NOT EXISTS `menus` (
  `menu_id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT 'รหัสเมนูอาหาร',
  `teacher_id` bigint unsigned DEFAULT NULL COMMENT 'ครูผู้บันทึกเมนู',
  `center_id` bigint unsigned DEFAULT NULL COMMENT 'ศูนย์พัฒนาเด็กเล็ก',
  `food_name` varchar(255) NOT NULL COMMENT 'ชื่ออาหาร',
  `food_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT 'ประเภทอาหาร',
  `note` varchar(255) DEFAULT NULL COMMENT 'หมายเหตุ เช่น น้ำจิ้มไก่ หรือของหวานเพิ่มเติม',
  `menu_date` date NOT NULL COMMENT 'วันที่เสิร์ฟเมนูนี้',
  `menu_time` time NOT NULL COMMENT 'เวลาเสิร์ฟเมนูนี้',
  `semester` enum('1','2') NOT NULL COMMENT 'ภาคเรียน',
  `academic_year` year NOT NULL COMMENT 'ปีการศึกษา',
  PRIMARY KEY (`menu_id`),
  KEY `fk_menu_teacher` (`teacher_id`),
  KEY `fk_menu_center` (`center_id`),
  CONSTRAINT `fk_menu_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_menu_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='เมนูอาหารประจำวัน';

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.parents
CREATE TABLE IF NOT EXISTS `parents` (
  `parent_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `prefix` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `citizen_id` varchar(20) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `relation` varchar(50) DEFAULT NULL COMMENT 'ความเกี่ยวข้องหลักกับเด็ก',
  `religion` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `job` varchar(70) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `income` decimal(10,2) DEFAULT NULL,
  `status` enum('อนุมัติ','ไม่อนุมัติ','รอการอนุมัติ') DEFAULT 'รอการอนุมัติ',
  `created_date` date NOT NULL COMMENT 'วันที่สร้าง',
  `created_time` time NOT NULL COMMENT 'เวลาที่สร้าง',
  PRIMARY KEY (`parent_id`),
  UNIQUE KEY `uq_parent_citizen` (`citizen_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.positions
CREATE TABLE IF NOT EXISTS `positions` (
  `position_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` bigint unsigned NOT NULL,
  `position_name` varchar(100) NOT NULL COMMENT 'ชื่อตำแหน่ง เช่น ครูผู้ดูแล, ผอ.ศูนย์',
  `duties` varchar(255) DEFAULT NULL COMMENT 'หน้าที่เพิ่มเติม',
  `assigned_date` date NOT NULL,
  `assigned_time` time NOT NULL,
  PRIMARY KEY (`position_id`),
  KEY `fk_position_teacher` (`teacher_id`),
  CONSTRAINT `fk_position_teacher` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table childcare_db.teachers
CREATE TABLE IF NOT EXISTS `teachers` (
  `teacher_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL COMMENT 'ชื่อผู้ใช้เข้าสู่ระบบ',
  `password` varchar(255) NOT NULL COMMENT 'รหัสผ่าน (plain ตามข้อกำหนด)',
  `classroom_id` bigint unsigned DEFAULT NULL,
  `prefix` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `gender` enum('ชาย','หญิง') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `center_id` bigint unsigned DEFAULT NULL,
  `position_id` bigint unsigned DEFAULT NULL COMMENT 'รหัสตำแหน่ง/หน้าที่ (ครูมี 1 ตำแหน่ง)',
  `role` varchar(70) NOT NULL DEFAULT '' COMMENT 'สิทธิ์ผู้ใช้งาน',
  `created_date` date NOT NULL COMMENT 'วันที่สร้าง',
  `created_time` time NOT NULL COMMENT 'เวลาที่สร้าง',
  PRIMARY KEY (`teacher_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `uq_teachers_username` (`username`),
  KEY `fk_teacher_center` (`center_id`),
  KEY `fk_teacher_position` (`position_id`),
  KEY `fk_teacher_classroom` (`classroom_id`),
  CONSTRAINT `fk_teacher_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_classroom` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroom_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_position` FOREIGN KEY (`position_id`) REFERENCES `positions` (`position_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
