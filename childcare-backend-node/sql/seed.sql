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
CREATE DATABASE IF NOT EXISTS `carechild_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `carechild_db`;

-- Dumping structure for table carechild_db.addresses
DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `address_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `address_type` varchar(50) DEFAULT NULL,
  `house_no` varchar(50) DEFAULT NULL,
  `village` varchar(100) DEFAULT NULL,
  `subdistrict` varchar(100) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `postal_code` varchar(10) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`address_id`),
  KEY `fk_addresses_children` (`child_id`),
  KEY `fk_addresses_parents` (`parent_id`),
  CONSTRAINT `fk_addresses_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `fk_addresses_parents` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.announcements
DROP TABLE IF EXISTS `announcements`;
CREATE TABLE IF NOT EXISTS `announcements` (
  `announcement_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `content` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`announcement_id`),
  KEY `fk_announcements_users` (`created_by`),
  CONSTRAINT `fk_announcements_users` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.centers
DROP TABLE IF EXISTS `centers`;
CREATE TABLE IF NOT EXISTS `centers` (
  `center_id` int NOT NULL AUTO_INCREMENT,
  `school_id` varchar(50) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `LGO` varchar(100) DEFAULT NULL,
  `ORG_code` varchar(50) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`center_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.checkins
DROP TABLE IF EXISTS `checkins`;
CREATE TABLE IF NOT EXISTS `checkins` (
  `checkin_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `node` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`checkin_id`),
  KEY `fk_checkins_children` (`child_id`),
  CONSTRAINT `fk_checkins_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.children
DROP TABLE IF EXISTS `children`;
CREATE TABLE IF NOT EXISTS `children` (
  `child_id` int NOT NULL AUTO_INCREMENT,
  `child_code` varchar(50) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `prefix` varchar(20) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `ethnicity` varchar(50) DEFAULT NULL,
  `blood` varchar(10) DEFAULT NULL,
  `nationality` varchar(50) DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `treatment` text,
  `reimbursement` text,
  `vaccine` text,
  `eat` text,
  `needs` text,
  `enter_study` date DEFAULT NULL,
  `note` text,
  `classroom_id` int DEFAULT NULL,
  `father_parent_id` int DEFAULT NULL,
  `mother_parent_id` int DEFAULT NULL,
  `home_address_id` int DEFAULT NULL,
  `current_address_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`child_id`),
  KEY `fk_children_parents1` (`parent_id`),
  KEY `fk_children_parents2` (`father_parent_id`),
  KEY `fk_children_parents3` (`mother_parent_id`),
  KEY `fk_children_addr_home` (`home_address_id`),
  KEY `fk_children_addr_curr` (`current_address_id`),
  CONSTRAINT `fk_children_addr_curr` FOREIGN KEY (`current_address_id`) REFERENCES `addresses` (`address_id`),
  CONSTRAINT `fk_children_addr_home` FOREIGN KEY (`home_address_id`) REFERENCES `addresses` (`address_id`),
  CONSTRAINT `fk_children_parents1` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `fk_children_parents2` FOREIGN KEY (`father_parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `fk_children_parents3` FOREIGN KEY (`mother_parent_id`) REFERENCES `parents` (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.child_food_allergies
DROP TABLE IF EXISTS `child_food_allergies`;
CREATE TABLE IF NOT EXISTS `child_food_allergies` (
  `allergy_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `allergan` varchar(100) DEFAULT NULL,
  `severity` varchar(50) DEFAULT NULL,
  `reaction` text,
  `note` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`allergy_id`),
  KEY `fk_allergy_children` (`child_id`),
  CONSTRAINT `fk_allergy_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.classrooms
DROP TABLE IF EXISTS `classrooms`;
CREATE TABLE IF NOT EXISTS `classrooms` (
  `classroom_id` int NOT NULL AUTO_INCREMENT,
  `classroom_code` varchar(50) DEFAULT NULL,
  `center_id` int DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `homeroom_teacher_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`classroom_id`),
  KEY `fk_classrooms_centers` (`center_id`),
  KEY `fk_classrooms_teachers` (`homeroom_teacher_id`),
  CONSTRAINT `fk_classrooms_centers` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`),
  CONSTRAINT `fk_classrooms_teachers` FOREIGN KEY (`homeroom_teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.daily_activity_logs
