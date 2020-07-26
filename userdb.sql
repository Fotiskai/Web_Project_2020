-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 26, 2020 at 12:39 PM
-- Server version: 5.7.26
-- PHP Version: 7.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `userdb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admincred`
--

DROP TABLE IF EXISTS `admincred`;
CREATE TABLE IF NOT EXISTS `admincred` (
  `Username` text NOT NULL,
  `Password` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `admincred`
--

INSERT INTO `admincred` (`Username`, `Password`) VALUES
('admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `usercred`
--

DROP TABLE IF EXISTS `usercred`;
CREATE TABLE IF NOT EXISTS `usercred` (
  `username` text NOT NULL,
  `userid` text NOT NULL,
  `Password` text NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Dumping data for table `usercred`
--

INSERT INTO `usercred` (`username`, `userid`, `Password`) VALUES
('apoiloi', 'VeOnwRpevDRSiW7J0B3/SJK6yN0Ryc7Kd+onzQEMwjE=', '9ee5c8fde99fd0bb8504c91559c5a765'),
('apoiloi', 'OC6WCEJ1rX5Suqgs2huCHf1+vQtr+Ud8McD2qPhxioA=', '9ee5c8fde99fd0bb8504c91559c5a765'),
('apoiloi123', '2/NbOrd01bU4DwGqvPHpiZfhoQ+tbDE3bgZAy7snfME=', '0a670d422f176cb7a0755352d94c9a59');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
