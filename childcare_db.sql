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
  `classroom_id` bigint unsigned DEFAULT NULL,
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
  KEY `fk_child_classroom` (`classroom_id`),
  CONSTRAINT `fk_child_center` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_child_classroom` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroom_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_father` FOREIGN KEY (`father_id`) REFERENCES `bio_parents` (`bio_parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_mother` FOREIGN KEY (`mother_id`) REFERENCES `bio_parents` (`bio_parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_national` FOREIGN KEY (`nationality_id`) REFERENCES `nationalities` (`nationality_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_race` FOREIGN KEY (`race_id`) REFERENCES `races` (`race_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_religion` FOREIGN KEY (`religion_id`) REFERENCES `religions` (`religion_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_teacher1` FOREIGN KEY (`teacher1_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_teacher2` FOREIGN KEY (`teacher2_id`) REFERENCES `teachers` (`teacher_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
