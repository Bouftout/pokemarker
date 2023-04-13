-- phpMyAdmin SQL Dump
-- version 5.1.4
-- https://www.phpmyadmin.net/
--
-- Host: mysql-pokemarker.alwaysdata.net
-- Generation Time: Apr 11, 2023 at 04:13 PM
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

DELIMITER $$
--
-- Functions
--
CREATE DEFINER=`288618_pokemarke`@`%` FUNCTION `getmaxid` () RETURNS INT(11)  BEGIN
 DECLARE varid INT(10) DEFAULT 0;
   SELECT id INTO varid FROM `accounts` ORDER BY id DESC LIMIT 1;
   SET varid = varid + 1;
         return varid; 
   END$$

CREATE DEFINER=`288618_pokemarke`@`%` FUNCTION `getmaxidpoke` () RETURNS INT(11)  BEGIN
 DECLARE varid INT(22) DEFAULT 0;
   SELECT id INTO varid FROM `pokemon` ORDER BY id DESC LIMIT 1;
   SET varid = varid + 1;
         return varid; 
   END$$

CREATE DEFINER=`288618_pokemarke`@`%` FUNCTION `test` () RETURNS INT(11)  BEGIN
 DECLARE varid INT(22) DEFAULT 0;
   SELECT id INTO varid FROM `historique` ORDER BY id DESC LIMIT 1;
   SET varid = varid + 1;
         return varid; 
   END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `password`, `email`) VALUES
(1, 'haha', '243cd8ee', 'no'),
(6, 'toni', '243cd8ee', 'no'),
(7, 'gabou', '243cd8ee', 'no'),
(8, 'Akkranne', '07573d1a', 'no'),
(9, 'xdgameur', '47fd746a', 'no');

-- --------------------------------------------------------

--
-- Table structure for table `deck`
--