DROP TABLE IF EXISTS `daily_activity_logs`;
CREATE TABLE IF NOT EXISTS `daily_activity_logs` (
  `daily_log_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `activity_type` varchar(100) DEFAULT NULL,
  `activity_date` date DEFAULT NULL,
  `stutus` varchar(50) DEFAULT NULL,
  `note` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`daily_log_id`),
  KEY `fk_daily_children` (`child_id`),
  CONSTRAINT `fk_daily_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.enrollments
DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE IF NOT EXISTS `enrollments` (
  `enrollment_id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `approved_by` int DEFAULT NULL,
  `upload_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`enrollment_id`),
  KEY `fk_enroll_children` (`child_id`),
  KEY `fk_enroll_parents` (`parent_id`),
  KEY `fk_enroll_uploads` (`upload_id`),
  CONSTRAINT `fk_enroll_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `fk_enroll_parents` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `fk_enroll_uploads` FOREIGN KEY (`upload_id`) REFERENCES `uploads` (`upload_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.files
DROP TABLE IF EXISTS `files`;
CREATE TABLE IF NOT EXISTS `files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `child_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `center_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`file_id`),
  KEY `fk_files_centers` (`center_id`),
  KEY `fk_files_children` (`child_id`),
  KEY `fk_files_teachers` (`teacher_id`),
  CONSTRAINT `fk_files_centers` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`),
  CONSTRAINT `fk_files_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `fk_files_teachers` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.health_evaluations
DROP TABLE IF EXISTS `health_evaluations`;
CREATE TABLE IF NOT EXISTS `health_evaluations` (
  `health_eval_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `hair` text,
  `eye` text,
  `evaluated_by` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `mouth` text,
  `tooth` text,
  `ear` text,
  `nose` text,
  `skin` text,
  `nail` text,
  PRIMARY KEY (`health_eval_id`),
  KEY `fk_health_children` (`child_id`),
  KEY `fk_health_teachers` (`evaluated_by`),
  CONSTRAINT `fk_health_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `fk_health_teachers` FOREIGN KEY (`evaluated_by`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.lunch_summaries
DROP TABLE IF EXISTS `lunch_summaries`;
CREATE TABLE IF NOT EXISTS `lunch_summaries` (
  `lunch_summary_id` int NOT NULL AUTO_INCREMENT,
  `menu_id` int DEFAULT NULL,
  `summary_date` date DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `note` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`lunch_summary_id`),
  KEY `fk_lunch_menus` (`menu_id`),
  KEY `fk_lunch_teachers` (`teacher_id`),
  CONSTRAINT `fk_lunch_menus` FOREIGN KEY (`menu_id`) REFERENCES `menus` (`menu_id`),
  CONSTRAINT `fk_lunch_teachers` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.menus
DROP TABLE IF EXISTS `menus`;
CREATE TABLE IF NOT EXISTS `menus` (
  `menu_id` int NOT NULL AUTO_INCREMENT,
  `menu_type_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`menu_id`),
  KEY `fk_menus_menutypes` (`menu_type_id`),
  CONSTRAINT `fk_menus_menutypes` FOREIGN KEY (`menu_type_id`) REFERENCES `menu_types` (`menu_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.menu_types
DROP TABLE IF EXISTS `menu_types`;
CREATE TABLE IF NOT EXISTS `menu_types` (
  `menu_type_id` int NOT NULL AUTO_INCREMENT,
  `menu_type` varchar(100) DEFAULT NULL,
  `description` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`menu_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.monthly_measurements
DROP TABLE IF EXISTS `monthly_measurements`;
CREATE TABLE IF NOT EXISTS `monthly_measurements` (
  `measurement_id` int NOT NULL AUTO_INCREMENT,
  `measurement_date` date DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `note` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `child_id` int DEFAULT NULL,
  PRIMARY KEY (`measurement_id`),
  KEY `fk_monthly_children` (`child_id`),
  CONSTRAINT `fk_monthly_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.parents
DROP TABLE IF EXISTS `parents`;
CREATE TABLE IF NOT EXISTS `parents` (
  `parent_id` int NOT NULL AUTO_INCREMENT,
  `parent_code` varchar(50) DEFAULT NULL,
  `prefix` varchar(20) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `salary` decimal(10,2) DEFAULT NULL,
  `job` varchar(100) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`parent_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.relation
DROP TABLE IF EXISTS `relation`;
CREATE TABLE IF NOT EXISTS `relation` (
  `relation_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `relationship` varchar(50) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`relation_id`),
  KEY `fk_relation_children` (`child_id`),
  KEY `fk_relation_parents` (`parent_id`),
  CONSTRAINT `fk_relation_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `fk_relation_parents` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.teachers
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE IF NOT EXISTS `teachers` (
  `teacher_id` int NOT NULL AUTO_INCREMENT,
  `teacher_code` varchar(50) DEFAULT NULL,
  `prefix` varchar(20) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `classroom_id` int DEFAULT NULL,
  `center_id` int DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`teacher_id`),
  KEY `fk_teachers_centers` (`center_id`),
  KEY `fk_teachers_classrooms` (`classroom_id`),
  CONSTRAINT `fk_teachers_centers` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`),
  CONSTRAINT `fk_teachers_classrooms` FOREIGN KEY (`classroom_id`) REFERENCES `classrooms` (`classroom_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.uploads
DROP TABLE IF EXISTS `uploads`;
CREATE TABLE IF NOT EXISTS `uploads` (
  `upload_id` int NOT NULL AUTO_INCREMENT,
  `child_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `file_name` varchar(255) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `file_type` varchar(50) DEFAULT NULL,
  `description` text,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`upload_id`),
  KEY `fk_uploads_children` (`child_id`),
  KEY `fk_uploads_parents` (`parent_id`),
  KEY `fk_uploads_teachers` (`teacher_id`),
  CONSTRAINT `fk_uploads_children` FOREIGN KEY (`child_id`) REFERENCES `children` (`child_id`),
  CONSTRAINT `fk_uploads_parents` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `fk_uploads_teachers` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

-- Dumping structure for table carechild_db.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `center_id` int DEFAULT NULL,
  `teacher_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  KEY `fk_users_centers` (`center_id`),
  KEY `fk_users_teachers` (`teacher_id`),
  KEY `fk_users_parents` (`parent_id`),
  CONSTRAINT `fk_users_centers` FOREIGN KEY (`center_id`) REFERENCES `centers` (`center_id`),
  CONSTRAINT `fk_users_parents` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`parent_id`),
  CONSTRAINT `fk_users_teachers` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`teacher_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
