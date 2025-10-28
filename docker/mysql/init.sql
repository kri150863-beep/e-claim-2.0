-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Oct 24, 2025 at 06:29 AM
-- Server version: 9.1.0
-- PHP Version: 8.2.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `garage_db`
--
CREATE DATABASE IF NOT EXISTS `garage_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `garage_db`;

-- --------------------------------------------------------

--
-- Table structure for table `additional_labour_details`
--

DROP TABLE IF EXISTS `additional_labour_details`;
CREATE TABLE IF NOT EXISTS `additional_labour_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estimate_of_repairs_id` int NOT NULL,
  `eor_or_surveyor` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `painting_cost` decimal(10,2) DEFAULT NULL,
  `painting_materiels` decimal(10,2) DEFAULT NULL,
  `sundries` decimal(10,2) DEFAULT NULL,
  `num_of_repaire_days` int DEFAULT NULL,
  `discount_add_labour` decimal(5,2) DEFAULT NULL,
  `vat` decimal(5,2) DEFAULT NULL,
  `add_labour_total` decimal(10,2) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `additional_labour_details`
--

INSERT INTO `additional_labour_details` (`id`, `estimate_of_repairs_id`, `eor_or_surveyor`, `painting_cost`, `painting_materiels`, `sundries`, `num_of_repaire_days`, `discount_add_labour`, `vat`, `add_labour_total`, `created_at`, `updated_at`) VALUES
(1, 1, 'eor', 1200.00, 300.00, 50.00, 3, 100.00, 15.00, 1557.50, '2025-08-21 09:50:40', '2025-08-21 09:50:40'),
(2, 2, 'surveyor', 800.00, 200.00, 30.00, 2, 50.00, 0.00, 980.00, '2025-08-21 09:50:40', '2025-08-21 09:50:40'),
(3, 3, 'eor', 500.00, 100.00, 20.00, 1, 0.00, 15.00, 690.50, '2025-08-21 09:50:40', '2025-08-21 09:50:40'),
(4, 1, 'surveyor', 1500.00, 400.00, 70.00, 4, 200.00, 15.00, 2062.50, '2025-08-21 09:50:40', '2025-08-21 09:50:40'),
(5, 4, 'surveyor', 1500.00, 400.00, 70.00, 4, 200.00, 15.00, 2062.50, '2025-08-21 09:50:40', '2025-08-21 09:50:40'),
(6, 5, 'surveyor', 1500.00, 400.00, 70.00, 4, 200.00, 15.00, 2062.50, '2025-08-21 09:50:40', '2025-08-21 09:50:40');

-- --------------------------------------------------------

--
-- Table structure for table `estimate_of_repair`
--

DROP TABLE IF EXISTS `estimate_of_repair`;
CREATE TABLE IF NOT EXISTS `estimate_of_repair` (
  `id` int NOT NULL AUTO_INCREMENT,
  `claim_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `remarks` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `estimate_of_repair`
--

INSERT INTO `estimate_of_repair` (`id`, `claim_number`, `remarks`, `created_at`, `updated_at`) VALUES
(1, 'M0119926', 'Remplacement pare-chocs avant et peinture', '2025-08-01 06:30:00', '2025-08-01 06:30:00'),
(2, 'M0119928', 'Changement des phares et réglage capot', '2025-08-05 08:15:00', '2025-08-05 08:15:00'),
(3, 'M0119929', 'Réparation portière gauche + remplacement vitre', '2025-08-10 11:45:00', '2025-08-10 11:45:00'),
(4, 'M0119934', 'Peinture capot + débosselage léger', '2025-08-15 07:20:00', '2025-08-15 07:20:00'),
(5, 'M0119935', 'Changement pare-brise et révision mécanique', '2025-08-18 13:00:00', '2025-08-18 13:00:00'),
(6, 'M0119922', NULL, '2025-08-26 20:53:45', '2025-08-26 20:53:45'),
(7, 'M0119924', NULL, '2025-08-26 20:59:06', '2025-08-26 20:59:06');

-- --------------------------------------------------------

--
-- Table structure for table `labour_details`
--

DROP TABLE IF EXISTS `labour_details`;
CREATE TABLE IF NOT EXISTS `labour_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `part_detail_id` int NOT NULL,
  `eor_or_surveyor` enum('EOR','SURVEYOR') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `activity` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `number_of_hours` decimal(5,2) DEFAULT '0.00',
  `discount_labour` decimal(10,2) DEFAULT '0.00',
  `vat_labour` enum('0','15') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '15',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `hourly_cost_labour` decimal(10,2) DEFAULT '0.00',
  `labour_total` decimal(12,2) GENERATED ALWAYS AS ((((`number_of_hours` * `hourly_cost_labour`) - `discount_labour`) * (1 + (cast(`vat_labour` as decimal(10,0)) / 100)))) STORED,
  PRIMARY KEY (`id`),
  KEY `fk_labour_part` (`part_detail_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `labour_details`
--

INSERT INTO `labour_details` (`id`, `part_detail_id`, `eor_or_surveyor`, `activity`, `number_of_hours`, `discount_labour`, `vat_labour`, `created_at`, `updated_at`, `hourly_cost_labour`) VALUES
(1, 1, 'EOR', 'Installation', 3.00, 20.00, '15', '2025-08-01 07:00:00', '2025-08-27 08:01:01', 100.00),
(2, 2, 'SURVEYOR', 'Installation', 2.00, 0.00, '15', '2025-08-01 08:00:00', '2025-08-27 08:00:49', 100.00),
(3, 3, 'EOR', 'Maintenance', 1.50, 20.00, '15', '2025-08-05 09:00:00', '2025-08-27 08:01:48', 100.00),
(4, 4, 'EOR', 'Maintenance', 1.50, 20.00, '15', '2025-08-05 09:30:00', '2025-08-27 07:57:52', 100.00),
(5, 5, 'SURVEYOR', 'Installation', 4.00, 30.00, '15', '2025-08-10 12:20:00', '2025-08-27 08:39:34', 200.00),
(6, 6, 'EOR', 'Installation', 2.00, 0.00, '15', '2025-08-10 12:30:00', '2025-08-27 08:39:23', 140.00),
(7, 7, 'SURVEYOR', 'Repair', 3.50, 20.00, '15', '2025-08-15 08:00:00', '2025-08-27 08:39:42', 0.00),
(8, 8, 'EOR', 'Repair', 2.50, 10.00, '15', '2025-08-15 08:20:00', '2025-08-27 08:39:49', 0.00),
(9, 9, 'EOR', 'Installation', 3.00, 250.00, '15', '2025-08-18 14:00:00', '2025-08-27 08:39:54', 0.00),
(10, 10, 'SURVEYOR', 'Installation', 1.00, 0.00, '15', '2025-08-18 14:10:00', '2025-08-27 08:39:59', 0.00),
(11, 11, 'EOR', 'Maintenance', 2.50, 0.00, '', '2025-08-26 08:00:00', '2025-08-27 08:40:08', 45.00),
(12, 12, 'SURVEYOR', 'Maintenance', 1.50, 5.00, '', '2025-08-26 08:05:00', '2025-08-27 08:40:14', 40.00);

-- --------------------------------------------------------

--
-- Table structure for table `part_details`
--

DROP TABLE IF EXISTS `part_details`;
CREATE TABLE IF NOT EXISTS `part_details` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estimate_of_repair_id` int NOT NULL,
  `part_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `part_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `unit_price` decimal(10,2) DEFAULT '0.00',
  `quantity` int DEFAULT '1',
  `discount_part` decimal(10,2) DEFAULT '0.00',
  `vat_part` enum('0','15') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '15',
  `part_total` decimal(12,2) GENERATED ALWAYS AS ((((`unit_price` * `quantity`) - `discount_part`) * (1 + (cast(`vat_part` as decimal(10,0)) / 100)))) STORED,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `quality` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Standard',
  `cost_part` float NOT NULL,
  `supplier` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_part_estimate` (`estimate_of_repair_id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `part_details`
--

INSERT INTO `part_details` (`id`, `estimate_of_repair_id`, `part_name`, `part_number`, `unit_price`, `quantity`, `discount_part`, `vat_part`, `created_at`, `updated_at`, `quality`, `cost_part`, `supplier`) VALUES
(1, 1, 'Pare-chocs avant', 'PC-TOY-001', 4500.00, 1, 500.00, '15', '2025-08-01 06:45:00', '2025-08-21 11:57:19', 'Premium', 3299, 'Garage TGE'),
(2, 1, 'Peinture métallisée', 'PNT-TOY-045', 1200.00, 1, 0.00, '15', '2025-08-01 06:46:00', '2025-08-21 12:00:43', 'Premium', 237, 'Garage tieu'),
(3, 2, 'Phare gauche', 'PHR-HON-210', 3200.00, 1, 20.00, '15', '2025-08-05 08:20:00', '2025-08-27 08:41:24', 'Standard', 3400, 'Garage TGE'),
(4, 2, 'Phare droit', 'PHR-HON-211', 3200.00, 1, 20.00, '15', '2025-08-05 08:21:00', '2025-08-27 08:41:21', 'Standard', 2800, 'Garage TGE'),
(5, 3, 'Portière gauche', 'PRT-NIS-334', 9500.00, 1, 500.00, '15', '2025-08-10 11:50:00', '2025-08-27 08:40:36', 'Economy', 289, ''),
(6, 3, 'Vitre portière gauche', 'VTR-NIS-335', 2800.00, 1, 0.00, '15', '2025-08-10 11:52:00', '2025-08-27 08:40:41', 'Economy', 2893, ''),
(7, 4, 'Capot', 'CPT-MAZ-112', 5000.00, 1, 30.00, '15', '2025-08-15 07:25:00', '2025-08-27 08:41:18', 'Premium', 3000, ''),
(8, 4, 'Peinture capot', 'PNT-MAZ-113', 1200.00, 1, 0.00, '15', '2025-08-15 07:26:00', '2025-08-27 08:40:48', 'Premium', 2000, ''),
(9, 5, 'Pare-brise', 'PBS-BMW-900', 13500.00, 1, 10.00, '15', '2025-08-18 13:05:00', '2025-08-27 08:41:14', 'Standard', 1000, ''),
(10, 5, 'Balais d\'essuie-glace', 'ESS-BMW-901', 1800.00, 1, 10.00, '15', '2025-08-18 13:06:00', '2025-08-27 08:41:11', 'Standard', 12000, ''),
(11, 6, 'Front Bumper', 'FB-2025-01', 150.00, 1, 10.00, '15', '2025-08-26 07:00:00', '2025-08-27 08:41:45', 'OEM', 150, 'Toyota Supplier Ltd'),
(12, 7, 'Left Headlight', 'HL-2025-09', 90.00, 2, 10.00, '15', '2025-08-26 07:05:00', '2025-08-27 08:41:50', 'Aftermarket', 180, 'AutoParts Co.');
--
-- Database: `scs_db`
--
CREATE DATABASE IF NOT EXISTS `scs_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `scs_db`;

-- --------------------------------------------------------

--
-- Table structure for table `business_development_contacts`
--

DROP TABLE IF EXISTS `business_development_contacts`;
CREATE TABLE IF NOT EXISTS `business_development_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `portable` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `business_development_contacts`
--

INSERT INTO `business_development_contacts` (`id`, `name`, `email`, `phone`, `portable`) VALUES
(1, 'John smith', 'rm@swancapitalsolutions.com', '(+230) 564 7834', '(+230) 5467 9087');

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
CREATE TABLE IF NOT EXISTS `contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `bd_name` varchar(50) NOT NULL,
  `bd_email` varchar(50) NOT NULL,
  `bd_phone` varchar(50) NOT NULL,
  `bd_portable` varchar(50) NOT NULL,
  `sc_address` varchar(50) NOT NULL,
  `sc_email` varchar(50) NOT NULL,
  `sc_phone` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `bd_name`, `bd_email`, `bd_phone`, `bd_portable`, `sc_address`, `sc_email`, `sc_phone`) VALUES
(1, 'John smith', 'rm@swancapitalsolutions.com', '(+230) 5467 9087', '(+230) 3 6263 6813', '10 Intendance street, Port Louis', 'info@swanforlife.com', '(+230) 52376236');

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

