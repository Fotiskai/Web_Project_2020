-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 04, 2020 at 05:50 AM
-- Server version: 8.0.18
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `web2020`
--

-- --------------------------------------------------------

--
-- Table structure for table `admincred`
--

DROP TABLE IF EXISTS `admincred`;
CREATE TABLE IF NOT EXISTS `admincred` (
  `Username` text NOT NULL,
  `Password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admincred`
--

INSERT INTO `admincred` (`Username`, `Password`) VALUES
('admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

DROP TABLE IF EXISTS `data`;
CREATE TABLE IF NOT EXISTS `data` (
  `id` int(11) NOT NULL,
  `timestampMs` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `accuracy` int(11) NOT NULL,
  `heading` int(11) DEFAULT NULL,
  `velocity` int(11) DEFAULT NULL,
  `altitude` int(11) DEFAULT NULL,
  `verticalAccuracy` int(11) DEFAULT NULL,
  `type` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `confidence` int(128) DEFAULT NULL,
  `act_timestampMs` text CHARACTER SET utf8 COLLATE utf8_general_ci,
  `userid` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk` (`userid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `data`
--
-- --------------------------------------------------------

--
-- Table structure for table `usercred`
--

DROP TABLE IF EXISTS `usercred`;
CREATE TABLE IF NOT EXISTS `usercred` (
  `userid` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `username` text NOT NULL,
  `Password` text NOT NULL,
  `lastUpload` date DEFAULT NULL,
  `currentScore` double DEFAULT NULL,
  PRIMARY KEY (`userid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usercred`
--

--
-- Constraints for dumped tables
--

--
-- Constraints for table `data`
--
ALTER TABLE `data`
  ADD CONSTRAINT `fk_uid` FOREIGN KEY (`userid`) REFERENCES `usercred` (`userid`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
