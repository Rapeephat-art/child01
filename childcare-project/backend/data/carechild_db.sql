
-- carechild_full_schema.sql
-- Full schema (22 tables) for ER Diagram and production use
-- Engine: MySQL / InnoDB

SET FOREIGN_KEY_CHECKS = 0;

-- =====================
-- Centers
-- =====================
CREATE TABLE centers (
  center_id INT AUTO_INCREMENT PRIMARY KEY,
  school_id VARCHAR(50),
  name VARCHAR(255),
  district VARCHAR(100),
  province VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  LGO VARCHAR(100),
  ORG_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Classrooms
-- =====================
CREATE TABLE classrooms (
  classroom_id INT AUTO_INCREMENT PRIMARY KEY,
  center_id INT NOT NULL,
  classroom_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(center_id)
);

-- =====================
-- Teachers
-- =====================
CREATE TABLE teachers (
  teacher_id INT AUTO_INCREMENT PRIMARY KEY,
  center_id INT NOT NULL,
  classroom_id INT,
  prefix VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(center_id),
  FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id)
);

-- =====================
-- Parents
-- =====================
CREATE TABLE parents (
  parent_id INT AUTO_INCREMENT PRIMARY KEY,
  prefix VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  job VARCHAR(100),
  salary DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Children (Student Registry)
-- =====================
CREATE TABLE children (
  child_id INT AUTO_INCREMENT PRIMARY KEY,
  child_code VARCHAR(50),
  classroom_id INT,
  prefix VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  nickname VARCHAR(100),
  gender VARCHAR(10),
  birth_date DATE,
  citizen_id VARCHAR(13),
  ethnicity VARCHAR(50),
  nationality VARCHAR(50),
  religion VARCHAR(50),
  blood VARCHAR(10),
  treatment TEXT,
  reimbursement VARCHAR(100),
  vaccine TEXT,
  eat TEXT,
  needs TEXT,
  enter_study DATE,
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (classroom_id) REFERENCES classrooms(classroom_id)
);

-- =====================
-- Relation (M:N children <-> parents)
-- =====================
CREATE TABLE relation (
  relation_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT NOT NULL,
  parent_id INT NOT NULL,
  relationship VARCHAR(50),
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (parent_id) REFERENCES parents(parent_id)
);

-- =====================
-- Addresses
-- =====================
CREATE TABLE addresses (
  address_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  parent_id INT,
  address_type ENUM(
    'ทะเบียนบ้าน',
    'ที่อยู่ปัจจุบัน',
    'ที่อยู่ผู้ปกครอง',
    'ที่อยู่เด็ก',
    'ที่อยู่ติดต่อ'
  ),
  house_no VARCHAR(50),
  village VARCHAR(100),
  subdistrict VARCHAR(100),
  district VARCHAR(100),
  province VARCHAR(100),
  postal_code VARCHAR(10),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (parent_id) REFERENCES parents(parent_id)
);

-- =====================
-- Users (Auth)
-- =====================
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin','teacher','parent'),
  teacher_id INT,
  parent_id INT,
  center_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
  FOREIGN KEY (parent_id) REFERENCES parents(parent_id),
  FOREIGN KEY (center_id) REFERENCES centers(center_id)
);

-- =====================
-- Enrollments (Application)
-- =====================
CREATE TABLE enrollments (
  enrollment_id INT AUTO_INCREMENT PRIMARY KEY,
  parent_id INT NOT NULL,
  center_id INT NOT NULL,
  status VARCHAR(20),
  note TEXT,
  parent_phone VARCHAR(20),
  extra_json JSON,
  files_json JSON,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES parents(parent_id),
  FOREIGN KEY (center_id) REFERENCES centers(center_id)
);

-- =====================
-- Admissions (Confirmation)
-- =====================
CREATE TABLE admissions (
  admission_id INT AUTO_INCREMENT PRIMARY KEY,
  enrollment_id INT NOT NULL,
  child_id INT NOT NULL,
  parent_id INT NOT NULL,
  confirmed_by INT,
  confirmed_at DATE,
  note TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(enrollment_id),
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (parent_id) REFERENCES parents(parent_id),
  FOREIGN KEY (confirmed_by) REFERENCES teachers(teacher_id)
);

