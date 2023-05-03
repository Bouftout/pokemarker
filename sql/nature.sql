-- phpMyAdmin SQL Dump
-- version 5.1.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql-pokemarker.alwaysdata.net
-- Generation Time: May 03, 2023 at 03:05 PM
-- Server version: 10.6.11-MariaDB
-- PHP Version: 7.4.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pokemarker_index`
--

-- --------------------------------------------------------

--
-- Table structure for table `nature`
--

CREATE TABLE `nature` (
  `id` int(11) NOT NULL,
  `natur` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `nature`
--

INSERT INTO `nature` (`id`, `natur`) VALUES
(1, 'Assuré'),
(2, 'Bizarre'),
(3, 'Brave'),
(4, 'Calme'),
(5, 'Docile'),
(6, 'Doux'),
(7, 'Foufou'),
(8, 'Gentil'),
(9, 'Hardi'),
(10, 'Jovial'),
(11, 'Lâche'),
(12, 'Malin'),
(13, 'Malpoli'),
(14, 'Mauvais'),
(15, 'Modeste'),
(16, 'Naïf'),
(17, 'Pressé'),
(18, 'Prudent'),
(19, 'Pudique'),
(20, 'Relax'),
(21, 'Rigide'),
(22, 'Sérieux'),
(23, 'Solo'),
(24, 'Timide');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `nature`
--
ALTER TABLE `nature`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `nature`
--
ALTER TABLE `nature`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