CREATE TABLE `deck` (
  `ID` int(11) NOT NULL,
  `idacc` int(11) DEFAULT NULL,
  `idpok` int(11) DEFAULT NULL,
  `nbdeck` int(255) DEFAULT 1,
  `dates` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `deck`
--

INSERT INTO `deck` (`ID`, `idacc`, `idpok`, `nbdeck`, `dates`) VALUES
(12, NULL, 5, NULL, '2023-04-06'),
(13, NULL, 7, NULL, '2023-04-06'),
(14, NULL, 8, NULL, '2023-04-06'),
(15, NULL, 11, NULL, '2023-04-06'),
(16, NULL, 5, NULL, '2023-04-06'),
(17, NULL, 7, NULL, '2023-04-06'),
(18, NULL, 8, NULL, '2023-04-06'),
(19, NULL, 11, NULL, '2023-04-06'),
(20, NULL, 5, NULL, '2023-04-06'),
(21, NULL, 7, NULL, '2023-04-06'),
(22, NULL, 8, NULL, '2023-04-06'),
(23, NULL, 11, NULL, '2023-04-06'),
(24, NULL, 5, NULL, '2023-04-06'),
(25, NULL, 7, NULL, '2023-04-06'),
(26, NULL, 8, NULL, '2023-04-06'),
(27, NULL, 11, NULL, '2023-04-06'),
(28, NULL, 5, NULL, '2023-04-06'),
(29, NULL, 7, NULL, '2023-04-06'),
(30, NULL, 8, NULL, '2023-04-06'),
(31, NULL, 11, NULL, '2023-04-06'),
(32, NULL, 5, NULL, '2023-04-06'),
(33, NULL, 7, NULL, '2023-04-06'),
(34, NULL, 8, NULL, '2023-04-06'),
(35, NULL, 11, NULL, '2023-04-06'),
(36, NULL, 5, NULL, '2023-04-06'),
(37, NULL, 7, NULL, '2023-04-06'),
(38, NULL, 8, NULL, '2023-04-06'),
(39, NULL, 11, NULL, '2023-04-06'),
(40, NULL, 5, NULL, '2023-04-06'),
(41, NULL, 7, NULL, '2023-04-06'),
(42, NULL, 8, NULL, '2023-04-06'),
(43, NULL, 11, NULL, '2023-04-06'),
(44, NULL, 5, NULL, '2023-04-06'),
(45, NULL, 7, NULL, '2023-04-06'),
(46, NULL, 8, NULL, '2023-04-06'),
(47, NULL, 11, NULL, '2023-04-06'),
(48, NULL, 5, NULL, '2023-04-06'),
(49, NULL, 7, NULL, '2023-04-06'),
(50, NULL, 8, NULL, '2023-04-06'),
(51, NULL, 11, NULL, '2023-04-06'),
(52, NULL, 5, NULL, '2023-04-06'),
(53, NULL, 7, NULL, '2023-04-06'),
(54, NULL, 8, NULL, '2023-04-06'),
(55, NULL, 11, NULL, '2023-04-06'),
(56, NULL, 5, NULL, '2023-04-06'),
(57, NULL, 7, NULL, '2023-04-06'),
(58, NULL, 8, NULL, '2023-04-06'),
(59, NULL, 11, NULL, '2023-04-06'),
(60, NULL, 5, NULL, '2023-04-06'),
(61, NULL, 7, NULL, '2023-04-06'),
(62, NULL, 8, NULL, '2023-04-06'),
(63, NULL, 11, NULL, '2023-04-06'),
(64, NULL, 5, NULL, '2023-04-06'),
(65, NULL, 7, NULL, '2023-04-06'),
(66, NULL, 8, NULL, '2023-04-06'),
(67, NULL, 11, NULL, '2023-04-06'),
(68, NULL, 5, NULL, '2023-04-06'),
(69, NULL, 7, NULL, '2023-04-06'),
(70, NULL, 8, NULL, '2023-04-06'),
(71, NULL, 11, NULL, '2023-04-06'),
(72, NULL, 5, NULL, '2023-04-06'),
(73, NULL, 7, NULL, '2023-04-06'),
(74, NULL, 8, NULL, '2023-04-06'),
(75, NULL, 11, NULL, '2023-04-06'),
(76, NULL, 5, NULL, '2023-04-06'),
(77, NULL, 7, NULL, '2023-04-06'),
(78, NULL, 8, NULL, '2023-04-06'),
(79, NULL, 11, NULL, '2023-04-06'),
(80, NULL, 5, NULL, '2023-04-06'),
(81, NULL, 7, NULL, '2023-04-06'),
(82, NULL, 8, NULL, '2023-04-06'),
(83, NULL, 11, NULL, '2023-04-06'),
(84, NULL, 5, NULL, '2023-04-06'),
(85, NULL, 7, NULL, '2023-04-06'),
(86, NULL, 8, NULL, '2023-04-06'),
(87, NULL, 11, NULL, '2023-04-06'),
(88, NULL, 5, NULL, '2023-04-06'),
(89, NULL, 7, NULL, '2023-04-06'),
(90, NULL, 8, NULL, '2023-04-06'),
(91, NULL, 11, NULL, '2023-04-06'),
(92, NULL, 5, NULL, '2023-04-06'),
(93, NULL, 7, NULL, '2023-04-06'),
(94, NULL, 8, NULL, '2023-04-06'),
(95, NULL, 11, NULL, '2023-04-06'),
(96, NULL, 5, NULL, '2023-04-06'),
(97, NULL, 7, NULL, '2023-04-06'),
(98, NULL, 8, NULL, '2023-04-06'),
(99, NULL, 11, NULL, '2023-04-06'),
(100, NULL, 5, NULL, '2023-04-06'),
(101, NULL, 7, NULL, '2023-04-06'),
(102, NULL, 8, NULL, '2023-04-06'),
(103, NULL, 11, NULL, '2023-04-06');

-- --------------------------------------------------------

--
-- Table structure for table `historique`
--

CREATE TABLE `historique` (
  `id` int(11) NOT NULL,
  `idacc1` int(11) DEFAULT NULL,
  `idacc2` int(11) DEFAULT NULL,
  `pv` int(11) DEFAULT NULL,
  `vainqueur` varchar(255) DEFAULT NULL,
  `poke1` varchar(50) DEFAULT NULL,
  `poke2` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `historique`
--

INSERT INTO `historique` (`id`, `idacc1`, `idacc2`, `pv`, `vainqueur`, `poke1`, `poke2`) VALUES
(1, 8, 7, 1, 'gabou', 'Adidas', 'Alicante'),
(2, 7, 6, 100, 'toni', 'Claymore', 'IceBerg');

--
-- Triggers `historique`
--
DELIMITER $$
CREATE TRIGGER `Before_Insert_User` BEFORE INSERT ON `historique` FOR EACH ROW BEGIN
  IF (EXISTS(SELECT 1 FROM historique WHERE vainqueur = NEW.vainqueur)) THEN
    SIGNAL SQLSTATE VALUE '45000' SET MESSAGE_TEXT = 'INSERT failed due to duplicate mobile number';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `pokemon`
--

CREATE TABLE `pokemon` (
  `id` int(11) NOT NULL,
  `nv` int(20) DEFAULT 1,
  `name` varchar(50) NOT NULL,
  `pv` int(11) NOT NULL,
  `forcer` int(11) NOT NULL,
  `def` int(11) NOT NULL,
  `vitesse` int(11) NOT NULL,
  `specialatt` int(11) NOT NULL,
  `specialdef` int(11) DEFAULT NULL,
  `evvitesse` int(11) DEFAULT NULL,
  `evspeatt` int(11) DEFAULT NULL,
  `evspedef` int(11) DEFAULT NULL,
  `evdef` int(11) DEFAULT NULL,
  `evatt` int(11) DEFAULT NULL,
  `evpv` int(11) DEFAULT NULL,
  `iv` int(11) NOT NULL,
  `nature` varchar(50) NOT NULL,
  `idaccounts` int(11) DEFAULT NULL,
  `givenname` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Dumping data for table `pokemon`
--

INSERT INTO `pokemon` (`id`, `nv`, `name`, `pv`, `forcer`, `def`, `vitesse`, `specialatt`, `specialdef`, `evvitesse`, `evspeatt`, `evspedef`, `evdef`, `evatt`, `evpv`, `iv`, `nature`, `idaccounts`, `givenname`) VALUES
(5, 1, 'Carapuce', 100, 100, 10, 10, 10, 10, 23, 28, 10, 19, 10, 13, 29, 'Mange du glacon', 6, 'IceBerg'),
(6, 1, 'Claymore', 1, 100, 100, 1, 1, 1, 26, 11, 14, 17, 16, 7, 23, 'one shoot or not', 7, 'Claymore'),
(7, 1, 'Salameche', 10, 100, 100, 10, 20, 10, 15, 12, 12, 18, 21, 11, 16, 'Il fais chaud', 7, 'Alicante'),
(8, 1, 'Pikachu', 50, 75, 25, 1, 40, 40, 27, 3, 21, 20, 20, 10, 18, 'Cours vite', 8, 'Adidas'),
(9, 1, 'Salameche', 100, 50, 50, 49, 1, 0, 5, 2, 18, 4, 20, 21, 30, 'Brule comme du petit bois.', 8, 'Funeraille'),
(10, 1, 'artemis', 100, 100, 50, 0, 0, 0, 3, 0, 22, 1, 13, 17, 3, 'Crystal de meth à 98ù', 8, 'crystal'),
(11, 1, 'salameche', 100, 100, 0, 0, 0, 0, 19, 24, 2, 21, 27, 9, 9, '0', 8, 'Arkane'),
(13, 1, 'Alemagne', 100, 1, 1, 1, 1, 1, 10, 14, 30, 14, 20, 18, 5, 'Salut mon pote', 8, 'allemagne'),
(14, 1, 'La Justice', 100, 100, 50, 0, 0, 0, 13, 19, 13, 22, 1, 2, 10, 'La justice est pas la', 8, 'La Justice'),
(15, 1, 'L&#x27;imortal', 50, 25, 25, 25, 25, 25, 13, 1, 7, 22, 11, 19, 18, 'L&#x27;imortel', 8, 'l&#x27;imortel'),
(16, 1, 'la mort', 50, 50, 25, 25, 25, 25, 17, 9, 9, 1, 22, 27, 11, 'la mort en personne', 8, 'la mort');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `deck`
--
ALTER TABLE `deck`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `idacc` (`idacc`),
  ADD KEY `idpok` (`idpok`);

--
-- Indexes for table `historique`
--
ALTER TABLE `historique`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idacc1` (`idacc1`),
  ADD KEY `idacc2` (`idacc2`);

--
-- Indexes for table `pokemon`
--
ALTER TABLE `pokemon`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idaccounts` (`idaccounts`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `deck`
--
ALTER TABLE `deck`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

--
-- AUTO_INCREMENT for table `pokemon`
--
ALTER TABLE `pokemon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `deck`
--
ALTER TABLE `deck`
  ADD CONSTRAINT `deck_ibfk_1` FOREIGN KEY (`idacc`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `deck_ibfk_2` FOREIGN KEY (`idpok`) REFERENCES `pokemon` (`id`);

--
-- Constraints for table `historique`
--
ALTER TABLE `historique`
  ADD CONSTRAINT `historique_ibfk_1` FOREIGN KEY (`idacc1`) REFERENCES `accounts` (`id`),
  ADD CONSTRAINT `historique_ibfk_2` FOREIGN KEY (`idacc2`) REFERENCES `accounts` (`id`);

--
-- Constraints for table `pokemon`
--
ALTER TABLE `pokemon`
  ADD CONSTRAINT `pokemon_ibfk_1` FOREIGN KEY (`idaccounts`) REFERENCES `accounts` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