-- =====================
-- Attendance
-- =====================
CREATE TABLE attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  teacher_id INT,
  date DATE,
  status ENUM('มา','ลา','ขาด'),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- =====================
-- Lunch Records
-- =====================
CREATE TABLE lunch_records (
  lunch_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  teacher_id INT,
  date DATE,
  status ENUM('มา','ลา','ขาด'),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- =====================
-- Milk Records
-- =====================
CREATE TABLE milk_records (
  milk_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  teacher_id INT,
  date DATE,
  status ENUM('มา','ลา','ขาด'),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- =====================
-- Toothbrush Records
-- =====================
CREATE TABLE toothbrush_records (
  toothbrush_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  teacher_id INT,
  date DATE,
  status ENUM('มา','ลา','ขาด'),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- =====================
-- Health Evaluations
-- =====================
CREATE TABLE health_evaluations (
  health_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  teacher_id INT,
  evaluation_date DATE,
  hair VARCHAR(50),
  eye VARCHAR(50),
  mouth VARCHAR(50),
  tooth VARCHAR(50),
  ear VARCHAR(50),
  nose VARCHAR(50),
  skin VARCHAR(50),
  nail VARCHAR(50),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- =====================
-- Monthly Measurements
-- =====================
CREATE TABLE monthly_measurements (
  measurement_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  teacher_id INT,
  measurement_date DATE,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  note TEXT,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id)
);

-- =====================
-- Child Food Allergies
-- =====================
CREATE TABLE child_food_allergies (
  allergy_id INT AUTO_INCREMENT PRIMARY KEY,
  child_id INT,
  food_name VARCHAR(100),
  reaction VARCHAR(100),
  severity VARCHAR(50),
  note TEXT,
  FOREIGN KEY (child_id) REFERENCES children(child_id)
);

-- =====================
-- Daily Menu
-- =====================
CREATE TABLE daily_menu (
  daily_menu_id INT AUTO_INCREMENT PRIMARY KEY,
  center_id INT,
  menu_date DATE,
  main_menu VARCHAR(255),
  stir_menu VARCHAR(255),
  soup_menu VARCHAR(255),
  fried_menu VARCHAR(255),
  dessert_menu VARCHAR(255),
  note TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_by INT,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (center_id) REFERENCES centers(center_id),
  FOREIGN KEY (created_by) REFERENCES teachers(teacher_id),
  FOREIGN KEY (updated_by) REFERENCES teachers(teacher_id)
);

-- =====================
-- Evaluation Sessions
-- =====================
CREATE TABLE evaluation_sessions (
  session_id INT AUTO_INCREMENT PRIMARY KEY,
  evaluation_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Evaluation Scores
-- =====================
CREATE TABLE evaluation_scores (
  score_id INT AUTO_INCREMENT PRIMARY KEY,
  session_id INT,
  child_id INT,
  score TINYINT,
  FOREIGN KEY (session_id) REFERENCES evaluation_sessions(session_id),
  FOREIGN KEY (child_id) REFERENCES children(child_id)
);

-- =====================
-- Announcements
-- =====================
CREATE TABLE announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  center_id INT,
  title VARCHAR(255),
  content TEXT,
  image_url VARCHAR(255),
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (center_id) REFERENCES centers(center_id)
);

-- =====================
-- Uploads
-- =====================
CREATE TABLE uploads (
  upload_id INT AUTO_INCREMENT PRIMARY KEY,
  file_name VARCHAR(255),
  file_path VARCHAR(255),
  child_id INT,
  parent_id INT,
  teacher_id INT,
  center_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (child_id) REFERENCES children(child_id),
  FOREIGN KEY (parent_id) REFERENCES parents(parent_id),
  FOREIGN KEY (teacher_id) REFERENCES teachers(teacher_id),
  FOREIGN KEY (center_id) REFERENCES centers(center_id)
);

SET FOREIGN_KEY_CHECKS = 1;