DROP TABLE IF EXISTS `currency`;
CREATE TABLE IF NOT EXISTS `currency` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_ccy` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`id`, `type_ccy`) VALUES
(1, 'USD'),
(2, 'MUR');

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
CREATE TABLE IF NOT EXISTS `document` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL,
  `path` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_id` (`users_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`id`, `users_id`, `name`, `date`, `path`) VALUES
(1, 5, 'Mauritian ID Car.pdf', '2025-09-15 09:45:53', 'Mauritian ID Car.pdf'),
(2, 5, 'proof of source of fund.pdf', '2025-09-15 09:50:42', 'proof of source of fund.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `document_category`
--

DROP TABLE IF EXISTS `document_category`;
CREATE TABLE IF NOT EXISTS `document_category` (
  `id` int NOT NULL,
  `category_code` varchar(250) NOT NULL,
  `category_name` varchar(250) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `document_category`
--

INSERT INTO `document_category` (`id`, `category_code`, `category_name`) VALUES
(1, 'statements', 'statements'),
(2, 'factssheets', 'factssheets'),
(3, 'contract-notes', 'Lettre de motivation'),
(4, 'devidend-notices', 'devidend-notices');

-- --------------------------------------------------------

--
-- Table structure for table `document_fund`
--

DROP TABLE IF EXISTS `document_fund`;
CREATE TABLE IF NOT EXISTS `document_fund` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(250) NOT NULL,
  `path` varchar(250) NOT NULL,
  `created_at` datetime NOT NULL,
  `fund_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fund_id` (`fund_id`) USING BTREE,
  KEY `category_id` (`category_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `document_fund`
--

INSERT INTO `document_fund` (`id`, `name`, `path`, `created_at`, `fund_id`, `category_id`) VALUES
(1, 'Passeport', 'test.xlsx', '2025-09-26 10:00:00', 15, 1),
(2, 'Curriculum Vitae', 'test_doc_statement.pdf', '2025-09-26 10:05:00', 16, 2),
(11, 'Curriculum Vitae', 'test_doc_statement.pdf', '2025-09-26 10:05:00', 16, 2),
(3, 'Lettre de motivation', 'test_doc_statement.pdf', '2025-09-26 10:07:00', 16, 3),
(4, 'Diplôme Licence', 'test_doc_statement.pdf', '2025-09-26 11:00:00', 19, 4),
(5, 'Contrat de travail', 'test_doc_statement.pdf', '2025-09-26 11:15:00', 15, 4),
(6, 'Facture électricité', 'test_doc_statement.pdf', '2025-09-26 12:00:00', 15, 1),
(7, 'Relevé bancaire', 'test_doc_statement.pdf', '2025-09-26 12:10:00', 16, 4),
(8, 'Photo identité', 'test_doc_statement.pdf', '2025-09-26 12:20:00', 19, 3),
(9, 'Certificat médical', 'test_doc_statement.pdf', '2025-09-26 13:00:00', 15, 2),
(10, 'Avis d’imposition', 'test.xlsx', '2025-09-26 13:30:00', 16, 2);

-- --------------------------------------------------------

--
-- Table structure for table `forex_rate`
--

DROP TABLE IF EXISTS `forex_rate`;
CREATE TABLE IF NOT EXISTS `forex_rate` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `forex_rate`
--

INSERT INTO `forex_rate` (`id`, `type`, `value`) VALUES
(1, 'USD', 45.7854),
(2, 'EUR', 50.7854),
(3, 'GBP', 58.7574);

-- --------------------------------------------------------

--
-- Table structure for table `fund`
--

DROP TABLE IF EXISTS `fund`;
CREATE TABLE IF NOT EXISTS `fund` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `reference` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `fund_name` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `no_of_shares` float NOT NULL,
  `total_amount_ccy` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `total_amount_mur` float NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fund`
--

INSERT INTO `fund` (`id`, `user_id`, `reference`, `fund_name`, `no_of_shares`, `total_amount_ccy`, `total_amount_mur`, `created_at`) VALUES
(15, 5, 'SMMF192', 'Swan Money Market Fund(MUR)', 1345, 'MUR 88320.00', 88320, '2024-09-01 10:42:02'),
(16, 5, 'SIF191', 'Swan Income Fund', 10000, 'USD 10130.00', 455850, '2025-06-02 10:28:02'),
(19, 5, 'SM193', 'Swan Money - GBP', 1120, 'MUR 88320.00', 88320, '2025-08-07 10:28:02');

-- --------------------------------------------------------

--
-- Table structure for table `nav_funds`
--

DROP TABLE IF EXISTS `nav_funds`;
CREATE TABLE IF NOT EXISTS `nav_funds` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code_name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `currency` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `value` float NOT NULL,
  `fund_id` int NOT NULL,
  `nav_date` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nav_funds`
--

INSERT INTO `nav_funds` (`id`, `code_name`, `currency`, `value`, `fund_id`, `nav_date`) VALUES
(1, 'SFE', 'MUR', 35.63, 15, '2024-05-18 13:31:18'),
(2, 'SEMEF', 'MUR', 11.11, 15, '2025-08-25 13:33:08'),
(3, 'SIF', 'USD', 10.13, 16, '2025-08-15 13:33:01'),
(4, 'MMF', 'USD', 102.13, 16, '2025-09-07 13:33:01'),
(5, 'SPE', 'USD', 11.49, 16, '2025-07-13 13:33:01'),
(6, 'MMF', 'MUR', 58.88, 15, '2024-05-25 13:33:01'),
(7, 'SFE', 'GBP', 12.1, 19, '2025-02-22 13:33:01'),
(8, 'SEF', 'MUR', 102.35, 15, '2024-05-01 00:00:00'),
(9, 'SSE', 'MUR', 104.2, 15, '2024-05-05 00:00:00'),
(10, 'FSE', 'MUR', 107.15, 15, '2024-05-22 13:31:44'),
(11, 'SSR', 'MUR', 110.5, 15, '2025-08-05 00:00:00'),
(12, 'FRE', 'MUR', 115.75, 15, '2025-09-05 00:00:00'),
(13, 'EEF', 'MUR', 112.3, 15, '2025-06-05 00:00:00'),
(14, 'SSF', 'USD', 50.1, 16, '2024-07-11 00:00:00'),
(16, 'FFS', 'USD', 65.25, 16, '2024-07-14 00:00:00'),
(17, 'SSD', 'USD', 20.4, 16, '2024-07-20 00:00:00'),
(18, 'RDS', 'USD', 78.1, 16, '2025-07-24 00:00:00'),
(19, 'DSS', 'USD', 55.2, 16, '2024-07-28 00:00:00'),
(20, 'FSE', 'GBP', 75.25, 19, '2024-11-05 00:00:00'),
(21, 'EFS', 'GBP', 34.1, 19, '2024-11-23 00:00:00'),
(22, 'FSE', 'GBP', 79.8, 19, '2024-11-11 00:00:00'),
(23, 'SSR', 'GBP', 82.5, 19, '2024-11-14 00:00:00'),
(24, 'TFE', 'GBP', 100.3, 19, '2025-03-01 00:00:00'),
(25, 'RFE', 'GBP', 88.9, 19, '2025-07-15 00:00:00'),
(26, 'SMMF192', 'MUR', 12.5, 15, '2025-09-01 00:00:00'),
(27, 'SMMF192', 'MUR', 47.75, 15, '2025-09-05 00:00:00'),
(28, 'SMMF192', 'MUR', 54.85, 15, '2025-09-07 00:00:00'),
(29, 'SMMF192', 'MUR', 90, 15, '2025-09-08 00:00:00'),
(30, 'SMMF', 'USD', 33.75, 16, '2025-09-05 00:00:00'),
(31, 'SMMF', 'USD', 12.85, 16, '2025-09-15 00:00:00'),
(32, 'SMMF', 'USD', 78, 16, '2025-09-25 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `swan_centre_contacts`
--

DROP TABLE IF EXISTS `swan_centre_contacts`;
CREATE TABLE IF NOT EXISTS `swan_centre_contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `address` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `swan_centre_contacts`
--

INSERT INTO `swan_centre_contacts` (`id`, `address`, `email`, `phone`) VALUES
(1, '10 Intendance street, Port Louis', 'info@swanforlife.com', '(+230) 52376236');

-- --------------------------------------------------------

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
CREATE TABLE IF NOT EXISTS `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fund_id` int NOT NULL,
  `type_id` int NOT NULL,
  `cn_number` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `no_of_units` float NOT NULL,
  `currency` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `net_amount_inv_redeemed` float NOT NULL,
  `transaction_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_transaction_type` (`type_id`),
  KEY `fk_transaction_type_fund` (`fund_id`)
) ENGINE=MyISAM AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction`
--

INSERT INTO `transaction` (`id`, `fund_id`, `type_id`, `cn_number`, `no_of_units`, `currency`, `net_amount_inv_redeemed`, `transaction_date`) VALUES
(1, 15, 1, 'CN097', 1000, 'MUR', 10130, '2025-09-01 11:06:12'),
(2, 16, 2, 'CN026', 11000, 'USD', 1123430, '2025-09-11 07:07:49'),
(3, 19, 3, 'CN023', 55000, 'USD', 557150, '2025-09-11 07:07:49'),
(4, 15, 1, 'CN097', 1000, 'MUR', 10130, '2024-01-29 11:06:12'),
(5, 16, 2, 'CN095', 10000, 'MUR', 356300, '2024-01-28 10:15:20'),
(6, 19, 3, 'CN051', 11000, 'USD', 1123430, '2024-01-20 09:30:00'),
(7, 16, 4, 'CN026', 100, 'MUR', 3563, '2024-01-20 14:25:00'),
(8, 15, 5, 'CN023', 55000, 'USD', 557150, '2024-01-20 17:00:00'),
(9, 19, 6, 'CN016', 27000, 'USD', 2757510, '2024-01-17 15:42:30'),
(10, 15, 3, 'CN077', 1000, 'USD', 10130, '2024-01-16 12:11:45'),
(11, 15, 4, 'CN025', 55000, 'USD', 557150, '2024-01-11 09:23:12'),
(12, 16, 6, 'CN006', 10000, 'MUR', 356300, '2024-01-10 10:05:00'),
(13, 19, 5, 'CN896', 11000, 'USD', 1123430, '2024-01-10 08:40:10'),
(14, 15, 1, 'CN201', 2000, 'USD', 20000, '2024-02-01 09:00:00'),
(15, 19, 2, 'CN202', 15000, 'USD', 1500000, '2024-02-02 11:10:20'),
(16, 16, 3, 'CN203', 1200, 'MUR', 400000, '2024-02-03 13:50:33'),
(17, 15, 4, 'CN204', 500, 'USD', 5000, '2024-02-04 15:30:10'),
(18, 15, 5, 'CN205', 8000, 'USD', 75000, '2024-02-05 16:05:55'),
(19, 19, 6, 'CN206', 25000, 'USD', 2600000, '2024-02-06 09:12:00'),
(20, 15, 3, 'CN207', 700, 'USD', 8000, '2024-02-07 08:00:00'),
(21, 16, 4, 'CN208', 900, 'MUR', 310000, '2024-02-08 12:15:00'),
(22, 15, 5, 'CN209', 6000, 'USD', 65000, '2024-02-09 14:30:00'),
(23, 19, 2, 'CN210', 14000, 'USD', 1400000, '2024-02-10 17:45:00'),
(24, 16, 6, 'CN211', 10000, 'MUR', 400000, '2024-02-11 09:05:05'),
(25, 15, 1, 'CN212', 3000, 'USD', 32000, '2024-02-12 10:20:10'),
(26, 19, 5, 'CN213', 5000, 'USD', 52000, '2024-02-13 11:35:15'),
(27, 16, 4, 'CN214', 200, 'MUR', 80000, '2024-02-14 13:50:00'),
(28, 15, 3, 'CN215', 400, 'USD', 4500, '2024-02-15 15:10:00'),
(29, 19, 2, 'CN216', 17000, 'USD', 1700000, '2024-02-16 16:25:00'),
(30, 16, 6, 'CN217', 15000, 'MUR', 600000, '2024-02-17 09:40:00'),
(31, 15, 5, 'CN218', 9000, 'USD', 95000, '2024-02-18 11:55:00'),
(32, 19, 1, 'CN219', 1000, 'USD', 10000, '2024-02-19 14:00:00'),
(33, 16, 2, 'CN220', 8000, 'MUR', 300000, '2024-02-20 10:30:00'),
(34, 15, 6, 'CN221', 7500, 'USD', 85000, '2024-02-21 12:15:00'),
(35, 19, 3, 'CN222', 6500, 'USD', 72000, '2024-02-22 09:45:00'),
(36, 16, 5, 'CN223', 5600, 'MUR', 220000, '2024-02-23 08:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `transaction_type`
--

DROP TABLE IF EXISTS `transaction_type`;
CREATE TABLE IF NOT EXISTS `transaction_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transaction_type`
--

INSERT INTO `transaction_type` (`id`, `code`, `name`) VALUES
(1, 'redemption', 'Redemption'),
(2, 'new_investment', 'New investment'),
(3, 'gifts', 'Gifts'),
(4, 'switch_out', 'Switch out'),
(5, 'switch_in', 'Switch in'),
(6, 'additional_investment', 'Additional investment');
--
-- Database: `surveyor_db`
--
CREATE DATABASE IF NOT EXISTS `surveyor_db` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `surveyor_db`;

-- --------------------------------------------------------

--
-- Table structure for table `additional_labour_detail`
--

DROP TABLE IF EXISTS `additional_labour_detail`;
CREATE TABLE IF NOT EXISTS `additional_labour_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estimate_of_repair_id` int DEFAULT NULL,
  `painting_cost` float NOT NULL,
  `painting_materiels` float NOT NULL,
  `sundries` float NOT NULL,
  `num_of_repaire_days` int NOT NULL,
  `discount_add_labour` float NOT NULL,
  `vat` enum('0','15') NOT NULL,
  `add_labour_total` float DEFAULT NULL,
  `eor_or_surveyor` enum('eor','surveyor') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_additional_labour_detail_estimate_of_repair1_idx` (`estimate_of_repair_id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `additional_labour_detail`
--

INSERT INTO `additional_labour_detail` (`id`, `estimate_of_repair_id`, `painting_cost`, `painting_materiels`, `sundries`, `num_of_repaire_days`, `discount_add_labour`, `vat`, `add_labour_total`, `eor_or_surveyor`) VALUES
(21, 54, 1200, 300, 50, 3, 100, '15', 1667.5, 'eor'),
(22, 54, 1500, 400, 70, 4, 200, '15', 2035.5, 'surveyor');

-- --------------------------------------------------------

--
-- Table structure for table `blacklisted_token`
--

DROP TABLE IF EXISTS `blacklisted_token`;
CREATE TABLE IF NOT EXISTS `blacklisted_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expires_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE IF NOT EXISTS `doctrine_migration_versions` (
  `version` varchar(191) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
CREATE TABLE IF NOT EXISTS `documents` (
  `id` int NOT NULL AUTO_INCREMENT,
  `survey_information_id` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `path` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_documents_survey_information1_idx` (`survey_information_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `documents`
--

INSERT INTO `documents` (`id`, `survey_information_id`, `name`, `path`) VALUES
(4, 1, 'EOR1.png', 'uploads/EOR1.png'),
(5, 1, 'EOR2.png', 'http://localhost:8000/uploads/EOR2.png'),
(6, 1, 'EOR3.png', 'http://localhost:8000/uploads/EOR3.png');

-- --------------------------------------------------------

--
-- Table structure for table `estimate_of_repair`
--

DROP TABLE IF EXISTS `estimate_of_repair`;
CREATE TABLE IF NOT EXISTS `estimate_of_repair` (
  `id` int NOT NULL AUTO_INCREMENT,
  `verification_id` int DEFAULT NULL,
  `current_editor` enum('eor','surveyor') DEFAULT NULL,
  `remarks` text,
  PRIMARY KEY (`id`),
  KEY `fk_estimate_of_repair_verification1_idx` (`verification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `estimate_of_repair`
--

INSERT INTO `estimate_of_repair` (`id`, `verification_id`, `current_editor`, `remarks`) VALUES
(1, 1, '', '\"Plusieurs réparations à effectuer\"'),
(2, 4, 'surveyor', '\"accident grave\"'),
(3, 20, '', 'Front bumper replacement and repainting required'),
(7, 32, '', '\"Plusieurs réparations à effectuer\"'),
(54, 79, NULL, '');

-- --------------------------------------------------------

--
-- Table structure for table `labour_detail`
--

DROP TABLE IF EXISTS `labour_detail`;
CREATE TABLE IF NOT EXISTS `labour_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `part_detail_id` int DEFAULT NULL,
  `eor_or_surveyor` enum('eor','surveyor') NOT NULL,
  `activity` varchar(45) NOT NULL,
  `number_of_hours` int NOT NULL,
  `hourly_const_labour` float NOT NULL,
  `discount_labour` float NOT NULL,
  `vat_labour` enum('0','15') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `labour_total` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_labour_detail_part_detail1_idx` (`part_detail_id`)
) ENGINE=InnoDB AUTO_INCREMENT=118 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `labour_detail`
--

INSERT INTO `labour_detail` (`id`, `part_detail_id`, `eor_or_surveyor`, `activity`, `number_of_hours`, `hourly_const_labour`, `discount_labour`, `vat_labour`, `labour_total`) VALUES
(1, 1, 'eor', 'Remplacement pare-chocs', 2, 800, 100, '15', 1500),
(2, 2, 'surveyor', 'Installation phare', 1, 600, 50, '15', 900),
(5, 5, 'eor', 'remplacement train avant', 3, 1200, 900, '15', 1500),
(6, 6, 'surveyor', 'remplacement capot avant', 5, 1100, 500, '15', 1500),
(7, 7, '', 'Rear bumper replacement', 3, 50, 5, '', 157.5),
(8, 8, '', 'Left headlight installation', 2, 60, 0, '', 99),
(116, 106, 'eor', 'Installation', 3, 100, 20, '15', 285.6),
(117, 107, 'surveyor', 'Repair', 4, 120, 10, '15', 540.5);

-- --------------------------------------------------------

--
-- Table structure for table `part_detail`
--

DROP TABLE IF EXISTS `part_detail`;
CREATE TABLE IF NOT EXISTS `part_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estimate_of_repair_id` int DEFAULT NULL,
  `part_name` varchar(150) NOT NULL,
  `quantity` int NOT NULL,
  `supplier` varchar(255) NOT NULL,
  `quality` varchar(45) NOT NULL,
  `cost_part` float NOT NULL,
  `discount_part` float NOT NULL,
  `vat_part` enum('0','15') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `part_total` float DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_part_detail_estimate_of_repair1_idx` (`estimate_of_repair_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `part_detail`
--

INSERT INTO `part_detail` (`id`, `estimate_of_repair_id`, `part_name`, `quantity`, `supplier`, `quality`, `cost_part`, `discount_part`, `vat_part`, `part_total`, `deleted_at`) VALUES
(1, 1, 'Pare-chocs arrière', 1, 'Garage Spare Ltd', 'Original', 10000, 500, '15', 11000, NULL),
(2, 1, 'Phare avant', 1, 'AutoParts Inc', 'OEM', 5000, 250, '15', 5500, NULL),
(5, 2, 'Train avant', 1, 'Garage B', 'Original', 5000, 500, '15', 7000, NULL),
(6, 2, 'Capot arriere', 1, 'Garage C', 'originale', 12000, 540, '15', 15000, NULL),
(7, 3, 'Rear Bumper', 1, 'AutoParts Co.', 'OEM', 400, 20, '', 400, NULL),
(8, 3, 'Left Headlight', 1, 'LightCorp', 'Aftermarket', 250, 10, '', 252.5, NULL),
(15, 7, 'Pare-chocs arrière', 1, 'Garage Spare Ltd', 'Original', 10000, 500, '15', 11000, NULL),
(106, 54, 'Pare-chocs avant', 1, 'Garage TGE', 'Premium', 3299, 500, '15', 4080, NULL),
(107, 54, 'Peinture métallisée', 1, 'Garage tieu', 'Premium', 237, 0, '15', 1224, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `picture_of_damage_car`
--

DROP TABLE IF EXISTS `picture_of_damage_car`;
CREATE TABLE IF NOT EXISTS `picture_of_damage_car` (
  `id` int NOT NULL AUTO_INCREMENT,
  `survey_information_id` int DEFAULT NULL,
  `path` varchar(255) NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_picture_of_domage_car_survey_information1_idx` (`survey_information_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `picture_of_damage_car`
--

INSERT INTO `picture_of_damage_car` (`id`, `survey_information_id`, `path`, `deleted_at`) VALUES
(1, 1, 'D:\\Santatra\\Pictures\\testPictures\\book-68906ea456a05.png', '2025-08-04 12:54:08'),
(2, 1, 'D:\\Santatra\\Pictures\\testPictures\\Capture-68906ea61e9e6.png', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

DROP TABLE IF EXISTS `refresh_tokens`;
CREATE TABLE IF NOT EXISTS `refresh_tokens` (
  `refresh_token` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `valid` datetime NOT NULL,
  PRIMARY KEY (`refresh_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`refresh_token`, `username`, `valid`) VALUES
('00a77c4d-8b9a-4e0b-ab07-4abfa083a473', 'santatra@gmail.com', '2025-09-20 11:49:32'),
('025db46d-ad9b-435a-84e8-71e10db524f4', 'santatra@gmail.com', '2025-11-06 06:29:49'),
('04193fe1-3e8d-4507-a5ac-090842eac144', 'valentinmagde@gmail.com', '2025-08-10 10:00:59'),
('04ece25d-948a-4709-809c-120568f14728', 'santatra@gmail.com', '2025-09-26 11:10:22'),
('05287934-34f3-4710-aadb-c9e8058f7869', 'santatra@gmail.com', '2025-09-08 07:09:34'),
('06a4f584-7b5e-401b-a89f-c4363fe152c4', 'santatra@gmail.com', '2025-10-08 08:50:05'),
('0734ec04-068f-4bdb-b1bd-8166b81da6c2', 'santatra@gmail.com', '2025-09-13 06:22:03'),
('07c50e36-baa5-4375-8ce9-609a66f8909c', 'rene@gmail.com', '2025-08-23 06:15:18'),
('07ee93b4-971d-44bf-921c-e9e1068522e7', 'rene@gmail.com', '2025-08-10 09:40:51'),
('08dfca83-0aef-40ea-8770-fac9b0843c75', 'rene@gmail.com', '2025-08-21 07:41:29'),
('0a12917f-f971-4499-a24e-226c21b8b15e', 'valentinmagde@gmail.com', '2025-08-10 09:45:40'),
('0b7d34f0-f551-4f5b-89cf-618b727e5792', 'rene@gmail.com', '2025-08-23 09:29:42'),
('0bcb31cd-62e9-46b4-bb98-1027246da68c', 'santatra@gmail.com', '2025-10-11 11:32:19'),
('0e9e9031-8c2c-466f-8cc3-d7fff2262dd6', 'rene@gmail.com', '2025-08-21 11:39:19'),
('12e5901136bf8e0f3fb57cfc5a9384c4e544be94de6729acc78b37e55cd6e3641e9a7f2444fecf6ff524d884b5e091e4b5b7e732d9c8cea76fd41522b8519d59', 'rene@gmail.com', '2025-08-09 09:41:16'),
('1388399b-3b24-4ab1-9489-ea7b79d946c9', 'rene@gmail.com', '2025-08-11 11:17:28'),
('13e3d21b-6ac8-441a-b949-e89f98f4f2ce', 'rene@gmail.com', '2025-08-31 06:36:29'),
('19bc78a1-b36f-426a-93bd-429afed68635', 'santatra@gmail.com', '2025-09-04 07:33:16'),
('1a47fb10-a60e-4ff7-9834-02f58cedab65', 'rene@gmail.com', '2025-08-10 11:14:41'),
('1a9d651b-e08b-481a-83c5-2f60daa56c9e', 'rene@gmail.com', '2025-08-22 09:31:35'),
('1b9bfe43-68e6-4de9-b3e3-5c2fd3731179', 'rene@gmail.com', '2025-08-15 22:55:23'),
('1c52055d-49c7-4066-adf5-5ef1ac9402be', 'rene@gmail.com', '2025-08-30 06:43:48'),
('1dd546f6-00e4-412a-89a1-e163de901067', 'rene@gmail.com', '2025-08-10 10:34:38'),
('20cdbfa0-2505-4040-a9ff-c2411c1abd84', 'santatra@gmail.com', '2025-10-29 06:59:16'),
('28ad44a9-3cd5-4b24-879b-ee823dfe4fe8', 'santatra@gmail.com', '2025-10-11 09:16:23'),
('2b0faca8-e4b6-490a-9955-43e76bdba49b', 'santatra@gmail.com', '2025-09-21 10:29:16'),
('2b3fdb8c-939b-46ea-97cc-2c9665503b31', 'santatra@gmail.com', '2025-09-07 07:46:40'),
('328f6712-a272-41fb-a8b0-fe95d385fac1', 'santatra@gmail.com', '2025-09-01 06:35:10'),
('35f255cf-1180-4e5a-a88f-3a744ac2d8ed', 'santatra@gmail.com', '2025-08-31 06:47:32'),
('37034d03-0fe2-4e08-a2f3-6732919e3d62', 'santatra@gmail.com', '2025-09-26 19:40:29'),
('3a2d6d0b-9b08-4499-92c6-8bb312c68e01', 'rene@gmail.com', '2025-08-23 07:33:28'),
('3b02468e-98f5-4175-bdf8-4de8ddca9241', 'santatra@gmail.com', '2025-08-31 09:49:44'),
('3dddf212-bb47-4240-83ec-4fd99241636b', 'rene@gmail.com', '2025-08-21 07:55:30'),
('3e786636c3cb31a82c5ee4dba76c77e3b4ef88f0870dff2f17ff321d982c634ab433b11c1dc97e26581610e3c933c7fefada4bb45e6f261817dee4c7ac8499ba', 'rene@gmail.com', '2025-08-14 22:18:42'),
('41bdf4aa-3ea0-423a-ac51-420676a4dee6', 'santatra@gmail.com', '2025-09-21 06:00:10'),
('4348dc7d-264a-4965-92ea-421409e24a74', 'santatra@gmail.com', '2025-09-11 08:05:40'),
('43ec8c90-a88e-448e-8976-62ee87f50f17', 'santatra@gmail.com', '2025-08-31 12:12:36'),
('4821f5ec-e8c2-4723-9dc8-769c9720c807', 'santatra@gmail.com', '2025-10-30 08:13:18'),
('4bf9f86b-7af1-4c79-839a-c8e059f47e3d', 'santatra@gmail.com', '2025-10-15 06:47:53'),
('4c0df9f0-c5a9-4c13-b08a-d175ffa95f75', 'rene@gmail.com', '2025-08-23 07:41:44'),
('4ef12287-0847-41cf-a0a4-d733c6f0870e', 'santatra@gmail.com', '2025-10-08 08:35:59'),
('51a15766-4817-4a81-b298-e5337ac80086', 'santatra@gmail.com', '2025-09-19 10:03:08'),
('529d9421-d879-4ce8-b9a7-96d2b12e5952', 'santatra@gmail.com', '2025-09-18 07:22:10'),
('54d0dee3-0c9d-485b-9e4a-5da3668a970a', 'santatra@gmail.com', '2025-10-10 11:24:48'),
('558534c5-f83e-481b-884f-f6691b81ae33', 'santatra@gmail.com', '2025-08-31 07:08:29'),
('571d20a9-86aa-41b2-9074-3e0d34a33191', 'valentinmagde@gmail.com', '2025-08-10 09:59:10'),
('5cf6cee9-5500-4bd6-bf2b-a0c52a28b3a4', 'santatra@gmail.com', '2025-09-20 10:08:31'),
('5e097650-0262-4017-bd0c-0fa86f9191fe', 'rene@gmail.com', '2025-08-15 11:10:51'),
('5ec36266-fc90-4ec0-9847-b485a9bb2d33', 'rene@gmail.com', '2025-08-24 06:48:54'),
('60cd7132-9396-4a43-b269-9e6a9857edc3', 'santatra@gmail.com', '2025-09-11 17:26:04'),
('611d961d-4b11-420b-95af-59646e3fafcb', 'santatra@gmail.com', '2025-09-20 06:21:37'),
('61489275-ca4d-4fcd-b550-0798dcf667bf', 'santatra@gmail.com', '2025-09-04 08:07:30'),
('63525381-9169-43b2-9c89-e2f526530dc7', 'santatra@gmail.com', '2025-09-13 06:22:06'),
('64001a2f-977c-479a-99f8-301f9ccb9298', 'santatra@gmail.com', '2025-08-31 07:07:13'),
('65c47f80-5eff-4f9c-a509-4ec3e4a02c32', 'santatra@gmail.com', '2025-11-03 06:17:53'),
('6df418e0-2cdf-4dcd-8ce1-319b334fc44a', 'rene@gmail.com', '2025-08-18 11:23:36'),
('72c1a0a4-58cd-4534-80fb-ff03ca8e6f21', 'santatra@gmail.com', '2025-10-12 11:22:03'),
('731923b9-dc7e-4192-a431-fa556ec117c0', 'rene@gmail.com', '2025-08-22 06:52:39'),
('74396a87-76b1-41c8-972e-d3bfeff858fd', 'santatra@gmail.com', '2025-09-26 10:28:49'),
('75d60fb0-38ed-4466-ab11-eaf9c16e294f', 'santatra@gmail.com', '2025-09-08 09:45:05'),
('7663e756-a58e-4fa1-98fb-2cbf2776acb8', 'rene@gmail.com', '2025-08-17 10:48:52'),
('7864ff6e-4333-4972-b755-55b392f24ab1', 'santatra@gmail.com', '2025-09-11 06:34:00'),
('7996d634-2249-46b0-bb50-ab63576dc95e', 'santatra@gmail.com', '2025-09-18 06:35:18'),
('7b900920-4825-49b4-953c-a78cdc8f8e5f', 'santatra@gmail.com', '2025-09-21 12:01:17'),
('809b53a5-9afd-49a1-9c54-fad92090cf1f', 'valentinmagde@gmail.com', '2025-08-11 10:59:07'),
('80b82bdb-b205-4ef8-b565-5215d01cda80', 'santatra@gmail.com', '2025-09-18 09:19:52'),
('80ea5930-35e0-4c06-9c4d-e63bdc117fe1', 'rene@gmail.com', '2025-08-10 10:36:37'),
('84ff3ac2-4241-43ba-9f49-b9fa720cebf0', 'santatra@gmail.com', '2025-09-21 10:55:12'),
('867287b0-899f-4fdd-9337-1df29b8e6a01', 'rene@gmail.com', '2025-08-10 11:07:53'),
('86dbcdfc-980b-466f-bbb5-f5f23454d4e0', 'santatra@gmail.com', '2025-09-14 07:33:26'),
('885d0d92-0311-4cf3-8f56-6ea018a84ca6', 'rene@gmail.com', '2025-08-21 11:30:50'),
('891387cd-dd3d-4820-862b-d10bfae7707e', 'santatra@gmail.com', '2025-09-20 17:44:37'),
('8a6393c8-663e-4116-bff9-65ab3ff32d9a', 'rene@gmail.com', '2025-08-30 09:25:20'),
('8a6d45d718f9506bde2a7cddad03f2251075e872b18210bc2ada44f2cde50e94d7b3472127e46611555faadc39a0f8b4f8245f00e0ffc95f58e776a9b45b5051', 'rene@gmail.com', '2025-08-10 10:49:47'),
('8a9207da-1959-4aa6-ae29-0445301a20af', 'santatra@gmail.com', '2025-09-08 09:21:54'),
('8b62ac6b-29a9-4697-82e2-2361a1d254ef', 'rene@gmail.com', '2025-08-10 10:34:52'),
('8b97dfba-2a5d-4250-bb48-9bd8f1312673', 'santatra@gmail.com', '2025-09-18 09:37:06'),
('8c098a5f-db01-4e68-b7d3-b2ed02ad47d9', 'santatra@gmail.com', '2025-09-18 06:35:47'),
('9039e53b-bc74-43b8-bd2f-07167853b365', 'santatra@gmail.com', '2025-10-10 07:04:59'),
('9329c16d-68d5-4b41-9346-9553c3d42659', 'rene@gmail.com', '2025-08-22 06:14:39'),
('943c88f9-a0d8-430e-b3f8-b71959a07a7c', 'santatra@gmail.com', '2025-10-30 10:38:09'),
('94ddf92f-9e36-4ff3-90f4-5fc1f259632b', 'rene@gmail.com', '2025-08-16 10:03:10'),
('9cbf70a0-6a50-4498-ba9c-89acb830098e', 'rene@gmail.com', '2025-08-21 10:42:01'),
('9ef38f35-fd1c-404a-886b-fa31a909bf3e', 'santatra@gmail.com', '2025-10-15 11:12:41'),
('9fae67c8-3f06-4ba4-a243-681f327b389b', 'santatra@gmail.com', '2025-11-01 07:43:25'),
('a0ceaf1b-bd15-4d3d-b791-7565f3ea92e1', 'rene@gmail.com', '2025-08-28 10:37:11'),
('a49185f6-c41e-4786-8ada-7f66336462c2', 'santatra@gmail.com', '2025-09-07 08:23:52'),
('a927c548-695f-4cd9-81cd-c03ed612d9b7', 'santatra@gmail.com', '2025-10-12 07:44:49'),
('aac805e9-84d3-44f3-b4b4-bed339e167dd', 'rene@gmail.com', '2025-08-24 10:39:03'),
('ac1f194e-c7ce-416e-b2c8-f35c950c99c4', 'santatra@gmail.com', '2025-10-19 05:59:26'),
('ae704517-681c-4930-ab0d-c78e648a94d0', 'santatra@gmail.com', '2025-09-13 07:08:04'),
('aeddcb3e-5acf-4276-b288-9ebc23d0541a', 'santatra@gmail.com', '2025-11-08 05:52:38'),
('af10deb3-a92d-4107-80c4-08f1650844f6', 'santatra@gmail.com', '2025-09-11 18:33:55'),
('b15dfc99-ee54-4490-aaa9-e9e4f7e9a3a5', 'santatra@gmail.com', '2025-10-08 08:50:04'),
('b3fcc386-7916-4141-b6df-815c90538942', 'santatra@gmail.com', '2025-11-09 07:58:22'),
('b440fbc7-2ebf-449d-be23-e1937f92504f', 'santatra@gmail.com', '2025-09-04 09:31:51'),
('b641f5c6-21c8-48ea-9033-ac8375fe85df', 'rene@gmail.com', '2025-08-21 08:40:42'),
('b6fe9d5d-5229-4483-93fe-eac3feda2478', 'santatra@gmail.com', '2025-10-10 07:28:01'),
('ba8618e5-8895-4ae8-9138-8213a3ffe674', 'valentinmagde@gmail.com', '2025-08-10 10:19:58'),
('be98df6a-8251-47f1-828d-2f0909f39e45', 'rene@gmail.com', '2025-08-16 07:56:37'),
('c0a8fa04-9fd1-4ccd-ba8d-652119112e08', 'rene@gmail.com', '2025-08-17 09:39:37'),
('c68d33ea-c534-464b-969f-8b5900f1c7b3', 'rene@gmail.com', '2025-08-23 07:12:42'),
('c741ba4c-4124-4af0-afc7-7ba5f84cf536', 'santatra@gmail.com', '2025-10-15 07:32:16'),
('cb5805b3-5ce5-4e30-9c35-72de45d4aa70', 'tojo@gmail.com', '2025-08-23 09:30:11'),
('cbccc8ae-27e3-412d-b5b1-307b85ba1436', 'santatra@gmail.com', '2025-09-18 09:48:47'),
('cd9bdbc7-bdf2-403f-99c0-3b6f3b1d9959', 'rene@gmail.com', '2025-08-17 07:24:18'),
('cea6875f-2e93-424c-8f51-be660e193b13', 'santatra@gmail.com', '2025-09-25 08:21:39'),
('cf821452-4f7c-47cd-b46f-2aea6b1b9fd3', 'valentinmagde@gmail.com', '2025-08-11 10:59:54'),
('d0645d54-6927-4dd4-8afa-9554e111733e', 'santatra@gmail.com', '2025-09-13 06:58:49'),
('d46da7fc-6b1c-4150-8327-108f6656359e', 'santatra@gmail.com', '2025-09-26 11:59:47'),
('d54dabbf6b471ac5ff37a5b0141c4310327bd28ab2bb16789c7cb577d02c165161e17c76d328bd98c2d9646fa6db273c1b8d8d553c5347176f7020e9b3ddcaab', 'rene@gmail.com', '2025-08-14 22:02:43'),
('d695766b-ff4d-48d6-a3f1-60b4a21ccdf1', 'rene@gmail.com', '2025-08-10 11:05:15'),
('dbc72d1c-abb6-465f-af55-4cd331f5f847', 'rene@gmail.com', '2025-08-21 08:05:14'),
('dc6e111b-cfa6-40a3-8610-751e342fd91a', 'santatra@gmail.com', '2025-09-20 06:18:49'),
('dff8cc18-d1ca-4822-ae43-12c59ae81987', 'rene@gmail.com', '2025-08-28 08:01:29'),
('e0080c9f-8357-47ef-bd12-d4146e183f51', 'rene@gmail.com', '2025-08-16 12:23:21'),
('e188900d-77b9-4e1d-9213-ca7ed553526f', 'santatra@gmail.com', '2025-09-21 10:55:02'),
('e1dd5c85-d1ce-496e-8666-93ce12323ac5', 'rene@gmail.com', '2025-08-29 07:12:12'),
('e644ed32-e27b-440a-84a8-935571e3c319', 'santatra@gmail.com', '2025-09-19 12:03:32'),
('e7458cbe4adf6f4028c892f934465bf4e9138984f65f6df8eb53bef686fd483370e42fdee00e70bd1af5003f6c028869f66e1ab092fecf2f845aa0e713dc1479', 'rene@gmail.com', '2025-08-09 09:36:03'),
('e7f7eb80-0684-426f-9234-67f9e0fceb69', 'santatra@gmail.com', '2025-09-19 07:08:03'),
('e808c1191a1aeae9a89e24f23764844cb829f410c5bcb4ede2a10ace5766565afd5072d6148836da06433870c0dacc71cb485c1c5dac119906d8b376df19ed4a', 'rene@gmail.com', '2025-08-09 11:37:17'),
('e9970c35-fc42-4aa1-a30f-f5995dca26c9', 'santatra@gmail.com', '2025-11-08 05:52:37'),
('ea661ef8-de19-49a4-bc32-d4d73c0d80a6', 'santatra@gmail.com', '2025-09-12 11:46:33'),
('ea7ff465-d522-4a9f-87c2-15620e851be1', 'santatra@gmail.com', '2025-09-18 11:37:37'),
('ec5e0293-6ab0-4d04-b865-e759115a85c2', 'rene@gmail.com', '2025-08-23 09:31:05'),
('ec8fd4ee-f152-440b-b506-0afe249e610e', 'santatra@gmail.com', '2025-09-26 07:16:32'),
('ecb10889-53f8-4df3-9059-57ba11c7a155', 'santatra@gmail.com', '2025-09-26 10:25:00'),
('ef5c2729-bde8-4ec3-ae2b-59931564d937', 'santatra@gmail.com', '2025-10-15 07:32:15'),
('ef601e3f-8ae6-48fc-abb6-89e7375495b6', 'santatra@gmail.com', '2025-09-11 17:52:30'),
('f1370f9f-7900-4dc3-bfab-1c1125a8fc8c', 'santatra@gmail.com', '2025-11-02 06:08:50'),
('f1a30243-1ad1-461d-a545-0bd6be41ab8b', 'rene@gmail.com', '2025-08-10 11:47:03'),
('f21c8be5-f94f-4d09-97e9-31d0234d4607', 'santatra@gmail.com', '2025-10-11 10:57:42'),
('f2e64387-89e8-4d0a-935f-28a2132d214e', 'santatra@gmail.com', '2025-11-09 10:25:39'),
('f382bd94-c6a8-4363-8f3b-776862de59c1', 'rene@gmail.com', '2025-08-20 19:32:27'),
('f700a981-4b89-47b9-bd40-8da07766a7b8', 'rene@gmail.com', '2025-08-10 10:52:59'),
('f85264ae-9cf4-476b-8553-3781df976369', 'rene@gmail.com', '2025-08-14 06:46:09'),
('fa80b270-c7eb-4478-afc3-76fe093e6e5d', 'santatra@gmail.com', '2025-10-15 08:47:47'),
('fa9680cb-e7a4-4cf4-ba00-e5020e5710fa', 'santatra@gmail.com', '2025-09-20 09:40:46'),
('faf90146-ab33-4ea5-99e1-c376599a4315', 'santatra@gmail.com', '2025-09-13 07:36:53'),
('fd7a5e85-38b1-4e56-a0c2-d39a9fdb3bbc', 'santatra@gmail.com', '2025-11-03 12:06:46'),
('fe00bc54-deb6-40d7-98bd-e6b2677ba052', 'santatra@gmail.com', '2025-10-12 06:41:24');

-- --------------------------------------------------------

--
-- Table structure for table `survey`
--

DROP TABLE IF EXISTS `survey`;
CREATE TABLE IF NOT EXISTS `survey` (
  `id` int NOT NULL AUTO_INCREMENT,
  `surveyor_id` int NOT NULL,
  `current_step` varchar(45) DEFAULT NULL,
  `status_id` int DEFAULT NULL,
  `claim_number` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_survey_status1_idx` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `survey`
--

INSERT INTO `survey` (`id`, `surveyor_id`, `current_step`, `status_id`, `claim_number`) VALUES
(1, 5, 'step_3', 0, 'M0119923'),
(4, 5, 'step_3', 0, 'M0119925'),
(6, 5, 'step_1', 0, 'M0119927'),
(7, 5, 'step_1', 1, 'M0119928'),
(11, 5, 'step_2', 1, 'M0119932'),
(14, 5, 'step_4', 1, 'M0119935'),
(20, 5, 'step_3', 0, 'M0119939'),
(32, 5, 'step_2', 2, 'M0119938'),
(33, 5, 'step_2', 1, 'M0119930'),
(74, 5, 'step_2', 1, 'M0119929'),
(79, 5, 'step_3', 1, 'M0119926');

-- --------------------------------------------------------

--
-- Table structure for table `survey_information`
--

DROP TABLE IF EXISTS `survey_information`;
CREATE TABLE IF NOT EXISTS `survey_information` (
  `id` int NOT NULL AUTO_INCREMENT,
  `verification_id` int DEFAULT NULL,
  `garage` varchar(45) NOT NULL,
  `garage_address` varchar(255) NOT NULL,
  `garage_contact_number` varchar(100) NOT NULL,
  `eor_value` float NOT NULL,
  `invoice_number` varchar(45) NOT NULL,
  `survey_type` varchar(45) NOT NULL,
  `date_of_survey` date NOT NULL,
  `time_of_survey` time NOT NULL,
  `pre_accident_valeur` float NOT NULL,
  `showroom_price` float NOT NULL,
  `wrech_value` float NOT NULL,
  `excess_applicable` float NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_survey_information_verification1_idx` (`verification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `survey_information`
--

INSERT INTO `survey_information` (`id`, `verification_id`, `garage`, `garage_address`, `garage_contact_number`, `eor_value`, `invoice_number`, `survey_type`, `date_of_survey`, `time_of_survey`, `pre_accident_valeur`, `showroom_price`, `wrech_value`, `excess_applicable`) VALUES
(1, 1, 'Garage ABC', '123, Rue du Test, Quatre Bornes', '52521212', 105000, 'INV-2024-0001', 'Initial', '2025-07-17', '10:30:00', 150000, 170000, 30000, 5000),
(3, 4, 'Garage T', 'Quatre Bornes', '25327638', 250000, 'INV-2025-003', 'Survey with repairs', '2025-08-07', '10:30:00', 300000, 325000, 50000, 10000),
(23, 11, 'Garage UVW', '654 Maple Street, City', '432-987-6540', 45000, 'VB102', 'PHYSICAL', '2025-09-18', '15:12:00', 60000, 540000, 1000, 1500000),
(24, 32, 'Garage OPQ', '753 Birch Street, City', '654-321-0987', 19500, 'VB103', 'PHYSICAL', '2025-08-26', '21:59:00', 260000, 850000, 120000, 10000),
(26, 7, 'Garage ABC', '123 Main Street, City', '123-456-7890', 15000, 'VB105', 'PHYSICAL', '2025-08-20', '12:34:00', 200000, 450000, 1200000, 120900),
(27, 33, 'Garage LMN', '789 Oak Street, City', '555-123-4567', 14000, 'INV0382983', 'PHYSICAL', '2025-09-10', '14:05:00', 500000, 6000000, 2000000, 200000),
(28, 74, 'Garage XYZ', '456 Elm Street, City', '098-765-4321', 18000, 'VB21983', 'PHYSICAL', '2025-09-03', '13:20:00', 300000, 300000, 100000, 10000),
(29, 79, 'Garage TE', 'Port Louis', '543729836', 105082, 'VB203', 'VIRTUAL', '2025-09-04', '14:23:00', 30000, 40000, 110000, 110000);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_information`
--

DROP TABLE IF EXISTS `vehicle_information`;
CREATE TABLE IF NOT EXISTS `vehicle_information` (
  `id` int NOT NULL AUTO_INCREMENT,
  `verification_id` int DEFAULT NULL,
  `make` varchar(90) DEFAULT NULL,
  `model` varchar(90) DEFAULT NULL,
  `cc` int DEFAULT NULL,
  `fuel_type` varchar(45) DEFAULT NULL,
  `transmission` varchar(45) DEFAULT NULL,
  `engime_no` varchar(90) DEFAULT NULL,
  `chasisi_no` varchar(250) DEFAULT NULL,
  `vehicle_no` varchar(45) DEFAULT NULL,
  `color` varchar(45) DEFAULT NULL,
  `odometer_reading` int DEFAULT NULL,
  `is_the_vehicle_total_loss` tinyint DEFAULT NULL,
  `condition_of_vehicle` enum('Good','Fair','As new','Excellent','Poor') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `place_of_survey` varchar(150) DEFAULT NULL,
  `point_of_impact` text,
  PRIMARY KEY (`id`),
  KEY `fk_vehicle_information_verification1_idx` (`verification_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `vehicle_information`
--

INSERT INTO `vehicle_information` (`id`, `verification_id`, `make`, `model`, `cc`, `fuel_type`, `transmission`, `engime_no`, `chasisi_no`, `vehicle_no`, `color`, `odometer_reading`, `is_the_vehicle_total_loss`, `condition_of_vehicle`, `place_of_survey`, `point_of_impact`) VALUES
(1, 1, 'Toyota', 'Corolla', 1500, 'Petrol', 'Automatic', 'ENG123456789', 'CHS987654321', 'ABC-123', 'Red', 72000, 0, 'Good', 'Garage ABC, Quatre Bornes', 'Front bumper'),
(6, 4, 'Hyundai', 'i30', 77233, 'Petrol', 'Manuel', '036 NI 09', 'CHS987632', '787273 TG 09', 'Green', 2372873, 0, 'Good', 'Port Louis', 'Bumper'),
(7, 6, 'Wolkswagen', 'Golf', 77233, 'Petrol', 'Manuel', '036 NI 09', 'CHS987632', '787273 TG 09', 'Green', 2372873, 0, 'Good', 'Port Louis', 'Bumper'),
(8, 20, 'Honda', 'Accord', 1800, 'Petrol', 'Automatic', 'ENG11111', 'CHS22222', 'VEH012', 'Black', 85000, 0, 'Good', 'Garage JKL, City', 'Front bumper'),
(28, 32, 'Hyundai', 'Tucson', 2000, 'Diesel', 'Automatic', 'ENG99999', 'CHS11111', 'VEH011', 'Blue', 1200, 0, 'Good', 'QB', 'yeyuzye'),
(29, 33, 'Ford', 'Focus', 1600, 'Petrol', 'Automatic', 'ENG11111', 'CHS22222', 'VEH003', 'red', 3892, 0, 'Good', 'fff', 'ggg'),
(70, 11, 'BMW', 'X5', 3000, 'Diesel', 'Automatic', 'ENG33333', 'CHS44444', 'VEH005', 'red', 3892, 0, 'Good', 'fff', 'ggg'),
(71, 14, 'Kia', 'Sportage', 1600, 'Petrol', 'Manual', 'ENG66666', 'CHS77777', 'VEH008', 'green', 50000, 0, 'Good', 'quatre bornes', 'bumper'),
(77, 74, 'Honda', 'Civic', 2000, 'Diesel', 'Manual', 'ENG54321', 'CHS09876', 'VEH002', 'red', 3892, 0, 'Good', 'fff', 'ggg'),
(78, 79, 'Mazda', 'BT50', 1200, 'Petrol', 'Manuel', '036 NI 09', 'CHS987654321', '626 GT 23', 'red', 3892, 0, 'Good', 'fff', 'ggg');

--
-- Constraints for dumped tables
--

--
-- Constraints for table `additional_labour_detail`
--
ALTER TABLE `additional_labour_detail`
  ADD CONSTRAINT `fk_additional_labour_detail_estimate_of_repair1` FOREIGN KEY (`estimate_of_repair_id`) REFERENCES `estimate_of_repair` (`id`);

--
-- Constraints for table `documents`
--
ALTER TABLE `documents`
  ADD CONSTRAINT `fk_documents_survey_information1` FOREIGN KEY (`survey_information_id`) REFERENCES `survey_information` (`id`);

--
-- Constraints for table `estimate_of_repair`
--
ALTER TABLE `estimate_of_repair`
  ADD CONSTRAINT `fk_estimate_of_repair_verification1` FOREIGN KEY (`verification_id`) REFERENCES `survey` (`id`);

--
-- Constraints for table `labour_detail`
--
ALTER TABLE `labour_detail`
  ADD CONSTRAINT `fk_labour_detail_part_detail1` FOREIGN KEY (`part_detail_id`) REFERENCES `part_detail` (`id`);

--
-- Constraints for table `part_detail`
--
ALTER TABLE `part_detail`
  ADD CONSTRAINT `fk_part_detail_estimate_of_repair1` FOREIGN KEY (`estimate_of_repair_id`) REFERENCES `estimate_of_repair` (`id`);

--
-- Constraints for table `picture_of_damage_car`
--
ALTER TABLE `picture_of_damage_car`
  ADD CONSTRAINT `fk_picture_of_domage_car_survey_information1` FOREIGN KEY (`survey_information_id`) REFERENCES `survey_information` (`id`);

--
-- Constraints for table `survey_information`
--
ALTER TABLE `survey_information`
  ADD CONSTRAINT `fk_survey_information_verification1` FOREIGN KEY (`verification_id`) REFERENCES `survey` (`id`);

--
-- Constraints for table `vehicle_information`
--
ALTER TABLE `vehicle_information`
  ADD CONSTRAINT `fk_vehicle_information_verification1` FOREIGN KEY (`verification_id`) REFERENCES `survey` (`id`);
--
-- Database: `user_claim_db`
--
CREATE DATABASE IF NOT EXISTS `user_claim_db` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `user_claim_db`;

-- --------------------------------------------------------

--
-- Table structure for table `account_informations`
--

DROP TABLE IF EXISTS `account_informations`;
CREATE TABLE IF NOT EXISTS `account_informations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `business_name` varchar(150) NOT NULL,
  `business_registration_number` varchar(150) NOT NULL,
  `business_address` varchar(250) NOT NULL,
  `city` varchar(45) NOT NULL,
  `postal_code` varchar(45) NOT NULL,
  `phone_number` varchar(100) NOT NULL,
  `email_address` varchar(255) NOT NULL,
  `password` varchar(250) NOT NULL,
  `website` varchar(150) DEFAULT NULL,
  `backup_email` varchar(255) NOT NULL,
  `date_of_birth` datetime NOT NULL,
  `nic` varchar(50) NOT NULL,
  `country_of_nationality` varchar(50) NOT NULL,
  `home_number` varchar(50) NOT NULL,
  `kyc` datetime NOT NULL,
  `profile_image` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_address_UNIQUE` (`email_address`),
  UNIQUE KEY `users_id_UNIQUE` (`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `account_informations`
--

INSERT INTO `account_informations` (`id`, `users_id`, `business_name`, `business_registration_number`, `business_address`, `city`, `postal_code`, `phone_number`, `email_address`, `password`, `website`, `backup_email`, `date_of_birth`, `nic`, `country_of_nationality`, `home_number`, `kyc`, `profile_image`) VALUES
(1, 1, 'Brondon', '48 AG 23', 'Squard Orchard', 'Quatre Bornes', '7000', '56589857', 'tojo@gmail.com', '$2y$12$DQcPA1dClkAMmVYnjFesKedCBkiLuZj7mD0gqgzegunGQ5X9/Rw16', 'www.test8.com', '', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', ''),
(2, 2, 'Christofer', '1 JN 24', 'La Louis', 'Quatre Bornes', '7120', '57896532', 'rene@gmail.com', '$2y$12$Wg3ISNFeWVw.yGV9u7EVtOpMCk7z64KZ9SpKZIgXaoeeuYZe8pbKC', 'www.rene.com', '', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', ''),
(3, 3, 'Kierra', '94 NOV 06', 'Moka', 'Saint Pierre', '7520', '54789512', 'raharison@gmail.com', '$2y$12$nHmXmOQnSx4Nt0H7DX3Ye.OIa7BEjRz1Ez.gK3uxG8C1JwBBLmbCa', 'www.raharison.com', '', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', ''),
(4, 4, 'Surveyor 2', 'Surveyor 2', 'addr Surveyor 2', 'Quatre bornes', '7200', '55678923', 'surveyor2@gmail.com', '$2y$12$A9/pwjw/3xpJAn2ZKt3CSOCW89.DkGB1Ez.MxQZVptmtCMdTbPjce', 'www.surveyor.com', '', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', ''),
(5, 5, 'Santatra Miharimbola', '1 JN 2025', 'Avenue victoria', 'Quatre Bornes', '7500', '55897899', 'santatra@gmail.com', '$2y$12$Wg3ISNFeWVw.yGV9u7EVtOpMCk7z64KZ9SpKZIgXaoeeuYZe8pbKC', 'www.santat1.com', 'santatra.r@gmail.com', '1995-09-06 00:00:00', 'W01728617827821', 'Mauritius', '628468273', '2026-09-01 00:00:00', '68cd3f676df3e.png'),
(6, 6, 'Garage 1', 'Garage 1', 'Addr Garage 1', 'Quatre bornes', '7200', '45677444', 'garage2@gmail.com', '$2y$12$nHmXmOQnSx4Nt0H7DX3Ye.OIa7BEjRz1Ez.gK3uxG8C1JwBBLmbCa', 'www.garage2.com', '', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', ''),
(7, 7, 'Spare Part 2', 'Spare Part 2', 'Addr Spare Part 2', 'Quatre bornes', '7200', '34667777', 'sparepart@gmail.com', '$2y$12$nHmXmOQnSx4Nt0H7DX3Ye.OIa7BEjRz1Ez.gK3uxG8C1JwBBLmbCa', 'www.sparepart2.com', '', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', ''),
(8, 10, 'Miha', '67236', 'Qutre bornes', 'Quatre borne', '101', '3U873839', 'miha@gmail.com', '123456', 'miha@website.com', 'mia@gmail.com', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', ''),
(9, 11, 'Super admin', '123456789', '123 Rue Principale', 'Paris', '75001', '+33123456789', 'raharisontojo4@gmail.com', 'Tojo@1235', 'https://monentreprise.com', 'tt@gmail.com', '0000-00-00 00:00:00', '', '', '', '0000-00-00 00:00:00', '');

-- --------------------------------------------------------

--
-- Table structure for table `administrative_settings`
--

DROP TABLE IF EXISTS `administrative_settings`;
CREATE TABLE IF NOT EXISTS `administrative_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `primary_contact_name` varchar(255) NOT NULL,
  `primary_contact_post` varchar(150) NOT NULL,
  `notification` text NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_id_UNIQUE` (`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `administrative_settings`
--

INSERT INTO `administrative_settings` (`id`, `users_id`, `primary_contact_name`, `primary_contact_post`, `notification`, `updated_at`) VALUES
(1, 1, 'rene', 'testpost', '0', '2025-07-23 07:43:44'),
(2, 11, '15', '222', 'Test notification', '2025-07-24 10:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `admin_settings_communications`
--

DROP TABLE IF EXISTS `admin_settings_communications`;
CREATE TABLE IF NOT EXISTS `admin_settings_communications` (
  `admin_setting_id` int NOT NULL,
  `method_id` int NOT NULL,
  PRIMARY KEY (`admin_setting_id`,`method_id`),
  KEY `IDX_42D45B4519883967` (`method_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `admin_settings_communications`
--

INSERT INTO `admin_settings_communications` (`admin_setting_id`, `method_id`) VALUES
(1, 1),
(1, 2);

-- --------------------------------------------------------

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
CREATE TABLE IF NOT EXISTS `assignment` (
  `claims_number` varchar(100) NOT NULL,
  `users_id` int NOT NULL,
  `assignment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `assignement_note` text,
  `status_id` int NOT NULL,
  KEY `fk_assignment_status1_idx` (`status_id`),
  KEY `fk_assignment_users1` (`users_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `assignment`
--

INSERT INTO `assignment` (`claims_number`, `users_id`, `assignment_date`, `assignement_note`, `status_id`) VALUES
('M0119921', 1, '2025-07-04 11:03:40', NULL, 2),
('M0119923', 5, '2025-07-03 20:00:00', 'test', 4),
('M0119921', 6, '2025-07-03 20:00:00', 'Test affectation garage 1', 1),
('M0119925', 5, '2025-07-06 07:00:00', 'urgent', 3),
('M0119926', 5, '2025-07-07 06:30:00', 'à vérifier', 2),
('M0119927', 5, '2025-07-08 08:15:00', 'dommages mineurs', 2),
('M0119928', 5, '2025-07-09 05:45:00', 'prioritaire', 1),
('M0119929', 5, '2025-07-10 11:00:00', 'réclamation en attente', 2),
('M0119930', 5, '2025-07-11 10:30:00', 'à traiter rapidement', 2),
('M0119931', 5, '2025-07-12 12:10:00', 'sinistre confirmé', 1),
('M0119932', 5, '2025-07-13 07:20:00', 'visite sur site prévue', 2),
('M0119933', 5, '2025-07-14 06:00:00', 'urgence faible', 1),
('M0119934', 5, '2025-07-15 13:45:00', 'pièces manquantes', 1),
('M0119935', 5, '2025-08-26 19:42:22', NULL, 2),
('M0119936', 5, '2025-07-17 07:40:00', 'sinistre complet', 1),
('M0119937', 5, '2025-08-07 09:43:08', 'note', 1),
('M0119938', 5, '2025-08-07 09:43:29', 'note1', 2),
('M0119939', 5, '2025-08-07 09:45:20', 'note2', 1),
('M0119922', 5, '2025-08-25 21:00:00', '', 1),
('M0119924', 6, '2025-08-25 21:00:00', '', 1);

-- --------------------------------------------------------

--
-- Table structure for table `blacklisted_token`
--

DROP TABLE IF EXISTS `blacklisted_token`;
CREATE TABLE IF NOT EXISTS `blacklisted_token` (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `expires_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blacklisted_token`
--

INSERT INTO `blacklisted_token` (`id`, `token`, `expires_at`) VALUES
(1, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTMyNTAwNjgsImV4cCI6MTc1MzI1NzI2OCwicm9sZXMiOlsiZ2FyYWdlIl0sInVzZXJuYW1lIjoicmVuZUBnbWFpbC5jb20ifQ.TtllsQbeQ4uM5cYIdoheYigVg9EZLjA4IBZ4wugl_wlmdq2G_4ZJ3xQvapFlfw70hVh3D1PNcgbGfSljjYh5mE3nfoBnPcF6qaz9Tj85LaRZTPAkbOXWLmeuJH6gzP1v-ouKEIeqOsNTqDliovVjrtArj2s7ZJSdAXhE4tHuZ0QXRFWVXEKCVcZ22609uzI1IBo1FGcsymik4rfLNstdFBpwR61V2mkWrBRpcafJyyXs0NrXPIlqFxU5IZJ8u88yG3vowhnEAVpjC3PM1rvR9X5Qd3AO8ymvzRWJ4To6RpGH2Ai3rNHuveiGC6t75DoH-7t5c7d-X5ItawJWpY1kbJNgNqZ32P-7YKViwFAoTUTbxi5ML0GCs-ym8VCghMBqxID91gtuYX6S9Dgmw3fbHHK2cZeUwaWJ17uNzu3qBWm0xBmksRgxwP8CEKIArw_JXL7GdQkLkqGOK0egRWXRbEmQkU8IcP1ZT0jqoVjEHvwKewU2GhVw_5UrOBe7QHAemFYzUYdurepzDXOSHAqZmBy_g18fueUe2w1OPpEImlhJQHso4iWpkMcZO-TzzRoS74BCQ_bqDhfxpkd8uLeTojad-hm70hpP5nMsgBxOfsdQOeimNeh5PI5Uo2EHHyPq32WiKEGXJjx_IA5UFvrp374KKjhA6Ipx7ca2rwJrnYY', '2025-07-23 07:54:28'),
(2, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTM5NDUwMzQsImV4cCI6MTc1NDAzMTQzNCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.O1D6iH0IneKhI5wzEcFSmEfMKDryJQxqh_IDtSJXzfMpOOhJM12ij39Tw1YenxN-sd2kt-FuBelu9HOJniTIKynzekn94GYjR9sWrVnlMMWnzdtpCybiUiaraJwZf-budZlm0cjgj_xJiaE5yrvAzyLrXYfcYljX1ITgzhR8mfpcA0dDsO6u8EtIaPNV55KRLrAsjwYGIxQUhh4da1sONyjTSG7MhM5mTK0BXiTsrWvaCdMBwyyYWvpMvV90htYo1RN8TAJwiwdWzbCgXH6DbuVmiO0Lb7e340tce3t-b286vC3bp9P4JHCWfMfBfP4p6rSOGeuMgyKsOG5bnnjeohzIi5dKc0fEXmdc-F4lEpr0XEgqvSEkFg8sNhQ33Pk7IUXhSuHF5JhROgIiPfEGFDfQcD1LmJfJFRw6WkW-ybsentaYRIbOdh1aSDxGwgrig6QwQmkoaHYOQ0NkutWsgjxLoHnrU1raXokGcltxhu2FaF0IrdkXffVJFo6BtlJfx31LTv2DrhDzijWBWx4klyjRMkgp7TAn305-RqhDpRMBFGqAN_q2sS2KnUeEm0ZawHxI3Fqe0adgjX30nAer6AW9-JosuyhO2oo2fUnwv4YVgH8AL4g-EDyLBmqsUiT3YlqIOWS9Z9v6Dd_m84UgozbIuiesjfDHJS7pVYT5JsY', '2025-08-01 06:57:14'),
(3, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYxOTQ4NzgsImV4cCI6MTc1NjI4MTI3OCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.4SvywcFd4Zq-cG-uvpKGkFMhbGN96P7nO3E4bTa4Vqs_JSVXB4mm-ZRFM0sDbXUlAdpp6Fpd_RVpF4Kb8uEbr00UORvdHoP65LxZo3cVBdQWFk9UiP6ySRwvOtz58d-toURFe2IodZaZbUo4192Sh5QSMTdBkzM0xnIvuIOO_7rscfYcczcqVvapGa36zyec0mWRHNOGDu9iqSB2ybQBJyG-Wma4muRvoJQW16lfENXLsjD4xPos3qjdPix4OqQ3XqBLXKFp3m_l_JDL29-JupHHjhzmMQCG78A1Os9zGWYphvrDWHordcJKLk2-QK67sHGJxq4LGYXFgt3YXg_ZxyG00TUQGeSr8OmhMMVOC6JDvKnfiEmYZOnThhu6gNUZ5EYvAvzjRbr3Ka2J_fGp9tMlbkCmjBdKSomoygI1858YBmq9z-qALqAOhKaMmMFxm6r4twBjYj6UDZczsZqKhRTr_zSUkDHfUAgJCa2kjKOHTos3hvzJ3E1_btNPobV19JY61emUWSjjlERn-59oXVKy9-2bGEfFJj1Q9vhIKb_RGjWeSIh6vKHKkFR-ff5ZvsJaqkH9IrjfP9TP-qecmXiPt0Ly0W2-1TaPe8hTLrov6Agw8ecAbSrnWTJuJIClJWXGEustC7ZjINKdtTK251J93L1ygv36KTn_wW3o75c', '2025-08-27 07:54:38'),
(4, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyMDk1OTIsImV4cCI6MTc1NjI5NTk5Miwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.tqWqo7PJKfEEAfHOzPiSoIC4Z4BtkgayyCoKemIC98TT6HMN61WX2-HEkDEh_UWX92dieQn6GaLNACWU3EzGEYuI3JSGeU1cgii6Dmki9HTbmGiCpVR5qep_uOJfbv4SxPMDr0kmFcCdq6CAoGGHH04vIWNTaWJRsUO3MEHgXJ1vrdYvQ-a3Ok1xjmxTwQAwfGmk5_a9p8M3SiI_No9MfhmhgrZ4hPvolpvyG5orqxS-MygYIHUOpbIx05mpRf76JOy8xtJvwBf_cxJl8XL2WY4w1ZE3xhx2X2FAMzXc7Z8f5Xve5W10iFVz6DHv2ojWaf6H3poDTqi0iBjf4WveYZloTrhnRa2vIOuW73zafnmJkHDhEzqFsp_nvAheTpY8zl_Wg69KuSqp5oSiWXQe3WsMMuqm33ZQz_fjQrmkd4CxcqMTywlsMd_LclfOrQy6d_0CdtPD4naPCaa-OgZgRgCEONY5gJAc9h1c_GyFjAH-75udq4JGxHhubH0DB7oyCNijd9K5IyuStrX52sFri060G2dENyivx9sHvzsZm_mvNMfnDkwgHfU5F7_yEX8H-vlsuAd7Y1oMKztGrs4jDmoI_TU4mlJebPenQMwfLzB48HL7tPEZ5-moLLOJROpE3a_eU5uxcScYGr8szTSzccz45kuKRA9JMsTEGkmAgGI', '2025-08-27 11:59:52'),
(5, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyMzM2ODcsImV4cCI6MTc1NjMyMDA4Nywicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.fLitjbN3pTNfdcUsL2-bE5xiUedm9qLQa6I8Fw6X4Mh5tsJaW5NERwsZflZhR4eDe9tJqIbX3gqYWNx8wb9h1aetlzMGzNzARnWBDGoLE7UfnkXV_mcQr1BTYCZ2U_IUwcUZFrR1v1Krvb5IYnIczhe_5bqsIJpzI2PRuDar8eBzkIf1DwahB5bRIekb_XJFzKUVXJK_KMCH5s5SiguaBYAJiAcdTOqMbbhjywVXA_6YbD88Cvy_medEWnPUDfazMIJnVvOG_BdBRBlix9_7cU3H6PydUr6kRQMT8LfqQrZoHAhTwJzm15YysxYAQmWkRfdM7_th2CeYQ5zApaHv4Zl1uOT5FApaz4DKSAbhzjB06pFJaeGPrN9zmtMWEGdCEle81NBSqQE1spiCfoFqiM2Vmqw_4pX63PooH55yUsdw5EZ-mZ97slGDwsjZns0VTblkRrUoS6asWLJqykJe-t1TgbM6VJbnEEMu5dk4m0Dg249d-0uDVhAkkSp2jNzAFc0GgoikvOfz0Wjd4CZCw_EW0G-bH-37OLwQpUkUOxEUeYbORykJrnxvy-MRL56TmFm6CSKK3AhNEThCoPBOmJebKxG5OuQtJ3KIyUd-y6ygNiQmKraqHur8Twl_64eO5HIjq6CSfxhK6m_FJI_PVv-N4SC7jZHLxcQao_x29DM', '2025-08-27 18:41:27'),
(6, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyNDM2MjQsImV4cCI6MTc1NjMzMDAyNCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzdXJ2ZXlvcjJAZ21haWwuY29tIiwiaWQiOjQsImJ1c2luZXNzX25hbWUiOiJTdXJ2ZXlvciAyIn0.yyNCrvmXkDNwvAyqcy3jxSBGcVkukpqGPg2tb0n9BKdeTEoIrvztrfl3UC9j7anQn-g4-QKQ973DIMXxKwZ1klrdv5uWtKtEHenp7Puzgq3JTAIbTL4TvkSeU6jOXMo1D3123hWPsfWUoLCWHAWERv1PJjyp4mlGub211YEyBm9QuzMBV-hY4HedOJMxorBk1MZYZooW1xuWrdvns4agdjI3UucaF29gaRV71V8MFpa5zQKxpwnCyC7QG5Nn8nYnlr-LRyDHUooNT9hpU-aARQQftb_Pb77LKLQGScQkaPfp0BELUmYRuGknwin7X9NWVr8H66RSmWMnzdEFhgFrjpe4v5TL2lu7qp9oEf8V-mninhE9TTS09G4g31dgDTYHuTlhPldWp6IwcMq85qdDaKXqFh8FFEc7oOKTzVF3XT7iDNo9WZP9affWf9P3qolF_k8zvbPt77OVFTDenLNbMOnSA6NwvVIHYWCxPrW1ipWt-Vpm8uBhKbSvSragocobfnPwu0yCI_tSRocoFha3evXI26hGER36xmfbTSiED-doDaVEXWjn-fBJciFC4nAWtYt_-AnFWZE-MA_Z5kvYDcqSUaJBRZNptxxu86VXxYdTqFsyKz2rDlI4NKi8T2-c_xFtS9WuKPQ2Yvf1r5dgmBY4vgQk-g7IArjuK0tXIBo', '2025-08-27 21:27:04'),
(7, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyNDM3MDcsImV4cCI6MTc1NjMzMDEwNywicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzdXJ2ZXlvcjJAZ21haWwuY29tIiwiaWQiOjQsImJ1c2luZXNzX25hbWUiOiJTdXJ2ZXlvciAyIn0.aVPMZXvA-h_0d_5ev7ZHzk0AlN4jCbvTNeKOxWcHvevhPZ6tH07-CB2SukynWoOl8Gz2M5zOtqsllORZbOSb1WVW_V692tKy5WIRIk0P_jLJNhkqJm3iIa2vZa4Gs0oIYa__yIQgWqVLV_m-1nfBSn3fE3n2vaqA6KTaRXs5vlvp0XzOJlACfsp5cg_YDWxIoWMpBHkR1vFYy94RhVgbGVawZFBysmpmjjDWlLXNhOs8Hjn5xBVSIzfBq0zAjLCBef6GOHGyA3-jScXXuCDTgbzexZoffDO_vaD91QksJQMphS32UYsY73KUBhDNaAqTA4tRiUV2anlhFs_nit3dxeeX9sM3OXqKAQKDiCpaSeL05W4rL9LYoJSZle3vS4D2INiHJz4MlTeE11fiy1Y_W3LCTYQbYvQcGuEfp8BSBD3j55_-wXRTYHqTzupsygCop6uMQXC3ijp6m68wBDA305TQHD_cbAsMXP17hTvcLLKZpOLkSRwii4IvV0qOB8G6p3w8WU_cQmjjUI1vVA2uGQNj-TmktIfM3KTvJZXEhQW45s5G7hLVVkF4TyB81Ya5hGXd1auL6VzZFo_G2P4YVcnZsmOGU_vn6Qyx_GZEEva0EfuwupL5CccrTLaniZfw1Nuu3bIiiNJCO_Fc4qs0NEJYJF4-vTljqOf1kXHZSbw', '2025-08-27 21:28:27'),
(8, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyNDM3MjIsImV4cCI6MTc1NjMzMDEyMiwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.fhmqFe0Fu7qgotL6zTK_Izi3Tn_hwqaFWym_F7PHbkAT3dsNq7MmDo03c71ZvxKZIagwm2_7RKME5SfBKiZKNTfHWCVSDkSKT1bgtPtmLi8GvTOE2cbKqlhc-HGvDEgvYRrtS2eUI-k72vefY3iwk1oF6vJWwsLaPHBO8Cpo3ZHH223sAPFkEIcqoXe3HUgMB58-FhwfVl04Zc3femOgTQVLIoBiuM8Ykp4aDxHxADNYr0_I9ZUfAjjIcVOrmuP83vOg3OC_OjMwUI3DFprRUZvETOqynMhOmF04anDoNJfXjaiLfIP5xlW20gZ8y4KPuUogXtYtNqxZHPPMWC3bwrVnQX5DfVKh3J8WuDGBNyj2aw26L7eSvHhjfSF9J2bpHAe9TBUi0LEvauilfzHfBxu5dPDNhV_H146pGtnPJXvnn93FPo7I1sEm-rZGgjtVv9bpdhn0H5S4lSvSSnTsGqdfQPOnWd5M39P2bES0k-iZ1WbZWacPk5gtV3SCehh8udLbdKX6QD2QSWfytQVcGM13rdg4fEXGPsSdx5vmSxeki4AlWdWdc-wGtiXFnBjXnKqZQxKNASJb0in8j7jp6CnBvAybpSyv-vjeBodE_5oIMIMsiV8S0ScqA0TtuQTamVvBWpeEFkhlGZedlbbsch3tPTGjI8jCW9CZEESRPw4', '2025-08-27 21:28:42'),
(9, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyNDQwOTgsImV4cCI6MTc1NjMzMDQ5OCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.FFVr1NT4XzJzomJRxQZB_Q2nbN88DDEowk1MdltA2OGNciu0BeodYOTmzUqrSwB_s0lJz-3ESc4xw77FrXOOmsDfDqbGB0Cy_KVxaUIG8rYWncIjQ8yvj0pLJhY3aAxd6ajCM54DxdN6xSt4Zwbzdd4pLBj1pMTks9d_3uCXCxxmrwHhIBdN1t2e4ulWU6sMULw6VuF5QQnP9Egugf2JgEb0JEGNIxJ65bcQdMzBuJmJBVDeGeoCK_VdCUCA6o7rkLWZ-BR2uN0zJyHAUuhP9V5xRuzXynQnE4drYl8vFlK2NFZDQvWPk5Q_f_WGhQYrRU2bT1plqenMwFxRlVlLDMa-0ORKAIaQ2aN4nv7dxanlkZY2xZLqo89oPniy5QtUf27VbvLcxB361oD8PLMlRGrARgu3tdjcov2OAUH5axEyI9jQpxTp3OD3XKYN3vzu-rj2vXE4BUaz5rZkqXdfliJd6AQsDXT2LDgCv6iAhROAnUZxkQ8_q7e3CB1nfIWm8gJVzQUK8klSC1zu0pNAQM5OuElGuDdVbgYN8FQJVQff4JWzYKqq5qNJdGNbSK7yRk_-Wfu5MjSFr90gyOTUMPJvTstH6ZwO5W3GREkAQpCwtHBouxGz0LOyZGxjyTTPlYfNTQ8scoNUyC6MBEg-DdnJA9qRLeNqu3v4oAdcshY', '2025-08-27 21:34:58'),
(10, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyNDQ4MzksImV4cCI6MTc1NjMzMTIzOSwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.PlQJY7Y3QdEygziisjwLwOwY6P1oh0yL5MCD6skeK7gj-OajWD60m2b6Z_m8ydmLncRS6_tar5M2g9pH1KpaDvG1s_1Cr0UladxzdlADbU6iX1fj3EaRIQQgNr9Eqw4o8aQEgRUlUs58lMgfUpIw0YwAVI7pBCGNSQuqfdJz4Bqw30k0lLsEx05lYzN_835FdXb0CaXljYLCMP3cSiLS45Qyy3haaNnpYSG8BropHCQrFolDPqmYvua_W05o1YSTVTKC3Lsl6ozqp3GLnV087KalCvGIoVTNTw9Lv7UD08DpAKkE3PX3vKTfERQPhSjsTEggkLMP91hNd5Ec-OWEKPBie2ypnfjFoM5dPHE9ICmFNMqT0uPIJGO3SadqD3wya_XpTs14Mka8wfCCbzDqB_6unUx65WyjkjQWSmdpG7UMQbhoE3PAU53122DsVB-JMO9wd1n3tLhwwk1LGesoSvcfrxWHeLcmE-6VN4ot70VczDwz-bPkZHo2KI1OYV7GX_lG4zlIuG3jRMwiVTPlwXeRSilRoK6S-wzfd4Cj9BZI4i3eydgnWs2S2VfB_TApvNk8klbQf5H-qXr18mtxpsLbmgtArZ6IKVsBEBn1xOLU02Tu7luAytbD3ABmtiX4nwytJD2Bpsd_Lt76Hr4USY6KvQ9qkVBynKUVc790TtQ', '2025-08-27 21:47:19'),
(11, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyNDUxMTQsImV4cCI6MTc1NjMzMTUxNCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.yBu5L2lnp86ElzXInLnKg0i5flyf71FQ71VLccpVRm_9FUBxzq4A6i2hYFqEA7gOD4C1ybDIJWmTiomIri60lyxFJJmodw1nQwMYo2nuf_2PUw9vxBS7P-hRAE4tXyQDfqS4Ufqw6fPJbFPmyDDGyecbsJAd4_4Khq5hrpJhMi2AgY9oXL6LmvrlVW2XmFTrS6zfMmjU3j2aZDeuIerkddh8PwNt102fH8rOqfANSuSQ7PsL7iyrsZsPr4W7cCRSFuIaJw3v20rnnOvkcTD9hHU2HlfxX7NDjBShJDFcJjcvrrhaizLD5VZfeuY9YYcmjNzbFrp8wFWPhDoT8SILw_85r0VWG9dufxhVKLhs_EQZeabJ5Kyb2oPge_SWhPfeCZebwlna09azg9tfBNJcquuaQKk7s-xwBq4yTMbZBlTX5qtkDwM0PueodSzm0qZUyeXyoS0fY5JJqvf4Xwyeop4tGDGnxR6zAHkU6dDmAt9ztPejbv7P64oyJOG-IX2PCyTj3BzRX9CbpRZs7J5-Nl39x-eeRL4tiu5CKZ0xz_zWFxPjdm4Qwzvz2pYitVhL2IBM_cWJnFBx79AtJG-7QTpE4vvs6TIJWiMPK0ZO7NNYFL76Dbz_O2lKQLlKUtZwh58J4oK4JJYrlZrafYhL4n3pDkT6J-xWnzXj6rZMkKo', '2025-08-27 21:51:54'),
(12, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTYyNzg4ODgsImV4cCI6MTc1NjM2NTI4OCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.vWVRJ9T--vAGyNqyoCGz6SwYKhceXx9GL7zJwhxMzgZrLbriuB0-zI_fQTzGteV42YxZII-dRXdWOW8QIZ-R8a8aZcKJZMuGjp-v3LhN4uphZwgUbTkGf3aQNPYQKUnMOO7go1Is9ixIr4MRkEl8igBEoQcAExkCmrP1NaJfFTOscQbDqws59GtbNmezr3L0qkze7-LMcnffhacTwZZ1c2xSMwGuon0t05F8ha7WuSHgPwFisZ6_csqi0TpiERPAH9a2dT1SZKi47c0fAADakxkYIv2h8j29UPKAKjLWyQo_BHBKM6ERpA8Al7E9McKFMtvT_mmZ_reaHMdSU7d50LaGnfiITKsXvu0Setj3M3xlud2UYyCuVEe2va0LPl1K0HagsAs4R3BeRig58NnsLxBqc90I_mbVOY9MvVscXHlrTcTyTT69GIJSXX3RfjEbizG_cNiMSv6JryNbQNJqnoXdgBNbUsaD2pzw2um9quNr4pIt9HTLKOcywQh4a7guPDV4bl0nMM_sUVm04hJwU7yh4J9zVj5mpr4r4WsA2eWAXLxFmYlJyPwZqJSyI4sU3A55f5FrZSpJhoXF9OSdDwaKzv0r8rMsi9lrX-A37C4fkY2Zi3o8mUEYfxBJmEBVsNE-7Cg2VOAvJBYLtBsDSnlYik_Phrc5DvkLrKmP9TI', '2025-08-28 07:14:48'),
(13, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTY3OTYxNDYsImV4cCI6MTc1Njg4MjU0Niwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.Ij1YL3a16SGMmdWkWpTYPBAc32SuBZ80TeOf2qaFvQYprOOyprP7e7KzsPdkC_CE7n8fIrlQaS-6lt2mN8xKA6e9LScnL3afLEtKx0bkquNKow7uEQCkiqev4TeRy3_RLNAqOEhCzxcNF1PNQaTw0gVyhjtWICSr4Dk-GSVZwIrrZYIhvNyi2o5s6Vdo8RBUTpJ7YWmCF_VfQ4YvolQNNWiVAA9YFe6K_nuqYHu-z6ThGwUXwU7KVuI64e72fvE2HgXs3JHOCsEgzeFIQXRzXdKZZxYhXRybVHlckTng8HI82zRCaR9gsGp98WFUNEJTIzst8O2DILOiPeAdiLjOcip3CerewfRmjUQa9FZxwcLWeOE9GkSLDFh78xYjv8R9iBaxER0XP8Frrr94l_Jw0WKVEUGCTommap3IF_XkmH1a3rEwyG-WaZcINjRaT_IdQ2n6UuO84bje-NnQ_ush8LQb50D6VbqqxWgRCUk8T84rQXObJB3O3f06QGg5bnIQCKVQqjykM_pqXTiPlfMejBp7i5Cq3pRq12-LOxV0zNtaSKpdLQQ1II_zK9YbeLBXM8qKlvR9vp0fqeSPsFNTImq-Wf0r-DjfsqZKNs08HVkEli0d3M1OGRCLAGsZ59Tv39jMwlyaAeQmyXwX_4TdRBxw6520IdU1S96ZMLfUnMo', '2025-09-03 06:55:46'),
(14, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTc2NTkyNzIsImV4cCI6MTc1NzY3MzY3Miwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.yi2OlsLzb_XbB-PRXBlSQJAHqNJP7x1gtXMFSXOIbJiTnYFygUrkO2t8KLTjQy4-4WgkGiXNxeuVYCqbQ1nIh9Hsw_04HunZHqn1HCjX9l6BarK5Mq4E8EEgFrLGb0nepeeTcl7InDBTjVfAH9t6GVcJSVkqu8gkh8xfCQWKFQMNyrNj7xp4Wvo8wB-TNPgHOwfa2afXqH-wEkaZRCRICugFghHz5h2hIif6OoMYenzI99GAh4yjxI4oIihSO9AaBh90gRDlb675gDNNZN6_odcRU_b-Q1Fd7isyw8_v_g1C0Hr2BAMjt5a6DBWrShh4JJM6AJTBPRVAZcJExmG4CCt6XHEf-JuURtLKTCaFj_Ie11WmIRy8x2YRoSqBP7G8zhO0ySC40W7PpbcQr-s5OalUDgsSJUfXbYWNXjS8R7FM1L1GX3qhjOCnXKXx0uFeuOiKmQWMzSywswDnhol-Ark9MVXMYczDN-_iVVgSgjgEsvsniLP7wgjQV76XqpdlFu-iM3wgO7NMklQ4j5jxOHQQmw475Eioq-6y_kozXpproEBDQoQmwtN2oh7g34tgVe-DbPYM_iCfbhi69TqCH4JU61jjWi3qb0pYX6dNj7oOPGQH0TS64260K60sE5Fa3-tLbPFP486zg4bS3-65tIqhY9VEGMwrszmNMaXgDPQ', '2025-09-12 10:41:12'),
(15, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTc2NTkyODAsImV4cCI6MTc1NzY3MzY4MCwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.dkoz4UyHauxe4h1rZcNQxK7jnsf4UuKb6WQvh6Ljo9TuAQwqHqcbPkz529RDI19sj-pMfqRWqwOx5Ec_dNIw37W_55wnewaBXYXn14LReSsGYm_bGOcMRePwr7KkOpKwa7szMSNdL6fi2SkLkE-z2dmPA9G2Uy0YLIghi1M02iGJyOkjVsPE8pXVCzdgiWKwOi5IVN6iP_r1N0cs2T9Gt3nMe6vMANQkGumKPMApx86BX5S6IuUd-naTdiWk3Xknjty0SUr7dz2iB9Y77cThUVfJvTfVzjDtQ0jD1svD6oiDjeRRS6TOQ9gLUyC5MpGupDxglUHwKsw07wqnJjitG8VdAO_tJZkKsi0RPOeW4cqzkYGAO5ryjNZ2MoP-0qqk97rdBF9GlRGaJCe7CMdkqDDmBeH7QRwHUTpPcFMpqa99IPMst9iy1WMdknjCjJZWfT6UviBtDBBAG2v1S9n_cmERbhwBx6OGjtlgwyg1NNH7jrGdSixmCNiwBBHdBciHX1AfbD_Aphvq_dyyYG7EIzNApHwtVgAGU-UPaHt8IY7k4miZrgaWFVj5dWRugwn_2Syo1FfmcbiSb8kArrdysUpUV67UV7bXhc5lMm8R-ln8e-rdx4RMH8A1SaeHXNZPxm9fPxUiJa-jQhhr2Ouw7HZASuvoZCaphrkqmMc2qJ0', '2025-09-12 10:41:20'),
(16, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTc2NjMwNDcsImV4cCI6MTc1NzY3NzQ0Nywicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.g8IH_i9h_pKjmKGNEFBF06rzOnMXWMT4JgoZvz3gp46MJz9rnGfYhgc5VObIdGgG8W-KffWobBDu4e1lsYJYqqbTwNZZbkGZ0Mt3v84vRkBGnJbE30lqZp1whsCpHprVNMIAwy2PL5g4xmgnxMGHFm6EpDcMNmxMjzPBD2WHpBeEXXYbh3MWdYjjpNSdB_YhZEmhCJD0p5vuvZMF4lhQzVnHF2TnKuUt3mV2maNjdU9RAsYrJdQ2T2-cRM2sy7BekWpjNXCPfdanB5T3qG-HqytoUPTjiQv_Tt275scmLAICBRzYf6uEwT9HDNIMYJEfAfAbOMz1GnNOGALyJAySp8c0p9kd2J-xXLoplhpofjwNE0gOBqYPhl8zLWkPxr1sT6N---R1O1ZSb_nsE1scWjKdAmnJ1zu9IWW6I65dFYqtSbZOr7WY61THne6-blQ006zlHlLRUWTgF_Q4DKo93mpFed8bo88s7onmkzhdqOL5HJDQT7tsCnf3WY2z3l3_-nycDg-H7KWSt1lrPV0MzyIL7PoDq-1_L5cORov7KXpP8GcBxYlqXKFPGcNgnQm7GfF0y3ptTKkkon6l8H8G7O1TVBmWuvlgqdDPAPuNhgfmA53D5Bs6aCizlVX8qMxxJ4nrasRwtbk0Njkh7cH1sQA1wPlJFyv9y68Z2j0bagU', '2025-09-12 11:44:07'),
(17, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTc2NzQ3MzUsImV4cCI6MTc1NzY4OTEzNSwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.XC_cUbQv0nAisdYTe8FZWjM1SIzdUxSFYx3HV6Zgss8mT6vuCPf9R9395pd-i8A3U2u6HJwTQpembbo1lpbLxt6oicY4Cv4XWc0V4lXsEjZlOiTtwJ3Ml-W6d2fq_EQLy9g7ybmSEooFEF9vbnHf0Mc8vv7O-dFyPPA2ynGQKLGKp0JnT9IryA5nSVmMX1C8Bl4a2BAcCA2nCyghbvVBQ_1Nh3OcnzUPU06K0PTzxfXt0EpTGiPb7q4uacOcGM7jE8kEqlCSR9HiHmk-0PpVVsOGfXCPQpSRX4BqCcrOnPVTUegqnFrp8jqbE_TFvuYIhE6m47UCQb3-Grz-p04tbmUMPBknxM40A0uub34jvhs_gGhhfn6t73YBRhZLgSJg6mEEuLJUJjpa6Kp9SQKPvFL65OB1_wXSzh_mO3b7UieLQvqXrkmA7-xEFONLmY6eXBKcSV5oX30awb0PdL30kUzcXi6rBD5EC9vS2mYhRvzs-YZbTxY8tQEIsSQW50zNSD6jyRSZKsqSroI7vyHWctJE32ngC6q6BEFvZmbobB5mjsVVYM9LyAkdn30HbIV88XbDbSirxg9GFbe7hQImXLODcHueu4d2pqJ5JiGkkWPZwmSGFbtHe-lfKDICU9207XK0tEWHirsGBpmcIBSv5hX6-D35iTT-m9ir4A9ZAMM', '2025-09-12 14:58:55'),
(18, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTc2NzUxMzYsImV4cCI6MTc1NzY4OTUzNiwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.f2pCgE4v8qUdC9ZfAVj1fTfRPPMkFLJO-KTFwt17bghOodoSUppLaL00bUCD8dE-2Y87rxBWU0sU7YHNOG5D1MewQ_4QNjUARSibba2Y6-hrz104P4JFVIBUPZWHEzi3VtZDllhBbDRFwSXSk6xURZCmy77YjtPNYmgcG0FBvgWksEHvuPRMiaYiuFIRwXg9ICvc4XDqjBH4Yz-gxgmworPWPIMaHHfuXe2EatmyRs-ymLsnK8azdjpPEmGZ9E9mY6P-RRhrA_bW_dd7BXff4JtXDuJf1fw1xMkSL4VRtyIjwiaCLl_mp_Rj1KviXP2lMAgH99b-JDpUMWqPD0zjAqbwXPEA0bdaCd39X3wgR68zjv3UQrrACin4Bj46E_MKEWVLEiDr8J3EbEhEaD3eqgfZxtneUDGwUfYMm0i_UZb74P8Mf-gzDQLLuBgBgpQ-27EhNUjUMLPqZQMyyJCWg4h90FBCkQKqu2RiqH-QB7mIpCVyy-uvg87tfNO1dWdyjgl3iLefxGRAsTHGC3R4fjrNtOl6xpZK7gKoLX1MHMERMuGM6icownXBtFvL_OD8u4EppdepRGInJ1M1Fyxb9bNuyLTWZf8DPbHuE739PHYRlqLmEu9oIcqct0rBrGkg5-CQ9jLDVTYOFtOMF1kmq1vcCrIfqW4lKuXuTljgYfE', '2025-09-12 15:05:36'),
(19, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTc2NzUyMjcsImV4cCI6MTc1NzY4OTYyNywicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.Ja63pswtpQZUoCHubomXjIgVi-m2ob3gpkzUEbfT7TFuS80wciEBahy-hTedJYd77VRbAOP4TQQsFvnCVsRAI7xkV6Rkaa6ElfGVwjQoSK-Owb5aas7Qlpyd72TUoYovBYjoWA3-1iHRaMTrjR1HWX6_cfMBSgISDGe6cRHdZ9Bsdsgw5kz8LvNoAaoyXvDlfD45NQ5QpEU5T_j4-d2JpK2AallSGs4bNC6nZtWb63-_WmRTQq03l3TaRVXfdt-AD8zjCBLVk-1VzuAi331h28wTJBy1Pv9eN4Gut9N0l7wZX_bTh6bRXUiIdhHE3KV58YjQ-5Fw0EksfP10nNa3Rh0s-WZ0zFKWVC0M01Z6qP2DZK9ikpxA7BSHA8jGMvEKNfhHaup4WGCeKxgoyW37badDKpkZgucnmItjYjcvpKyL-VLh0P-ekZ1fTqMou5GI1iXkHuCInm_rGfRRksp35UXlQ8xvgyYgyACHOJ0MamU00SMyqQDWdwHzq65thdppQD5PFuzxRsi81fiazM8J4MNHMDP1N6lqCCYdaNhZWEgoZ_jtsNPYz1CjGfr6FtLj574QqgooA8VtctyzK-FvGCIPmFzyrurK8uTFQP1cB7VxsrhRl7o-wkPZecgQx-iSiPiuPIybTO23T-fmVSpGzyl7edbMrai5GqJgwyePEL8', '2025-09-12 15:07:07'),
(20, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTc2NzUzODcsImV4cCI6MTc1NzY4OTc4Nywicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlN1cnZleW9yIDMifQ.ZnLNR_lWYwnMEiWHxK47XwzQA8xWg7BJ72Adj1XuQ4us6PwYYQRi6CBpW7ia9b_9AyLHiBkJNhrLG91_7Qe-mwVvDOS5dx_6zOBN8XIOGCqEeuaTGgZFiW9S2cr72OJKcCdZtJHtGrCM79PvjbedU4SSZncZx4QOF9NyCkXL7beriCItQxWO2tHhIweHx90LH60ffO1RZZ8pL-ukCFowrKcEh6g8MHagQZwI6IB_AIguYfQKWBmRbvab7ePq23dYVw8bcIBX1Kb0LWh6zWirWlMACqrrwvZt8WJ9eAEhbE1vwp9AJeUFY5Ny6REhqgBXHvJD1HHqamvgwEDYiW6v7BE794TfNTGiX8BVand7SAVj1kCza9itWMaX_jmobSw0WupulGHvPsK14JguMTEynYdz-B6bbGsBgyBpZQiOaXxZFMVipuhmc-YhcHnqkFOtrQGJNBeLZpu9RWZYlKU9L94kScAftn87irUzKHT0-ptnCY0dUoqeVRVHDcHegwgJMZRt5i8fCHNhCCg8TutvzGYed8WOdFPmMlr0OWET85mShq9AxMnLCsnLn2rEi7w2ua0FNsokbFNJ7uM1jrXQHc5aQhvaDL-qMtuBfIuGv-C3tpGFq_GgcHkSMVN_bPc48P3Paan4vmCp7humlg8A5MQwCXXkRESM1Dv5kJh3BBA', '2025-09-12 15:09:47'),
(21, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NTkyMTQxNzksImV4cCI6MTc1OTIyODU3OSwicm9sZXMiOlsic3VydmV5b3IiXSwidXNlcm5hbWUiOiJzYW50YXRyYUBnbWFpbC5jb20iLCJpZCI6NSwiYnVzaW5lc3NfbmFtZSI6IlNhbnRhdHJhIE1paGFyaW1ib2xhIn0.M73uPkYdDD1XgONS8aNxiwbY2lN79vBMqRzW0ImTa63tx6bNc9PcISBNNYjLmAxQ-FReOvDD3nqZRlkU2RFKfgZq8_YQCy1XgBEV9jSMtsU5z31N--TciWNok39a0FG4TdkPvU8vJj1pF_hIoNqoJShf_3jvnZeqvZQvd6XVfOIqOoOEt1c0eYRVGsfzLzk-Yi7tw1bdtQU-Z669u2thTjNwKbQ9mPxK2rdaiuiywzW7aoHKUFMdkfMWajaLNIHxeL2qJyE6j9ZlUubn4qzPbkCOzZ3KSsFF79p6gubtTQMqHY6gT7VqXSE046GjKX9S1Cwdp79IS15meO9LmvzcmhQzQspswABbPXxsb_r7MetxI2nGNHEeAv6H-5xgApUyvXVeNQ2tndeekI5HZaCRXgCATOjjmfOnETuJMHy6TH4fOnNwgxv6QR3_5fKwq_Ul6lcZdM9kh6y9oKpURY9zJO3wWjvey2zz5kNJDbdVZV2MqaKw8_k18XmJlz6QCEoWkSGCUfjGEzcxi2N-C2RRwhHiLO7SXkYnGcXiHE2h57sq9zLywdFA3BnhPXTr2STPuEvYsKQtGDPun6sQLAKCbTjDS6o1Lqn0boyTvO4gJ79cVdzHWwRJ8rsgqtujcN6eC9L3lzxhBU4h6g_inJbyGcd7WU9vUDwfpXe_JrD9d5k', '2025-09-30 10:36:19');

-- --------------------------------------------------------

--
-- Table structure for table `claims`
--

DROP TABLE IF EXISTS `claims`;
CREATE TABLE IF NOT EXISTS `claims` (
  `id` int NOT NULL AUTO_INCREMENT,
  `received_date` date NOT NULL DEFAULT (curdate()),
  `number` varchar(255) NOT NULL,
  `name` varchar(45) NOT NULL,
  `registration_number` varchar(45) NOT NULL,
  `ageing` int NOT NULL,
  `phone` varchar(255) NOT NULL,
  `affected` tinyint DEFAULT NULL,
  `status_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `fk_claims_status1_idx` (`status_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `claims`
--

INSERT INTO `claims` (`id`, `received_date`, `number`, `name`, `registration_number`, `ageing`, `phone`, `affected`, `status_id`) VALUES
(1, '2025-06-29', 'M0119921', 'Brandon Philipps', '9559 AG 23', 120, '55487956', 1, 1),
(2, '2025-06-30', 'M0119922', 'Christofer Curtis', '1 JN 24', 96, '54789632', 1, 1),
(3, '2025-06-01', 'M0119923', 'Kierra', '95 ZN 15', 72, '58796301', 1, 4),
(4, '2025-07-02', 'M0119924', 'Test dev 1', '1525 ZN 45', 48, '48503895', 1, 1),
(6, '2025-07-05', 'M0119925', 'Amanda Vickers', '8596 XD 44', 60, '59203456', 1, 1),
(7, '2025-07-06', 'M0119926', 'Daniel Moore', '4412 BG 12', 36, '59216789', 0, 1),
(8, '2025-07-07', 'M0119927', 'Lucinda Evans', '7925 ZA 09', 15, '59984512', 1, 2),
(9, '2025-07-08', 'M0119928', 'Marcus Reed', '2233 BY 22', 90, '59321478', 1, 2),
(10, '2025-07-09', 'M0119929', 'Jasmine White', '6547 CG 88', 105, '59123658', 0, 1),
(11, '2025-07-10', 'M0119930', 'Nathan Scott', '8833 LM 01', 20, '59632145', 1, 2),
(12, '2025-07-11', 'M0119931', 'Sarah Foster', '1144 JN 99', 50, '59876543', 0, 1),
(13, '2025-07-12', 'M0119932', 'Tyler Brown', '4321 GT 76', 80, '59001234', 1, 1),
(14, '2025-07-13', 'M0119933', 'Emily Davis', '2312 QQ 56', 110, '59234567', 0, 2),
(15, '2025-07-14', 'M0119934', 'George Clark', '9988 RS 34', 65, '59432167', 1, 1),
(16, '2025-07-15', 'M0119935', 'Isabelle Turner', '7865 YT 90', 30, '59764321', 0, 2),
(17, '2025-07-16', 'M0119936', 'Liam Johnson', '3021 AZ 78', 25, '59112233', 1, 1),
(18, '2025-08-07', 'M0119937', 'Jean', '7387283 AN 52', 13, '3263723829', 1, 3),
(19, '2025-08-07', 'M0119938', 'Marie', '28938 IT 08', 11, '827323739', 1, 4),
(20, '2025-08-07', 'M0119939', 'Lulu', '893892 TF 03', 10, '8297379230', 1, 9);

-- --------------------------------------------------------

--
-- Table structure for table `claim_partial_info`
--

DROP TABLE IF EXISTS `claim_partial_info`;
CREATE TABLE IF NOT EXISTS `claim_partial_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `claim_number` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `make` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `model` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cc` int DEFAULT NULL,
  `fuel_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `transmission` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `engine_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `chasis_no` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehicle_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `garage` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `garage_address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `garage_contact_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `eor_value` decimal(15,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_claim` (`claim_number`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `claim_partial_info`
--

INSERT INTO `claim_partial_info` (`id`, `claim_number`, `make`, `model`, `cc`, `fuel_type`, `transmission`, `engine_no`, `chasis_no`, `vehicle_no`, `garage`, `garage_address`, `garage_contact_no`, `eor_value`) VALUES
(1, 'M0119928', 'Toyota', 'Corolla', 1800, 'Petrol', 'Automatic', 'ENG12345', 'CHS67890', 'VEH001', 'Garage ABC', '123 Main Street, City', '123-456-7890', 15000.00),
(2, 'M0119929', 'Honda', 'Civic', 2000, 'Diesel', 'Manual', 'ENG54321', 'CHS09876', 'VEH002', 'Garage XYZ', '456 Elm Street, City', '098-765-4321', 18000.00),
(3, 'M0119930', 'Ford', 'Focus', 1600, 'Petrol', 'Automatic', 'ENG11111', 'CHS22222', 'VEH003', 'Garage LMN', '789 Oak Street, City', '555-123-4567', 14000.00),
(4, 'M0119923', 'Toyota', 'Corolla', 1500, 'Petrol', 'Automatic', 'ENG123456789', 'CHS987654321', 'ABC-123', 'Garage ABC', '123, Rue du Test, Quatre Bornes', '52521212', 105000.00),
(5, 'M0119925', 'Hyundai', 'i30', 77233, 'Petrol', 'Manuel', '036 NI 09', 'CHS987632', '787273 TG 09', 'Garage T', 'Quatre Bornes', '25327638', 250000.00),
(6, 'M0119926', 'Mazda', 'BT50', 1200, 'Petrol', 'Manuel', '036 NI 09', 'CHS987654321', '626 GT 23', 'Garage TE', 'Port Louis', '543729836', 105082.00),
(7, 'M0119931', 'Nissan', 'Altima', 2000, 'Petrol', 'Automatic', 'ENG22222', 'CHS33333', 'VEH004', 'Garage QRS', '321 Pine Street, City', '321-654-9870', 17500.00),
(8, 'M0119932', 'BMW', 'X5', 3000, 'Diesel', 'Automatic', 'ENG33333', 'CHS44444', 'VEH005', 'Garage UVW', '654 Maple Street, City', '432-987-6540', 45000.00),
(9, 'M0119933', 'Audi', 'A4', 1800, 'Petrol', 'Manual', 'ENG44444', 'CHS55555', 'VEH006', 'Garage RST', '987 Cedar Avenue, City', '987-654-3210', 38000.00),
(10, 'M0119934', 'Mercedes', 'C200', 2200, 'Diesel', 'Automatic', 'ENG55555', 'CHS66666', 'VEH007', 'Garage LMN', '159 Oak Avenue, City', '456-789-1230', 42000.00),
(11, 'M0119935', 'Kia', 'Sportage', 1600, 'Petrol', 'Manual', 'ENG66666', 'CHS77777', 'VEH008', 'Garage OPQ', '753 Birch Street, City', '654-321-0987', 19500.00),
(12, 'M0119936', 'Toyota', 'Camry', 2500, 'Petrol', 'Automatic', 'ENG77777', 'CHS88888', 'VEH009', 'Garage XYZ', '852 Spruce Street, City', '789-012-3456', 36000.00),
(13, 'M0119937', 'Volkswagen', 'Golf', 1400, 'Petrol', 'Manual', 'ENG88888', 'CHS99999', 'VEH010', 'Garage DEF', '963 Willow Street, City', '321-987-6540', 22000.00),
(14, 'M0119938', 'Hyundai', 'Tucson', 2000, 'Diesel', 'Automatic', 'ENG99999', 'CHS11111', 'VEH011', 'Garage GHI', '741 Cherry Avenue, City', '432-123-9870', 33000.00),
(15, 'M0119939', 'Honda', 'Accord', 1800, 'Petrol', 'Automatic', 'ENG11111', 'CHS22222', 'VEH012', 'Garage JKL', '852 Maple Lane, City', '543-210-6789', 28000.00);

-- --------------------------------------------------------

--
-- Table structure for table `communication_methods`
--

DROP TABLE IF EXISTS `communication_methods`;
CREATE TABLE IF NOT EXISTS `communication_methods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `method_code` varchar(45) NOT NULL,
  `method_name` varchar(45) NOT NULL,
  `description` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `method_code_UNIQUE` (`method_code`),
  UNIQUE KEY `method_name_UNIQUE` (`method_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `communication_methods`
--

INSERT INTO `communication_methods` (`id`, `method_code`, `method_name`, `description`, `updated_at`) VALUES
(1, 'email', 'Email', 'gffyfyuf', '2025-07-21 11:47:01'),
(2, 'sms', 'SMS', 'ggygu', '2025-07-21 11:47:01'),
(3, 'portal', 'Portal', 'hhghgh', '2025-07-21 11:47:24');

-- --------------------------------------------------------

--
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE IF NOT EXISTS `doctrine_migration_versions` (
  `version` varchar(191) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
CREATE TABLE IF NOT EXISTS `document` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date` datetime NOT NULL,
  `path` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `users_id` (`users_id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`id`, `users_id`, `name`, `date`, `path`) VALUES
(1, 5, 'test_doc_statement.pdf', '2025-09-15 09:45:53', 'test_doc_statement.pdf'),
(2, 5, 'test_doc_statement.pdf', '2025-09-15 09:50:42', 'test_doc_statement.pdf');

-- --------------------------------------------------------

--
-- Table structure for table `employment_information`
--

DROP TABLE IF EXISTS `employment_information`;
CREATE TABLE IF NOT EXISTS `employment_information` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `present_occupation` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `company_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `company_address` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `office_phone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `monthly_income` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_id` (`users_id`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employment_information`
--

INSERT INTO `employment_information` (`id`, `users_id`, `present_occupation`, `company_name`, `company_address`, `office_phone`, `monthly_income`) VALUES
(1, 5, 'abc', 'mauritius ltd', 'Port Louis', '+33 757 9897379', '3000');

-- --------------------------------------------------------

--
-- Table structure for table `financial_informations`
--

DROP TABLE IF EXISTS `financial_informations`;
CREATE TABLE IF NOT EXISTS `financial_informations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `vat_number` varchar(255) NOT NULL,
  `tax_identification_number` varchar(255) NOT NULL,
  `bank_name` varchar(150) NOT NULL,
  `bank_account_number` bigint NOT NULL,
  `swift_code` varchar(255) NOT NULL,
  `bank_holder_name` varchar(50) NOT NULL,
  `bank_address` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `bank_country` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_id_UNIQUE` (`users_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `financial_informations`
--

INSERT INTO `financial_informations` (`id`, `users_id`, `vat_number`, `tax_identification_number`, `bank_name`, `bank_account_number`, `swift_code`, `bank_holder_name`, `bank_address`, `bank_country`) VALUES
(1, 5, 'VAT0012345678', 'TIN4567890123', 'Global Bank PLC', 1234567890123456, 'GLBPPLM0123', 'Jean Dupont', '10 Rue de la République, Paris', 'France'),
(2, 11, '15', '222', 'mcb', 1111111111111, 'V446', 'Aisha Patel', '221B Baker Street, London', 'United Kingdom');

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
CREATE TABLE IF NOT EXISTS `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_no` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `date_submitted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `date_payment` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status_id` int NOT NULL,
  `users_id` int NOT NULL,
  `claim_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `claim_amount` float NOT NULL,
  `vat` enum('0','15') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '0',
  `invoice_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_paiement_status` (`status_id`),
  KEY `fk_paiement_users` (`users_id`),
  KEY `fk_paiement_claims` (`claim_number`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`id`, `invoice_no`, `date_submitted`, `date_payment`, `status_id`, `users_id`, `claim_number`, `claim_amount`, `vat`, `invoice_date`) VALUES
(1, '230736', '2025-07-29 21:00:00', '2025-07-15 21:00:00', 6, 5, 'M0119921', 10000, '15', '2025-08-11 10:40:10'),
(2, '23076', '2025-07-29 21:00:00', '2025-07-15 21:00:00', 6, 5, 'M0119926', 20000, '15', '2025-08-11 10:40:10'),
(3, '230737', '2025-07-27 21:00:00', '2025-07-27 21:00:00', 7, 5, 'M0119927', 372999, '', '2025-08-11 10:40:10'),
(4, '230738', '2025-07-24 21:00:00', '2025-07-25 21:00:00', 7, 5, 'M0119923', 787834, '', '2025-08-11 10:40:10'),
(5, '230739', '2025-07-19 21:00:00', '2025-07-21 21:00:00', 7, 5, 'M0119924', 12000, '', '2025-08-11 10:40:10'),
(6, '230740', '2025-07-18 21:00:00', '2025-07-20 21:00:00', 8, 5, 'M0119925', 21999, '', '2025-08-11 10:40:10'),
(7, '230741', '2025-07-28 21:00:00', '2025-07-29 21:00:00', 6, 5, 'M0119928', 787372, '', '2025-08-11 10:40:10'),
(8, '230742', '2025-07-26 21:00:00', '2025-07-27 21:00:00', 7, 5, 'M0119929', 10377, '', '2025-08-11 10:40:10'),
(9, '230743', '2025-07-25 21:00:00', '2025-07-26 21:00:00', 8, 5, 'M0119930', 107392, '', '2025-08-11 10:40:10'),
(10, '230744', '2025-07-24 21:00:00', '2025-07-25 21:00:00', 6, 5, 'M0119931', 7837720, '', '2025-08-11 10:40:10'),
(11, '230745', '2025-07-23 21:00:00', '2025-07-24 21:00:00', 7, 5, 'M0119932', 1783770, '', '2025-08-11 10:40:10');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `role_code` varchar(45) NOT NULL,
  `role_name` varchar(45) NOT NULL,
  `description` text,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_code_UNIQUE` (`role_code`),
  UNIQUE KEY `role_name_UNIQUE` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `role_code`, `role_name`, `description`, `updated_at`) VALUES
(1, 'surveyor', 'Surveyor', 'Utilisateur qui fait la vérificatoin', '2025-06-26 22:08:34'),
(2, 'garage', 'Garage', 'Utilisateur qui fait la réparation', '2025-06-26 22:08:34'),
(3, 'spare_part', 'Spare Part', 'Utilisateur qui est le fournisseur des pièces', '2025-06-26 22:09:57'),
(4, 'car_rentale', 'Car Rentale', 'Utilisateur pour la location voiture', '2025-06-26 22:09:57');

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
CREATE TABLE IF NOT EXISTS `status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status_code` varchar(45) DEFAULT NULL,
  `status_name` varchar(45) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `status_code`, `status_name`, `description`) VALUES
(1, 'new', 'New', 'Première statut des claims après affectatin'),
(2, 'draft', 'Draft', 'Status pendant intervention d\'un utilisateur'),
(3, 'in_progress', 'In Progress', 'Status après submit des formulaires'),
(4, 'completed', 'Completed', 'Status quand le paiement est effectué'),
(5, 'rejected', 'Rejected', 'Statut pour rejecter un claim'),
(6, 'under review', 'Under review', 'Paiement en cours d\'évaluation'),
(7, 'paid', 'Paid', 'payé'),
(8, 'approved', 'Approved', 'Paiement approuvé'),
(9, 'queries', 'Queries', 'status querie');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`) VALUES
(1, '2025-06-23 07:54:40', '2025-06-23 07:54:40'),
(2, '2025-06-23 07:54:46', '2025-06-23 07:54:46'),
(3, '2025-06-23 07:54:53', '2025-06-23 07:54:53'),
(4, '2025-06-26 22:49:06', '2025-06-26 22:49:06'),
(5, '2025-06-26 22:49:14', '2025-06-26 22:49:14'),
(6, '2025-06-26 22:53:25', '2025-06-26 22:53:25'),
(7, '2025-06-26 22:53:30', '2025-06-26 22:53:30'),
(8, '2025-07-23 10:12:06', '2025-07-23 10:12:06'),
(9, '2025-07-23 10:12:35', '2025-07-23 10:12:35'),
(10, '2025-07-23 10:14:34', '2025-07-23 10:14:34'),
(11, '2025-07-24 10:40:18', '2025-07-24 10:40:18');

-- --------------------------------------------------------

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE IF NOT EXISTS `user_roles` (
  `users_id` int NOT NULL,
  `roles_id` int NOT NULL,
  `assigned_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint DEFAULT '1',
  PRIMARY KEY (`users_id`,`roles_id`),
  KEY `fk_user_roles_users1_idx` (`users_id`),
  KEY `fk_user_roles_Roles1` (`roles_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `user_roles`
--

INSERT INTO `user_roles` (`users_id`, `roles_id`, `assigned_at`, `is_active`) VALUES
(1, 1, '2025-06-26 22:47:37', 1),
(2, 2, '2025-06-26 22:47:37', 1),
(3, 3, '2025-06-26 22:48:09', 1),
(4, 1, '2025-06-26 22:53:08', 1),
(5, 1, '2025-06-26 22:53:08', 1),
(6, 2, '2025-06-26 22:56:16', 1),
(7, 3, '2025-06-26 22:56:16', 1),
(11, 1, '2025-07-24 10:40:18', 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account_informations`
--
ALTER TABLE `account_informations`
  ADD CONSTRAINT `fk_account_informations_users` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `administrative_settings`
--
ALTER TABLE `administrative_settings`
  ADD CONSTRAINT `fk_administrative_settings_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `admin_settings_communications`
--
ALTER TABLE `admin_settings_communications`
  ADD CONSTRAINT `FK_42D45B45260B1BF7` FOREIGN KEY (`admin_setting_id`) REFERENCES `administrative_settings` (`id`),
  ADD CONSTRAINT `fk_admin_settings_communication_communication_methods1` FOREIGN KEY (`method_id`) REFERENCES `communication_methods` (`id`);

--
-- Constraints for table `assignment`
--
ALTER TABLE `assignment`
  ADD CONSTRAINT `fk_assignment_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`),
  ADD CONSTRAINT `fk_assignment_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `claims`
--
ALTER TABLE `claims`
  ADD CONSTRAINT `fk_claims_status1` FOREIGN KEY (`status_id`) REFERENCES `status` (`id`);

--
-- Constraints for table `financial_informations`
--
ALTER TABLE `financial_informations`
  ADD CONSTRAINT `fk_financial_informations_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `user_roles`
--
ALTER TABLE `user_roles`
  ADD CONSTRAINT `fk_user_roles_Roles1` FOREIGN KEY (`roles_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `fk_user_roles_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
