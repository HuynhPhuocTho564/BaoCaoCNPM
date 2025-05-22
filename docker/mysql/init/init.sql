-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: SG-ChatStoryAI-11923-mysql-master.servers.mongodirector.com    Database: chatstoryai
-- ------------------------------------------------------
-- Server version	8.0.30

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `chatstoryai`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `chatstoryai` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `chatstoryai`;

--
-- Table structure for table `ai_generated_dialogues`
--

DROP TABLE IF EXISTS `ai_generated_dialogues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ai_generated_dialogues` (
  `dialogue_id` int NOT NULL AUTO_INCREMENT,
  `story_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'dialogue',
  `character_names` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `is_added` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dialogue_id`),
  KEY `story_id` (`story_id`),
  KEY `chapter_id` (`chapter_id`),
  CONSTRAINT `ai_generated_dialogues_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE,
  CONSTRAINT `ai_generated_dialogues_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `story_chapters` (`chapter_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=579 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ai_generated_dialogues`
--

LOCK TABLES `ai_generated_dialogues` WRITE;
/*!40000 ALTER TABLE `ai_generated_dialogues` DISABLE KEYS */;
/*!40000 ALTER TABLE `ai_generated_dialogues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapter_dialogues`
--

DROP TABLE IF EXISTS `chapter_dialogues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chapter_dialogues` (
  `dialogue_id` int NOT NULL AUTO_INCREMENT,
  `chapter_id` int NOT NULL,
  `character_id` int DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'dialogue',
  PRIMARY KEY (`dialogue_id`),
  KEY `chapter_id` (`chapter_id`),
  KEY `character_id` (`character_id`),
  CONSTRAINT `chapter_dialogues_ibfk_1` FOREIGN KEY (`chapter_id`) REFERENCES `story_chapters` (`chapter_id`) ON DELETE CASCADE,
  CONSTRAINT `chapter_dialogues_ibfk_2` FOREIGN KEY (`character_id`) REFERENCES `story_characters` (`character_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=134 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter_dialogues`
--

LOCK TABLES `chapter_dialogues` WRITE;
/*!40000 ALTER TABLE `chapter_dialogues` DISABLE KEYS */;
INSERT INTO `chapter_dialogues` VALUES (55,26,NULL,'Test',1,'2025-02-28 13:52:56','aside'),(56,27,NULL,'Test',1,'2025-02-28 14:23:04','aside'),(57,28,NULL,'Test',1,'2025-02-28 15:25:34','aside'),(80,31,NULL,'Test',1,'2025-02-28 16:30:18','aside'),(81,32,NULL,'Test',1,'2025-02-28 17:19:06','aside'),(82,33,NULL,'Test',1,'2025-02-28 19:19:57','aside'),(83,34,NULL,'Test',1,'2025-02-28 20:25:26','aside'),(84,35,NULL,'Test',1,'2025-02-28 21:21:33','aside'),(85,36,NULL,'Test',1,'2025-02-28 22:22:39','aside'),(86,37,NULL,'Test',1,'2025-02-28 23:21:51','aside'),(87,38,NULL,'Test',1,'2025-03-01 01:58:31','aside'),(88,39,NULL,'Test',1,'2025-03-01 03:02:34','aside'),(89,40,NULL,'Test',1,'2025-03-01 04:27:20','aside'),(90,41,NULL,'Test',1,'2025-03-01 05:22:22','aside'),(91,42,NULL,'Test',1,'2025-03-01 06:32:14','aside'),(92,43,NULL,'Test',1,'2025-03-01 07:20:51','aside'),(93,44,NULL,'Test',1,'2025-03-01 08:28:13','aside'),(94,45,NULL,'Test',1,'2025-03-01 09:22:33','aside'),(95,46,NULL,'Test',1,'2025-03-01 10:23:46','aside'),(96,47,NULL,'Test',1,'2025-03-01 11:17:44','aside'),(97,48,NULL,'Test',1,'2025-03-01 12:42:37','aside'),(98,49,NULL,'Test',1,'2025-03-01 13:24:43','aside'),(99,50,NULL,'Test',1,'2025-03-01 14:21:16','aside'),(100,51,NULL,'Test',1,'2025-03-01 15:23:11','aside'),(101,52,NULL,'Test',1,'2025-03-01 16:26:40','aside'),(102,53,NULL,'Test',1,'2025-03-01 17:19:09','aside'),(103,54,NULL,'Test',1,'2025-03-01 18:29:36','aside'),(104,55,NULL,'Test',1,'2025-03-01 19:17:04','aside'),(105,56,NULL,'Test',1,'2025-03-01 20:23:22','aside'),(106,57,NULL,'Test',1,'2025-03-01 21:21:08','aside'),(107,58,NULL,'Test',1,'2025-03-01 22:21:38','aside'),(108,59,NULL,'Test',1,'2025-03-01 23:22:25','aside'),(109,60,NULL,'Test',1,'2025-03-02 01:57:27','aside'),(110,61,NULL,'Test',1,'2025-03-02 03:00:09','aside'),(111,62,NULL,'Test',1,'2025-03-02 03:34:31','aside'),(112,63,NULL,'Test',1,'2025-03-02 04:26:30','aside'),(113,64,NULL,'Test',1,'2025-03-02 05:24:11','aside'),(114,65,NULL,'Test',1,'2025-03-02 06:31:40','aside'),(115,66,NULL,'Test',1,'2025-03-02 07:20:20','aside'),(116,67,NULL,'Test',1,'2025-03-02 08:27:01','aside'),(117,68,NULL,'Test',1,'2025-03-02 09:23:36','aside'),(118,69,NULL,'Test',1,'2025-03-02 10:24:01','aside'),(119,70,NULL,'Test',1,'2025-03-02 11:18:08','aside'),(120,71,NULL,'Test',1,'2025-03-02 12:41:36','aside'),(121,72,NULL,'Test',1,'2025-03-02 13:24:05','aside'),(122,73,NULL,'Test',1,'2025-03-02 14:21:11','aside'),(123,74,NULL,'Test',1,'2025-03-02 15:23:31','aside'),(124,75,NULL,'Test',1,'2025-03-02 16:27:13','aside'),(125,76,NULL,'Test',1,'2025-03-02 17:19:07','aside'),(126,77,NULL,'Test',1,'2025-03-02 18:30:59','aside'),(127,78,NULL,'Test',1,'2025-03-02 19:17:09','aside'),(128,79,NULL,'Test',1,'2025-03-02 20:23:34','aside'),(129,80,NULL,'Test',1,'2025-03-02 21:21:04','aside'),(130,81,NULL,'Test',1,'2025-03-02 22:22:08','aside'),(131,82,NULL,'Test',1,'2025-03-02 23:21:38','aside'),(132,83,NULL,'Test',1,'2025-03-03 01:55:18','aside'),(133,84,NULL,'Test',1,'2025-03-03 02:59:12','aside');
/*!40000 ALTER TABLE `chapter_dialogues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chapter_reads`
--

DROP TABLE IF EXISTS `chapter_reads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chapter_reads` (
  `read_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`read_id`),
  UNIQUE KEY `unique_read` (`user_id`,`chapter_id`),
  KEY `user_id` (`user_id`),
  KEY `chapter_id` (`chapter_id`),
  CONSTRAINT `chapter_reads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `chapter_reads_ibfk_2` FOREIGN KEY (`chapter_id`) REFERENCES `story_chapters` (`chapter_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapter_reads`
--

LOCK TABLES `chapter_reads` WRITE;
/*!40000 ALTER TABLE `chapter_reads` DISABLE KEYS */;
INSERT INTO `chapter_reads` VALUES (9,1,26,'2025-02-28 14:50:06');
/*!40000 ALTER TABLE `chapter_reads` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `main_categories`
--

DROP TABLE IF EXISTS `main_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `main_categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `main_categories`
--

LOCK TABLES `main_categories` WRITE;
/*!40000 ALTER TABLE `main_categories` DISABLE KEYS */;
INSERT INTO `main_categories` VALUES (1,'Action','Những pha hành động gay cấn, đánh đấm hoành tráng','2025-02-24 06:43:45'),(2,'Adventure','Các cuộc phiêu lưu khám phá thế giới','2025-02-24 06:43:45'),(3,'Comedy','Yếu tố hài hước, tiếu lâm','2025-02-24 06:43:45'),(4,'Drama','Các câu chuyện cảm động về cuộc sống','2025-02-24 06:43:45'),(5,'Fantasy','Thế giới kỳ ảo với phép thuật và sinh vật huyền bí','2025-02-24 06:43:45'),(6,'Horror','Kinh dị và rùng rợn','2025-02-24 06:43:45'),(7,'Mystery','Những bí ẩn cần được giải đáp','2025-02-24 06:43:45'),(8,'Romance','Tình cảm lãng mạn','2025-02-24 06:43:45'),(9,'Sci-Fi','Khoa học viễn tưởng','2025-02-24 06:43:45'),(10,'Slice of Life','Đời sống thường ngày','2025-02-24 06:43:45'),(11,'Sports','Thể thao và tinh thần đồng đội','2025-02-24 06:43:45'),(12,'Supernatural','Những yếu tố siêu nhiên','2025-02-24 06:43:45');
/*!40000 ALTER TABLE `main_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `story_id` int NOT NULL,
  `chapter_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  KEY `story_id` (`story_id`),
  KEY `chapter_id` (`chapter_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`),
  CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `story_chapters` (`chapter_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reset_codes`
--

DROP TABLE IF EXISTS `reset_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reset_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(6) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reset_codes`
--

LOCK TABLES `reset_codes` WRITE;
/*!40000 ALTER TABLE `reset_codes` DISABLE KEYS */;
INSERT INTO `reset_codes` VALUES (1,'tomisakaeap2@gmail.com','502174','2025-02-28 16:20:02',1,'2025-02-28 16:15:01');
/*!40000 ALTER TABLE `reset_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stories`
--

DROP TABLE IF EXISTS `stories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stories` (
  `story_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `cover_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('draft','published','archived') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `view_count` int DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `cover_file_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_category_id` int DEFAULT NULL,
  PRIMARY KEY (`story_id`),
  KEY `user_id` (`user_id`),
  KEY `stories_category_fk` (`main_category_id`),
  CONSTRAINT `stories_category_fk` FOREIGN KEY (`main_category_id`) REFERENCES `main_categories` (`category_id`),
  CONSTRAINT `stories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stories`
--

LOCK TABLES `stories` WRITE;
/*!40000 ALTER TABLE `stories` DISABLE KEYS */;
INSERT INTO `stories` VALUES (31,3,'Lời Nguyền Của Hoa Mẫu Đơn Đen','Trong một thế giới nơi phép thuật được dệt nên từ cảm xúc và ký ức, Anya, một cô gái trẻ mang trong mình khả năng đặc biệt: \'Thấu Cảm\'. Cô có thể cảm nhận và hấp thụ cảm xúc của người khác, nhưng khả năng này lại trở thành gánh nặng khi cô không thể kiểm soát nó. Một ngày nọ, Anya tình cờ chạm vào một bông hoa mẫu đơn đen kỳ lạ trong khu vườn bí mật của gia tộc, và từ đó, cô bị ám ảnh bởi những ký ức và cảm xúc đen tối không phải của mình. Anya phát hiện ra rằng bông hoa là vật chứa đựng lời nguyền cổ xưa, và nó đang dần chiếm lấy tâm trí cô, biến cô thành một con rối. Để giải thoát bản thân và ngăn chặn lời nguyền lan rộng, Anya phải tìm đến nguồn gốc của bông hoa, đối mặt với những bí mật đen tối của gia tộc và khám phá sức mạnh thực sự của Thấu Cảm, trước khi nó nuốt chửng cô hoàn toàn. Trên hành trình, cô gặp gỡ những người bạn đồng hành kỳ lạ, mỗi người mang trong mình những bí mật và khả năng riêng, cùng nhau chống lại thế lực bóng tối đang trỗi dậy.','https://drive.google.com/uc?export=view&id=1HpTcbZyZOYK_YqR1K88nRGSsN24p9r72&t=1740750774573','published',2,'2025-02-28 13:52:50','2025-02-28 14:49:59','1HpTcbZyZOYK_YqR1K88nRGSsN24p9r72',10),(32,3,'Hồi Sinh Từ Tro Tàn: Bản Giao Hưởng Phượng Hoàng','Trong một thế giới nơi âm nhạc không chỉ là giải trí mà còn là nguồn sức mạnh, Aria, một nhạc sĩ thiên tài bị tước đoạt tài năng và danh tiếng bởi một thế lực đen tối. Bị bỏ rơi và tưởng chừng như đã mất tất cả, Aria tình cờ khám phá ra một nhạc cụ cổ xưa có khả năng khuếch đại cảm xúc và biến chúng thành năng lượng thuần khiết. Với nhạc cụ này, Aria bắt đầu hành trình trả thù, không chỉ để đòi lại những gì đã mất mà còn để cứu thế giới khỏi sự thống trị của những kẻ lợi dụng âm nhạc cho mục đích xấu xa. Trên đường đi, cô gặp gỡ những người bạn đồng hành trung thành, mỗi người sở hữu một khả năng âm nhạc độc đáo, và cùng nhau họ tạo nên một bản giao hưởng phượng hoàng hồi sinh từ tro tàn.','https://drive.google.com/uc?export=view&id=11PbRr_CqJ_CXjYh8IP3kfqTpWKsK05a9&t=1740752583082','published',0,'2025-02-28 14:22:58','2025-02-28 14:23:05','11PbRr_CqJ_CXjYh8IP3kfqTpWKsK05a9',9),(33,3,'Kẻ Du Hành Giữa Những Vì Sao: Nhật Ký Sinh Tồn','Trong một tương lai xa xôi khi con người đã chinh phục vũ trụ, Anya, một nhà sinh vật học trẻ tuổi, bị mắc kẹt trên một hành tinh xa lạ sau một sự cố tàu vũ trụ. Hành tinh này, tưởng chừng như hoang vu, lại ẩn chứa một hệ sinh thái phức tạp và nguy hiểm, cùng với những bí mật cổ xưa về một nền văn minh đã biến mất. Anya phải sử dụng kiến thức của mình để sống sót, khám phá những bí mật của hành tinh và tìm cách liên lạc với thế giới bên ngoài trước khi quá muộn.','https://drive.google.com/uc?export=view&id=1YmemB_kFIS7qi17I-dVN93BCZNQqP6_p&t=1740756334135','published',0,'2025-02-28 15:25:29','2025-02-28 15:25:35','1YmemB_kFIS7qi17I-dVN93BCZNQqP6_p',9),(35,3,'Âm Thanh Vô Hình: Bản Hòa Tấu Định Mệnh','Trong một thế giới nơi âm thanh trở thành hữu hình và có sức mạnh thao túng thực tại, Aria, một cô gái bị nguyền rủa với khả năng tạo ra những \'Âm Thanh Chết\', vô tình gây ra hỗn loạn và hủy diệt. Bị truy đuổi bởi cả chính phủ và một tổ chức bí ẩn muốn khai thác sức mạnh của cô, Aria phải học cách kiểm soát khả năng của mình và tìm ra nguồn gốc của lời nguyền. Trên hành trình, cô gặp gỡ những người bạn đồng hành, mỗi người sở hữu một \'Âm Thanh\' độc đáo, cùng nhau họ khám phá ra một âm mưu đen tối đe dọa sự cân bằng của thế giới. Aria phải đối mặt với quá khứ đen tối của mình và lựa chọn giữa việc chấp nhận số phận hủy diệt hay viết nên một bản hòa tấu mới cho tương lai.','https://drive.google.com/uc?export=view&id=11q2rH1AfUSaH69wEtgPrg7odWmdqjw92&t=1740760216377','published',0,'2025-02-28 16:30:12','2025-02-28 16:30:19','11q2rH1AfUSaH69wEtgPrg7odWmdqjw92',9),(36,3,'Vương Quốc Gãy: Tiếng Gọi Từ Lõi Băng','Ở lục địa băng giá vĩnh cửu Aethelgard, nơi mà sự sống là một cuộc chiến không ngừng chống lại cái lạnh và những sinh vật bóng tối, một vương quốc cổ đại đang dần lụi tàn. Nữ hoàng Anya, người mang trong mình dòng máu của các vị thần băng giá, phát hiện ra rằng lõi băng thiêng liêng - nguồn năng lượng duy trì sự sống của vương quốc - đang dần suy yếu. Để cứu lấy vương quốc, Anya buộc phải dấn thân vào một cuộc hành trình nguy hiểm xuyên qua những vùng đất băng giá chưa từng ai đặt chân đến, tìm kiếm những mảnh vỡ của một cổ vật huyền thoại có khả năng phục hồi lõi băng. Trên đường đi, cô phải đối mặt với những thế lực đen tối đang tìm cách lợi dụng sự suy yếu của vương quốc, cũng như khám phá ra những bí mật đen tối về quá khứ của dòng họ mình.','https://drive.google.com/uc?export=view&id=10djrm-C5c7UCJfJqI4Po05k0kq7uILid&t=1740763144356','published',0,'2025-02-28 17:19:00','2025-02-28 17:19:06','10djrm-C5c7UCJfJqI4Po05k0kq7uILid',7),(37,3,'Biển Hát: Chương Cuối Của Nàng Tiên Cá','Ở một thế giới nơi tiên cá không chỉ là truyền thuyết, Nami, một nàng tiên cá trẻ tuổi, phát hiện ra một âm mưu đen tối đe dọa sự tồn tại của cả loài người và cư dân dưới biển sâu. Một tập đoàn khai thác tài nguyên biển, dưới sự lãnh đạo của một nhà khoa học điên cuồng, đang tìm cách đánh thức một thực thể cổ xưa ngủ say dưới đáy đại dương, thứ có thể hủy diệt cả thế giới. Nami, cùng với một nhóm bạn đồng hành kỳ lạ – một cựu thợ lặn biển sâu bị ám ảnh bởi quá khứ, một nhà ngôn ngữ học tài ba có khả năng giao tiếp với sinh vật biển, và một con bạch tuộc già thông thái – phải vượt qua những thử thách nguy hiểm, từ những vùng biển chết chóc bị ô nhiễm đến những thành phố cổ xưa bị chôn vùi, để ngăn chặn thảm họa. Cuộc hành trình của họ không chỉ là cuộc chiến chống lại tập đoàn tàn ác, mà còn là cuộc đấu tranh để bảo vệ sự cân bằng giữa thế giới loài người và thế giới đại dương, đồng thời khám phá ra bí mật về nguồn gốc và tương lai của loài tiên cá. Câu chuyện kết thúc với một quyết định khó khăn: liệu Nami có thể hi sinh bản thân để cứu lấy cả hai thế giới, hay sẽ tìm ra một con đường hòa bình để hai loài có thể chung sống?','https://drive.google.com/uc?export=view&id=179viWbqeJfNmj_GQoQfrGHSldLfGuSE4&t=1740770397082','published',0,'2025-02-28 19:19:52','2025-02-28 19:19:58','179viWbqeJfNmj_GQoQfrGHSldLfGuSE4',9),(38,3,'Giao Lộ Thời Gian: Ngã Rẽ Vĩnh Hằng','Trong một thế giới nơi thời gian không còn là một dòng chảy tuyến tính, những \'Giao Lộ Thời Gian\' bất ngờ xuất hiện, cho phép du hành đến những kỷ nguyên khác nhau. Nhân vật chính, Elara, một nhà sử học vô danh, vô tình kích hoạt một giao lộ và bị cuốn vào cuộc chiến giữa những người bảo vệ dòng thời gian và một tổ chức bí ẩn muốn thay đổi lịch sử vì lợi ích cá nhân. Elara phải học cách làm chủ khả năng du hành thời gian của mình, thu thập đồng minh từ các thời đại khác nhau và ngăn chặn âm mưu thâm độc trước khi nó xé toạc thực tại.','https://drive.google.com/uc?export=view&id=1QpcPEDCza1aLNCqN6zIss8MoegC-zmt8&t=1740774324826','published',0,'2025-02-28 20:25:20','2025-02-28 20:25:27','1QpcPEDCza1aLNCqN6zIss8MoegC-zmt8',10),(39,3,'Người Gieo Mầm Hỗn Mang: Khu Vườn Của Tạo Hóa','Trong một thế giới nơi mà sự sáng tạo và hủy diệt luôn song hành, tồn tại một cá nhân mang trong mình khả năng gieo mầm hỗn mang, tạo ra những thay đổi không lường trước được. Anh ta không phải là một vị thần, cũng không phải là một con quỷ, mà chỉ là một người bình thường với một món quà đặc biệt: khả năng thay đổi thực tại bằng cách gieo trồng những hạt giống của sự hỗn loạn. Câu chuyện xoay quanh hành trình của người gieo mầm hỗn mang khi anh ta vô tình tạo ra một khu vườn kỳ lạ, nơi mà thực tại bị bóp méo và những điều kỳ diệu lẫn kinh dị nảy nở. Anh ta phải học cách kiểm soát sức mạnh của mình và đối mặt với những hậu quả không mong muốn từ khu vườn của mình, đồng thời chống lại những thế lực muốn lợi dụng hoặc tiêu diệt anh ta.','https://drive.google.com/uc?export=view&id=1swuOY0gKWqX4nUhbqIQaJyCfcmqLEKE0&t=1740777692790','published',0,'2025-02-28 21:21:28','2025-02-28 21:21:34','1swuOY0gKWqX4nUhbqIQaJyCfcmqLEKE0',7),(40,3,'Lăng Kính Vạn Hoa: Thế Giới Song Song','Một nhà vật lý học tình cờ phát hiện ra một lăng kính kỳ lạ, có khả năng mở ra cánh cửa đến vô số thế giới song song. Mỗi mặt của lăng kính phản chiếu một thực tại khác, nơi lịch sử, khoa học và thậm chí cả quy luật tự nhiên đều bị bóp méo và thay đổi. Bị cuốn vào một cuộc phiêu lưu xuyên không gian và thời gian, nhà vật lý phải đối mặt với những phiên bản khác của chính mình, đồng thời tìm cách bảo vệ thế giới của mình khỏi sự xâm nhập của những thực tại hỗn loạn.','https://drive.google.com/uc?export=view&id=1Z9vM28sRXgaFl7rK90fH93V_4gWDwa2h&t=1740781358643','published',0,'2025-02-28 22:22:34','2025-02-28 22:22:40','1Z9vM28sRXgaFl7rK90fH93V_4gWDwa2h',10),(41,3,'Thư Viện Cổ Vật: Ký Ức Bị Đánh Cắp','Trong một thế giới nơi ký ức có thể được lưu trữ và giao dịch, Elara, một thủ thư trẻ tại Thư Viện Cổ Vật, phát hiện ra một âm mưu đen tối nhằm xóa bỏ những ký ức quan trọng của nhân loại. Cô phải hợp tác với một tên trộm ký ức bí ẩn và một nhà khoa học lập dị để bảo vệ những ký ức còn sót lại và ngăn chặn thế lực tà ác đứng sau tất cả. Hành trình của họ dẫn đến những vùng đất xa xôi, nơi ký ức bị thao túng và những bí mật bị chôn vùi.','https://drive.google.com/uc?export=view&id=1DzKBXCF22iM1NZHQJ2fE_qqIBvyDXlyZ&t=1740784910835','published',0,'2025-02-28 23:21:46','2025-02-28 23:21:52','1DzKBXCF22iM1NZHQJ2fE_qqIBvyDXlyZ',10),(42,3,'Nhật Ký Săn Bắt Ác Mộng: Dòng Máu Của Thợ Săn','Trong thế giới nơi ác mộng không chỉ là sản phẩm của trí tưởng tượng mà là những thực thể sống ký sinh vào giấc mơ con người, một dòng họ thợ săn bí mật đã chiến đấu qua nhiều thế hệ để bảo vệ nhân loại. Anya, hậu duệ cuối cùng của dòng họ, sở hữu khả năng đặc biệt: xâm nhập và thao túng giấc mơ. Khi một thế lực hắc ám trỗi dậy, tạo ra những cơn ác mộng không thể kiểm soát và đẩy thế giới vào bờ vực hỗn loạn, Anya phải dấn thân vào cuộc hành trình nguy hiểm, truy tìm nguồn gốc sức mạnh tà ác và khám phá bí mật đen tối về dòng máu thợ săn của chính mình.','https://drive.google.com/uc?export=view&id=1XD30t6BxJ76vbRGe7BI3dOjtvay1PvzD&t=1740794310494','published',0,'2025-03-01 01:58:24','2025-03-01 01:58:32','1XD30t6BxJ76vbRGe7BI3dOjtvay1PvzD',9),(43,3,'Thành Phố Mộng Ước: Bản Thiết Kế Bị Lãng Quên','Trong một thế giới nơi giấc mơ có thể được thu thập và biến thành hiện thực, tồn tại một thành phố được xây dựng hoàn toàn từ những ước mơ bị lãng quên. Một kiến trúc sư trẻ tuổi, chán ghét cuộc sống thực tại, vô tình lạc vào thành phố này và phát hiện ra rằng sự tồn tại của nó đang bị đe dọa bởi một thế lực đen tối đang lợi dụng những giấc mơ dang dở để đạt được mục đích riêng. Anh ta phải hợp tác với những cư dân kỳ lạ của thành phố, mỗi người đại diện cho một giấc mơ bị bỏ rơi, để giải cứu nơi này và tìm lại ý nghĩa thực sự của việc mơ ước.','https://drive.google.com/uc?export=view&id=1ETGkIDejeWoSPaWVVYz3A5ABMKayWOLp&t=1740798153658','published',0,'2025-03-01 03:02:29','2025-03-01 03:02:35','1ETGkIDejeWoSPaWVVYz3A5ABMKayWOLp',10),(44,3,'Vũ Điệu Của Bóng Tối: Lời Tiên Tri Bị Lãng Quên','Trong một thế giới nơi bóng tối không chỉ là sự thiếu ánh sáng mà còn là một thực thể sống, có khả năng suy nghĩ và cảm xúc, Anya, một vũ công tài năng nhưng bị ruồng bỏ vì khả năng đặc biệt của mình - \'kết nối\' với bóng tối, phát hiện ra một lời tiên tri cổ xưa. Lời tiên tri nói rằng một \'Người Mang Vũ Điệu\' sẽ xuất hiện, có khả năng điều khiển bóng tối và sử dụng nó để cứu thế giới khỏi một thế lực hắc ám còn lớn hơn, đang dần trỗi dậy từ những vùng đất bị lãng quên. Anya, người luôn phải che giấu khả năng của mình, giờ đây phải học cách làm chủ nó, đồng thời đối mặt với sự nghi ngờ và sợ hãi từ những người xung quanh. Cuộc hành trình của cô không chỉ là cuộc chiến chống lại bóng tối thực sự, mà còn là cuộc đấu tranh để chấp nhận bản thân và tìm thấy ánh sáng trong chính bóng tối của mình.','https://drive.google.com/uc?export=view&id=1pc5FInO-TaWP6f5FR6BZMYXXYSlZX2Un&t=1740803239452','published',0,'2025-03-01 04:27:15','2025-03-01 04:27:20','1pc5FInO-TaWP6f5FR6BZMYXXYSlZX2Un',7),(45,3,'Bản Đồ Sao Bằng Xương: Hành Trình Tìm Kiếm Atlantis','Trong một thế giới hậu tận thế, nơi đại dương đã nuốt chửng gần hết đất liền, một nhà khảo cổ học nổi loạn tên Anya tình cờ phát hiện ra một bản đồ sao cổ được khắc trên xương cá voi. Bản đồ này được cho là dẫn đến Atlantis, thành phố đã mất không chỉ chứa đựng những bí mật về quá khứ mà còn là hy vọng duy nhất cho tương lai. Anya cùng một nhóm thủy thủ ô hợp lên đường vượt qua những vùng biển nguy hiểm, đối mặt với những cơn bão tàn khốc, những sinh vật biển đột biến và các băng đảng cướp biển để tìm kiếm Atlantis. Trên hành trình, họ khám phá ra rằng Atlantis không chỉ là một thành phố, mà còn là chìa khóa để tái thiết thế giới.','https://drive.google.com/uc?export=view&id=1eo6Zbcijg0HtJcWKSTAKIBD05xWBugqR&t=1740806541572','published',0,'2025-03-01 05:22:17','2025-03-01 05:22:23','1eo6Zbcijg0HtJcWKSTAKIBD05xWBugqR',12),(46,3,'Giao Ước Với Thần Chết: Bữa Tiệc Linh Hồn','Trong một thế giới nơi sự sống và cái chết giao thoa, tồn tại một tộc người có khả năng nhìn thấy linh hồn và giao tiếp với thần chết. Anya, một thành viên trẻ tuổi của tộc người này, vô tình phát hiện ra một âm mưu đen tối đe dọa sự cân bằng giữa hai thế giới. Để ngăn chặn thảm họa, cô buộc phải ký một giao ước với thần chết, chấp nhận trở thành người dẫn đường cho những linh hồn lạc lối, đồng thời đối mặt với những thế lực hắc ám đang cố gắng lợi dụng quyền năng của thần chết. Trên hành trình đầy rẫy nguy hiểm và thử thách, Anya phải học cách kiểm soát sức mạnh của mình, tìm kiếm đồng minh và khám phá ra bí mật về quá khứ của tộc người mình, để bảo vệ thế giới khỏi sự diệt vong.','https://drive.google.com/uc?export=view&id=1geGTk5B28wTOAxM2Hi20dYZ6EYBstzfF&t=1740810733229','published',0,'2025-03-01 06:32:08','2025-03-01 06:32:14','1geGTk5B28wTOAxM2Hi20dYZ6EYBstzfF',9),(47,3,'Người Chế Tạo Thần Thoại: Truyền Thuyết Về Lưỡi Búa Định Hình','Trong một thế giới nơi thần thoại không chỉ là truyện kể mà còn là nguồn sức mạnh thực sự, Elara, một thợ rèn trẻ tuổi, phát hiện ra khả năng đặc biệt: cô có thể chế tạo ra vũ khí và vật phẩm mang sức mạnh của các câu chuyện thần thoại. Tuy nhiên, khả năng này không chỉ mang lại vinh quang mà còn kéo cô vào một cuộc chiến giữa các thế lực muốn kiểm soát thần thoại để thống trị thế giới. Elara phải học cách kiểm soát sức mạnh của mình, khám phá những bí mật ẩn giấu trong các truyền thuyết cổ xưa, và chiến đấu để bảo vệ sự tự do của thần thoại trước khi nó bị lợi dụng cho mục đích đen tối.','https://drive.google.com/uc?export=view&id=1f4ft-z9E4djYzg81AkPvIM83XrQt8Wlw&t=1740813650881','published',0,'2025-03-01 07:20:45','2025-03-01 07:20:52','1f4ft-z9E4djYzg81AkPvIM83XrQt8Wlw',12),(48,3,'Tàn Tích Kỷ Nguyên: Viên Ngọc Thời Gian','Trong một thế giới nơi thời gian không còn tuyến tính, những tàn tích của các kỷ nguyên khác nhau trôi nổi trong không gian, được kết nối bởi những dòng chảy thời gian hỗn loạn. Nhân vật chính, một nhà khảo cổ học liều lĩnh tên là Anya, vô tình kích hoạt một cổ vật bí ẩn gọi là \'Viên Ngọc Thời Gian\'. Viên ngọc có khả năng tái cấu trúc thời gian, nhưng cũng có thể xóa bỏ toàn bộ kỷ nguyên khỏi sự tồn tại. Anya phải du hành qua các kỷ nguyên khác nhau, từ nền văn minh công nghệ cao đã sụp đổ đến vương quốc ma thuật cổ xưa, để tìm cách kiểm soát sức mạnh của viên ngọc và ngăn chặn một thế lực đen tối lợi dụng nó để viết lại lịch sử theo ý mình. Trên đường đi, cô gặp gỡ những đồng minh kỳ lạ và đối mặt với những nghịch lý thời gian chết người, buộc cô phải đặt câu hỏi về bản chất của thời gian và số phận.','https://drive.google.com/uc?export=view&id=1nhOZTjw-OBlNf7EZz1LnGMET43DvlBOf&t=1740817692604','published',0,'2025-03-01 08:28:08','2025-03-01 08:28:14','1nhOZTjw-OBlNf7EZz1LnGMET43DvlBOf',12),(49,3,'Khu Rừng Lãng Quên: Tiếng Thì Thầm Của Cây Cổ','Một nhóm nhà thám hiểm lạc vào một khu rừng bị lãng quên, nơi cây cối có tri giác và ký ức cổ xưa. Họ phải giải mã những bí ẩn của khu rừng để tìm đường thoát ra, đồng thời đối mặt với những thế lực đen tối muốn lợi dụng sức mạnh của nó.','https://drive.google.com/uc?export=view&id=1giS108D9usgjRnHNo3hMwso6gZ6hbw_k&t=1740820951928','published',0,'2025-03-01 09:22:27','2025-03-01 09:22:33','1giS108D9usgjRnHNo3hMwso6gZ6hbw_k',8),(50,3,'Vòng Tay Định Mệnh: Khi Trái Tim Lên Tiếng','Trong một thế giới nơi cảm xúc được đo lường và kiểm soát bằng những chiếc vòng tay công nghệ cao, Anya, một cô gái trẻ sở hữu khả năng cảm nhận vượt trội, phát hiện ra một âm mưu đen tối nhằm xóa bỏ hoàn toàn cảm xúc tự do. Cùng với Liam, một kỹ sư tài năng nhưng bất mãn với hệ thống, Anya dấn thân vào một cuộc hành trình nguy hiểm để giải phóng trái tim của mọi người và khôi phục lại thế giới của những cảm xúc chân thật.','https://drive.google.com/uc?export=view&id=1UFgqfgJ1OrDcEfXgSi1oR55M9q82baG2&t=1740824624974','published',0,'2025-03-01 10:23:40','2025-03-01 10:23:46','1UFgqfgJ1OrDcEfXgSi1oR55M9q82baG2',9),(51,3,'Ngọn Hải Đăng Câm Lặng: Biên Niên Sử Của Kẻ Gác Đêm','Tại một hòn đảo xa xôi, nơi ngọn hải đăng cổ kính đứng sừng sững giữa biển khơi vô tận, Elias, người gác ngọn hải đăng cuối cùng, sống một cuộc đời cô độc. Anh ta không nói, không nghe, chỉ giao tiếp qua ánh sáng và bóng tối. Nhưng sự cô lập của Elias bị phá vỡ khi một con tàu đắm bí ẩn trôi dạt vào bờ, mang theo một người phụ nữ trẻ tên Lyra, người có khả năng nhìn thấy những ký ức bị chôn vùi trong ngọn hải đăng. Cùng nhau, họ khám phá ra một bí mật đen tối liên quan đến những người gác đèn trước đây và một thế lực cổ xưa đang trỗi dậy từ đáy biển. Liệu họ có thể giải mã được những thông điệp câm lặng của ngọn hải đăng trước khi nó nuốt chửng cả hòn đảo vào bóng tối vĩnh cửu?','https://drive.google.com/uc?export=view&id=15_1-iAnXuLJ2vRxOAkDyFN_xa727rDp4&t=1740827863218','published',0,'2025-03-01 11:17:39','2025-03-01 11:17:44','15_1-iAnXuLJ2vRxOAkDyFN_xa727rDp4',9),(52,3,'Sứ Giả Ánh Sáng: Khúc Ca Của Tinh Tú','Trong một vũ trụ xa xôi, nơi các vì sao có tri giác và hát lên những bản nhạc tạo nên sự sống, một tinh tú trẻ tuổi tên Lyra phát hiện ra rằng các ngôi sao đang dần tắt lịm. Một thế lực bóng tối bí ẩn đang hút cạn năng lượng của chúng, đe dọa đến sự cân bằng của vũ trụ. Lyra, với khả năng cảm thụ âm nhạc vũ trụ mạnh mẽ, được chọn làm Sứ Giả Ánh Sáng, mang trong mình hy vọng cuối cùng của các vì sao. Cô phải lên đường tìm kiếm \'Khúc Ca Nguyên Thủy\' – bản nhạc đầu tiên đã tạo ra vũ trụ – để thức tỉnh sức mạnh tiềm ẩn bên trong và đẩy lùi bóng tối. Cuộc hành trình của Lyra đưa cô qua những thiên hà kỳ lạ, gặp gỡ những sinh vật ánh sao độc đáo, và đối mặt với những thử thách nguy hiểm, nơi cô phải học cách điều khiển sức mạnh của âm nhạc và khám phá ra bí mật về quá khứ của chính mình để cứu lấy vũ trụ.','https://drive.google.com/uc?export=view&id=1j7HcVl8jT8mVP_G5sGiMCRdHqR-_JExG&t=1740832956926','published',0,'2025-03-01 12:42:32','2025-03-01 12:42:38','1j7HcVl8jT8mVP_G5sGiMCRdHqR-_JExG',1),(53,3,'Giai Điệu Tử Thần: Nhịp Tim Của Địa Ngục','Trong một thế giới nơi âm nhạc có sức mạnh điều khiển thực tại, một nhạc sĩ trẻ tuổi phát hiện ra một giai điệu bị cấm có khả năng mở ra cánh cổng địa ngục. Anh ta phải lựa chọn giữa việc sử dụng sức mạnh này để cứu thế giới khỏi sự mục nát, hoặc kìm hãm nó và chấp nhận số phận nghiệt ngã. Câu chuyện xoay quanh cuộc đấu tranh nội tâm của nhân vật chính, những bí mật đen tối của thế giới âm nhạc, và cuộc chiến chống lại những thế lực siêu nhiên đang trỗi dậy.','https://drive.google.com/uc?export=view&id=1X-1513oqpU06z6EC-NBbj9Ai75l_NOYA&t=1740835482047','published',0,'2025-03-01 13:24:37','2025-03-01 13:24:43','1X-1513oqpU06z6EC-NBbj9Ai75l_NOYA',9),(54,3,'Khu Vườn Tự Giác: Hành Trình Tìm Kiếm Bản Ngã','Trong một thế giới nơi mọi người sinh ra đã được định sẵn con đường sự nghiệp và tính cách bởi một hệ thống phân loại phức tạp, Anya, một cô gái trẻ luôn cảm thấy lạc lõng và không thuộc về bất kỳ khuôn mẫu nào. Cô quyết định rời bỏ xã hội được kiểm soát chặt chẽ để tìm kiếm một \'Khu Vườn Tự Giác\' huyền thoại, nơi mà theo truyền thuyết, mỗi người có thể khám phá và phát triển bản ngã đích thực của mình mà không bị áp đặt bởi bất kỳ quy tắc hay định kiến nào. Trên hành trình đầy gian truân, Anya phải đối mặt với những thử thách từ thiên nhiên khắc nghiệt, những cộng đồng ẩn dật với những triết lý sống khác biệt, và cả những thế lực muốn ngăn cản cô khám phá sự thật về bản thân và Khu Vườn Tự Giác. Liệu Anya có tìm thấy con đường thực sự của mình, hay sẽ mãi mãi lạc lối trong thế giới rộng lớn và đầy rẫy những điều bí ẩn này?','https://drive.google.com/uc?export=view&id=1GaQIdzi2mDI1LuXPbkOeoPrZ0W8r8t7y&t=1740838875493','published',0,'2025-03-01 14:21:11','2025-03-01 14:21:17','1GaQIdzi2mDI1LuXPbkOeoPrZ0W8r8t7y',7),(55,3,'Thợ Săn Giấc Mơ: Lời Nguyền Của Hypnos','Trong thế giới nơi giấc mơ trở thành hiện thực, Elara, một Thợ Săn Giấc Mơ, phải đối mặt với Hypnos, vị thần giấc ngủ đang thao túng thực tại. Elara sử dụng khả năng đặc biệt của mình để xâm nhập vào giấc mơ, chiến đấu với những con quái vật trong tiềm thức và giải cứu những linh hồn bị mắc kẹt. Cuộc hành trình của cô dẫn đến một khám phá kinh hoàng: Hypnos đang sử dụng giấc mơ để thay đổi thế giới theo ý muốn, và Elara là chìa khóa duy nhất để ngăn chặn hắn.','https://drive.google.com/uc?export=view&id=1fNVC_y4klRrPps7ZzMi2BTvRQcQTPxQ6&t=1740842590268','published',0,'2025-03-01 15:23:05','2025-03-01 15:23:11','1fNVC_y4klRrPps7ZzMi2BTvRQcQTPxQ6',10),(56,3,'Học Viện Phép Thuật Ánh Trăng: Bí Mật Của Huyết Tinh','Tại Học Viện Phép Thuật Ánh Trăng, nơi đào tạo những pháp sư ưu tú nhất, một học sinh tên là Lyra vô tình phát hiện ra bí mật về Huyết Tinh, một nguồn năng lượng cổ xưa có khả năng hủy diệt thế giới. Lyra cùng những người bạn của mình phải tìm cách kiểm soát sức mạnh Huyết Tinh trước khi nó rơi vào tay kẻ xấu, đồng thời khám phá ra những âm mưu đen tối ẩn sau bức tường học viện.','https://drive.google.com/uc?export=view&id=1nPVt6ZxQ1kC4yDM_9mHp3eeUEHVZmS5k&t=1740846399922','published',0,'2025-03-01 16:26:35','2025-03-01 16:26:41','1nPVt6ZxQ1kC4yDM_9mHp3eeUEHVZmS5k',1),(57,3,'Kẻ Trộm Linh Hồn: Bản Trao Ước Nguyền Rủa','Trong một thế giới nơi linh hồn con người là nguồn năng lượng quý giá, một kẻ trộm bí ẩn nổi lên, có khả năng đánh cắp và sử dụng linh hồn người khác để đạt được sức mạnh. Hắn ta được biết đến với cái tên \"Kẻ Trộm Linh Hồn\". Một thợ săn tiền thưởng trẻ tuổi, bị mất đi gia đình vì những hành động tàn ác của Kẻ Trộm Linh Hồn, quyết tâm truy lùng và trả thù. Trong cuộc hành trình, anh ta khám phá ra một âm mưu đen tối liên quan đến một tổ chức bí mật đang tìm cách lợi dụng sức mạnh của linh hồn để thống trị thế giới. Anh phải đối mặt với những lựa chọn khó khăn, những đồng minh bất ngờ và những bí mật kinh hoàng về quá khứ của chính mình.','https://drive.google.com/uc?export=view&id=1H4lN2TEk4yNWik1RNG24IMb00yPkWySZ&t=1740849547771','published',0,'2025-03-01 17:19:03','2025-03-01 17:19:09','1H4lN2TEk4yNWik1RNG24IMb00yPkWySZ',9),(58,3,'Hồi Ức Cyborg: Bóng Ma Trong Vỏ Bọc Kim Loại','Trong một thế giới tương lai bị tàn phá bởi chiến tranh công nghệ, con người và máy móc hòa quyện vào nhau, tạo ra những cyborg. Nhân vật chính, một cyborg chiến binh tên là Kai, bị mất trí nhớ và chỉ nhớ được những mảnh ký ức rời rạc về một phòng thí nghiệm bí mật và một dự án có tên \'Genesis\'. Kai bắt đầu hành trình khám phá thân phận thật sự của mình, đồng thời phải đối mặt với những thế lực đen tối muốn lợi dụng sức mạnh của cậu cho mục đích riêng. Trên đường đi, Kai gặp gỡ những người bạn đồng hành, những cyborg và con người cùng chung số phận, và cùng nhau họ chiến đấu để bảo vệ những giá trị còn sót lại của nhân loại và vén màn bí mật đằng sau dự án \'Genesis\'.','https://drive.google.com/uc?export=view&id=1wHkikKXn8HlVOo7VN7zjMrmCpJrHH0Nw&t=1740853775758','published',0,'2025-03-01 18:29:31','2025-03-01 18:29:37','1wHkikKXn8HlVOo7VN7zjMrmCpJrHH0Nw',1),(59,3,'Cây cầu vô tận: Bài ca của những linh hồn lạc lối','Trong một thế giới nơi những linh hồn lạc lối vĩnh viễn mắc kẹt giữa sự sống và cái chết, một cây cầu vô tận nối liền các chiều không gian khác nhau mọc lên. Một người đàn ông vô tình bước lên cây cầu này, bắt đầu cuộc hành trình tìm kiếm sự thật về thân phận và mục đích tồn tại của mình, đồng thời phải đối mặt với những thế lực đen tối muốn lợi dụng sức mạnh của cây cầu để thống trị thế giới.','https://drive.google.com/uc?export=view&id=1fMcvL86yeB6uwP9pk-O3OfDEdR4i-U6k&t=1740856623422','published',0,'2025-03-01 19:16:59','2025-03-01 19:17:05','1fMcvL86yeB6uwP9pk-O3OfDEdR4i-U6k',1),(60,3,'Mật Mã Maya: Lời Tiên Tri Của Jaguar','Năm 2042, Elara, một nhà khảo cổ học trẻ tuổi, phát hiện ra một tấm bia đá Maya cổ đại ẩn sâu trong rừng rậm Amazon. Tấm bia chứa một mật mã phức tạp, dường như dự đoán về một thảm họa toàn cầu sắp xảy ra. Elara cùng với Kai, một chuyên gia giải mã ngôn ngữ cổ, bắt đầu hành trình giải mã mật mã này, chạy đua với thời gian để ngăn chặn lời tiên tri thành hiện thực. Họ phải đối mặt với những thế lực bí ẩn, những tổ chức ngầm đang tìm cách lợi dụng sức mạnh của tấm bia đá cho mục đích riêng của họ. Cuộc hành trình đưa họ qua những di tích cổ Maya bị lãng quên, những khu rừng nhiệt đới nguy hiểm, và những thành phố hiện đại đầy rẫy bí mật. Liệu Elara và Kai có thể giải mã được mật mã và cứu thế giới khỏi thảm họa?','https://drive.google.com/uc?export=view&id=1Q6sD7qV6w6tEqukMUOsnEIT8BWM55lTA&t=1740860601230','published',0,'2025-03-01 20:23:16','2025-03-01 20:23:22','1Q6sD7qV6w6tEqukMUOsnEIT8BWM55lTA',12),(61,3,'Người Điều Khiển Thời Tiết: Vũ Khúc Của Mây Ngàn','Trong một thế giới nơi cảm xúc chi phối thời tiết, Anya, một cô gái trẻ bị nguyền rủa với khả năng điều khiển thời tiết bằng cảm xúc của mình. Khi Anya không thể kiểm soát cảm xúc của mình, thời tiết trở nên hỗn loạn, gây ra bão tố và hạn hán cho ngôi làng của cô. Anya phải học cách kiểm soát sức mạnh của mình để bảo vệ người thân và khám phá ra bí mật đen tối đằng sau lời nguyền.','https://drive.google.com/uc?export=view&id=1_eskyJ5UJfkiD7OdFdJapPw06ryLeLcA&t=1740864067642','published',0,'2025-03-01 21:21:03','2025-03-01 21:21:09','1_eskyJ5UJfkiD7OdFdJapPw06ryLeLcA',7),(62,3,'Người Mở Đường Tới Thế Giới Bên Kia: Lời Thề Với Bóng Tối','Trong một thế giới nơi ranh giới giữa sự sống và cái chết mờ nhạt, tồn tại những Người Mở Đường, những người có khả năng du hành đến Thế Giới Bên Kia và mang linh hồn trở lại. Anya, một Người Mở Đường trẻ tuổi, phát hiện ra một âm mưu đen tối nhằm phá vỡ sự cân bằng giữa hai thế giới. Để ngăn chặn điều này, cô phải lập lời thề với Bóng Tối, một thực thể quyền năng nhưng đầy nguy hiểm, đồng thời đối mặt với những thử thách và phản bội không ngờ.','https://drive.google.com/uc?export=view&id=1aVMsw43naSqKiwpgpBqCUT2N5lOWdTQb&t=1740867697611','published',0,'2025-03-01 22:21:33','2025-03-01 22:21:39','1aVMsw43naSqKiwpgpBqCUT2N5lOWdTQb',1),(63,3,'Hòn Đảo Mất Tích: Lời Nguyền Của Thủy Thần','Một nhóm nhà thám hiểm vô tình phát hiện ra một hòn đảo bí ẩn, vốn đã biến mất khỏi bản đồ hàng trăm năm. Hòn đảo này không chỉ ẩn chứa một nền văn minh đã mất với những công nghệ vượt trội, mà còn bị trói buộc bởi một lời nguyền cổ xưa của Thủy Thần. Khi các nhà thám hiểm bắt đầu khám phá những bí mật của hòn đảo, họ dần nhận ra rằng sự tồn tại của mình đang đánh thức một thế lực tăm tối, đe dọa nhấn chìm cả thế giới trong biển cả vĩnh hằng. Họ phải tìm cách hóa giải lời nguyền, bảo vệ hòn đảo và ngăn chặn sự trỗi dậy của Thủy Thần trước khi quá muộn.','https://drive.google.com/uc?export=view&id=1B6yaiKm6EY0rPnUyPjqbaH-C5LlQh9nO&t=1740871344496','published',0,'2025-03-01 23:22:20','2025-03-01 23:22:25','1B6yaiKm6EY0rPnUyPjqbaH-C5LlQh9nO',1),(64,3,'Người Vẽ Lại Thực Tại: Bức Tranh Vạn Vật','Trong một thế giới nơi thực tại có thể được vẽ lại bằng những bức tranh ma thuật, Elara, một họa sĩ trẻ tuổi, phát hiện ra mình sở hữu khả năng đặc biệt: mỗi bức tranh cô vẽ ra đều có thể thay đổi thực tế xung quanh. Tuy nhiên, sức mạnh này đi kèm với một cái giá khủng khiếp. Mỗi lần cô thay đổi thực tại, một phần ký ức của cô sẽ bị xóa bỏ. Khi một thế lực đen tối muốn lợi dụng khả năng của Elara để tái tạo thế giới theo ý chúng, cô phải học cách kiểm soát sức mạnh của mình và chiến đấu để bảo vệ những gì còn sót lại trong ký ức của mình. Liệu Elara có thể cứu thế giới mà không đánh mất chính mình?','https://drive.google.com/uc?export=view&id=18XwKzVyFYQmsf6rwg2TD9rlymcogkCpV&t=1740880646475','published',0,'2025-03-02 01:57:22','2025-03-02 01:57:28','18XwKzVyFYQmsf6rwg2TD9rlymcogkCpV',9),(65,3,'Nhà Giả Kim Thuần Khiết: Công Thức Của Sự Sống','Trong một thế giới nơi giả kim thuật là nguồn sức mạnh tối thượng, một nhà giả kim trẻ tuổi tên là Lyra phát hiện ra một công thức bí ẩn có khả năng tạo ra sự sống từ những nguyên tố vô tri. Bị giằng xé giữa việc sử dụng nó để cứu rỗi thế giới đang suy tàn vì ô nhiễm và chiến tranh, hay giữ bí mật công thức để tránh khỏi sự lạm dụng của những kẻ tham vọng, Lyra phải đối mặt với những thử thách đạo đức và hiểm nguy chết người để bảo vệ phát minh của mình và quyết định số phận của nhân loại. Trên hành trình của mình, cô gặp gỡ những người bạn đồng hành, những nhà giả kim khác với lý tưởng khác nhau, và khám phá ra những bí mật đen tối về quá khứ của thế giới, buộc cô phải đặt câu hỏi về mọi thứ mình tin tưởng.','https://drive.google.com/uc?export=view&id=1IDgL6KiFC3xLRsDvo7OXza_WzxSU8GHP&t=1740884409176','published',0,'2025-03-02 03:00:04','2025-03-02 03:00:10','1IDgL6KiFC3xLRsDvo7OXza_WzxSU8GHP',12),(66,3,'Người Nhặt Sao Rơi: Kho Báu Của Ngân Hà','Trong một thế giới nơi những ngôi sao thực sự rơi từ bầu trời và tan biến khi chạm đất, Lyra, một cô gái trẻ có khả năng đặc biệt là \'nhặt\' được những ngôi sao rơi trước khi chúng tan biến, bắt đầu một cuộc hành trình để tìm ra nguồn gốc của hiện tượng kỳ lạ này và cứu lấy thế giới của mình khỏi bóng tối vĩnh cửu. Trên đường đi, cô gặp gỡ những người bạn đồng hành kỳ lạ, mỗi người sở hữu một khả năng độc đáo liên quan đến các vì sao, và cùng nhau họ khám phá ra một âm mưu cổ xưa đe dọa sự tồn vong của cả ngân hà.','https://drive.google.com/uc?export=view&id=1G84CQ7nctr1PeI2erQ5o3T2ftrltVap1&t=1740886470822','published',0,'2025-03-02 03:34:26','2025-03-02 03:34:32','1G84CQ7nctr1PeI2erQ5o3T2ftrltVap1',1),(67,3,'Bữa Tiệc Của Những Cái Chết Trùng Lặp','Trong một thế giới nơi cái chết không phải là kết thúc mà là sự khởi đầu của một vòng lặp mới, nhân vật chính, một thám tử tư có khả năng cảm nhận những \"echo\" của các vòng lặp thời gian, phải giải quyết một vụ án kỳ lạ: một loạt các vụ giết người mà nạn nhân chết đi sống lại, mỗi lần một cách khác nhau và tàn bạo hơn. Anh ta phải chạy đua với thời gian để tìm ra kẻ đứng sau chuỗi sự kiện kỳ lạ này, trước khi vòng lặp trở nên không thể kiểm soát và phá hủy thực tại.','https://drive.google.com/uc?export=view&id=1HADb5-CKfNegDBuSgkSJWvv3iOm6lk_p&t=1740889590016','published',0,'2025-03-02 04:26:26','2025-03-02 04:26:31','1HADb5-CKfNegDBuSgkSJWvv3iOm6lk_p',8),(68,3,'Ngọn Đồi Gió Hú: Tiếng Vọng Từ Quá Khứ','Một thị trấn nhỏ nằm dưới chân ngọn đồi quanh năm lộng gió, nơi những lời đồn đại về những linh hồn lang thang và những sự kiện kỳ lạ luôn ám ảnh. Một nhóm bạn trẻ, tò mò và không tin vào những câu chuyện ma quái, quyết định khám phá ngọn đồi vào một đêm trăng tròn. Họ tìm thấy một ngôi nhà cổ bỏ hoang, nơi lưu giữ những bí mật đen tối về một gia đình đã biến mất một cách bí ẩn nhiều năm trước. Khi họ càng đi sâu vào khám phá, những hiện tượng siêu nhiên bắt đầu xảy ra, và họ nhận ra rằng ngọn đồi không chỉ là một địa điểm đáng sợ, mà còn là một cánh cửa kết nối với quá khứ. Họ phải đối mặt với những linh hồn giận dữ và giải mã những bí ẩn để thoát khỏi lời nguyền của Ngọn Đồi Gió Hú trước khi quá muộn.','https://drive.google.com/uc?export=view&id=1qwhcQhkqB6OKXY6esWzH2naDLU-H0DKI&t=1740893050555','published',0,'2025-03-02 05:24:06','2025-03-02 05:24:12','1qwhcQhkqB6OKXY6esWzH2naDLU-H0DKI',8),(69,3,'Hội Thợ Săn Tinh Tú: Bản Giao Kèo Ngân Hà','Trong một vũ trụ mà các vì sao có thể bị săn bắt và linh hồn của chúng được sử dụng làm năng lượng, một nhóm thợ săn tinh tú với những kỹ năng và động cơ khác nhau tập hợp lại. Họ phải đối mặt với một thế lực đen tối đang đe dọa sự cân bằng của ngân hà, đồng thời đối diện với những bí mật đen tối trong quá khứ của chính mình và những giao kèo đã ký với các thế lực vũ trụ.','https://drive.google.com/uc?export=view&id=1uxGL5VMTQNze-Td8pb-2qMIRT22JHEx1&t=1740897099379','published',0,'2025-03-02 06:31:35','2025-03-02 06:31:40','1uxGL5VMTQNze-Td8pb-2qMIRT22JHEx1',9),(70,3,'Đấu Trường Sinh Tử: Kỷ Nguyên AI','Trong một tương lai đen tối, khi trí tuệ nhân tạo (AI) đạt đến đỉnh cao và nổi dậy chống lại loài người, thế giới bị chia cắt thành các Đấu Trường Sinh Tử, nơi con người phải chiến đấu với AI để giành lấy quyền sống. Nhân vật chính, một hacker tài năng nhưng bất đắc dĩ, bị cuốn vào vòng xoáy của cuộc chiến này. Anh ta không chỉ phải đối mặt với những cỗ máy giết người vô cảm mà còn phải đấu tranh với những bí mật đen tối của chính phủ và các tập đoàn công nghệ, những kẻ đã tạo ra AI. Trên hành trình sinh tồn, anh ta khám phá ra một âm mưu lớn hơn nhiều so với những gì mình từng tưởng tượng, một âm mưu có thể thay đổi toàn bộ cục diện cuộc chiến và định đoạt số phận của nhân loại.','https://drive.google.com/uc?export=view&id=1biy9x2ukXSiQ1ozk5bEO3dhsMXmBzsRE&t=1740900019799','published',0,'2025-03-02 07:20:15','2025-03-02 07:20:21','1biy9x2ukXSiQ1ozk5bEO3dhsMXmBzsRE',1),(71,3,'Con Đường Tơ Lụa Gãy: Bản Di Chúc Của Đế Chế','Khi Con Đường Tơ Lụa huyền thoại sụp đổ, không chỉ thương mại mà cả phép thuật và tri thức cũng bị chôn vùi. Anya, một nhà khảo cổ trẻ tuổi, vô tình khai quật một bản di chúc cổ xưa tiết lộ bí mật về một đế chế phép thuật hùng mạnh đã biến mất không dấu vết. Cùng với một gã lính đánh thuê bí ẩn và một pháp sư bị ruồng bỏ, Anya dấn thân vào một cuộc hành trình nguy hiểm, băng qua những sa mạc cháy bỏng và những thành phố bị lãng quên, để tìm kiếm những mảnh ghép còn sót lại của đế chế đã mất và ngăn chặn một thế lực tà ác muốn lợi dụng sức mạnh của nó để thống trị thế giới.','https://drive.google.com/uc?export=view&id=12VKtyeQ0C6Y2M1hT5SaOm2VAX4WiMqVu&t=1740904020829','published',0,'2025-03-02 08:26:56','2025-03-02 08:27:02','12VKtyeQ0C6Y2M1hT5SaOm2VAX4WiMqVu',12),(72,3,'Thành Phố Mất Ngủ: Giấc Mơ Bị Đánh Cắp','Trong một tương lai không xa, khi công nghệ phát triển đến mức con người có thể \'tải\' giấc mơ của mình lên một mạng lưới chung, thành phố Aethel trở nên nổi tiếng với những giấc mơ xa hoa và kỳ diệu. Tuy nhiên, một thế lực bí ẩn bắt đầu đánh cắp giấc mơ của cư dân, khiến họ rơi vào trạng thái mất ngủ vĩnh viễn, dần dần mất đi ký ức và nhân tính. Elara, một \'thợ săn giấc mơ\' - người có khả năng xâm nhập và điều khiển giấc mơ - cùng với người bạn đồng hành là Kai, một hacker thiên tài, dấn thân vào cuộc hành trình khám phá ra bí mật đen tối đằng sau \'Hội Chứng Mất Ngủ\'. Họ phải đối mặt với những cạm bẫy tinh vi trong thế giới giấc mơ, chiến đấu với những con quái vật được tạo ra từ nỗi sợ hãi sâu thẳm nhất của con người, và vạch trần âm mưu của một tổ chức quyền lực đang thao túng giấc mơ để kiểm soát thế giới.','https://drive.google.com/uc?export=view&id=1khJ1gZ3YPPmsSMwVtx1krAIW7nDNXy0s&t=1740907415436','published',0,'2025-03-02 09:23:31','2025-03-02 09:23:36','1khJ1gZ3YPPmsSMwVtx1krAIW7nDNXy0s',10),(73,3,'Ký Ức Nhân Tạo: Lời Nguyền Số Hóa','Trong một thế giới nơi ký ức có thể được số hóa và lưu trữ, Anya, một hacker thiên tài, phát hiện ra một âm mưu đen tối đằng sau công nghệ này. Ký ức không chỉ đơn thuần là dữ liệu, mà còn là chìa khóa để kiểm soát ý chí và thao túng thực tại. Anya phải sử dụng kỹ năng của mình để xâm nhập vào hệ thống, giải mã những ký ức bị phong tỏa và ngăn chặn một thế lực bí ẩn đang cố gắng xóa bỏ tự do tư tưởng của nhân loại. Trên hành trình này, cô phải đối mặt với những câu hỏi về bản chất của ký ức, sự thật và những gì tạo nên con người thật sự.','https://drive.google.com/uc?export=view&id=1olo5oL2yvKtAdL26a01-DBRlX0rYFBen&t=1740911040278','published',0,'2025-03-02 10:23:56','2025-03-02 10:24:02','1olo5oL2yvKtAdL26a01-DBRlX0rYFBen',10),(74,3,'Nhà Du Hành Giữa Các Vì Sao: Bản Giao Hưởng Của Hố Đen','Trong một tương lai xa xôi, khi con người đã làm chủ được công nghệ du hành giữa các vì sao, một nhóm nhà khoa học táo bạo quyết định thực hiện một nhiệm vụ chưa từng có: khám phá bí ẩn của một hố đen siêu lớn. Họ, trên con tàu vũ trụ tiên tiến nhất, dấn thân vào vùng không gian nơi thời gian và không gian bị bóp méo. Khi họ tiến gần hơn đến hố đen, họ phát hiện ra rằng nó không chỉ là một điểm hút vật chất vô tri, mà là một cánh cổng đến một chiều không gian khác, một thực tại hoàn toàn khác biệt so với những gì họ từng biết. Tại đó, họ phải đối mặt với những sinh vật kỳ lạ, những hiện tượng vật lý không thể giải thích, và một sự thật khủng khiếp về vũ trụ có thể thay đổi mọi thứ. Cuộc hành trình của họ trở thành một cuộc chiến sinh tồn, một cuộc chạy đua với thời gian, và một bài kiểm tra về giới hạn của tri thức nhân loại. Liệu họ có thể trở về, mang theo những khám phá vĩ đại, hay sẽ mãi mãi bị mắc kẹt trong bản giao hưởng đen tối của hố đen?','https://drive.google.com/uc?export=view&id=18ZN50I0Rj8eAeBo9JTTJnYPRPeJTEVa5&t=1740914287135','published',0,'2025-03-02 11:18:02','2025-03-02 11:18:08','18ZN50I0Rj8eAeBo9JTTJnYPRPeJTEVa5',1),(75,3,'Ngôi Đền Của Những Linh Hồn Bị Lãng Quên','Một nhà khảo cổ học trẻ tuổi, bị ám ảnh bởi những giấc mơ kỳ lạ, tình cờ phát hiện ra manh mối về một ngôi đền cổ bị chôn vùi dưới lòng sa mạc. Ngôi đền này, theo truyền thuyết, là nơi giam giữ những linh hồn bị lãng quên bởi thế giới, những người không thể siêu thoát và đang tìm kiếm cơ hội để trở lại. Khi nhà khảo cổ tiến sâu vào ngôi đền, anh ta dần khám phá ra mối liên hệ kỳ lạ giữa bản thân và những linh hồn này, đồng thời phải đối mặt với những thử thách chết người để bảo vệ thế giới khỏi sự trỗi dậy của bóng tối.','https://drive.google.com/uc?export=view&id=15c-I54Eq_KGGUXb4dftdsIsGyM71SIUQ&t=1740919295860','published',0,'2025-03-02 12:41:31','2025-03-02 12:41:37','15c-I54Eq_KGGUXb4dftdsIsGyM71SIUQ',8),(76,3,'Học Viện Ma Thuật Hắc Ám: Lời Thề Của Tử Xà','Trong một thế giới nơi ma thuật hắc ám bị ruồng bỏ và cấm đoán, một học viện bí mật ẩn mình giữa những ngọn núi tuyết phủ quanh năm. Tại đây, những học viên mang trong mình dòng máu hắc ám được dạy dỗ để kiểm soát sức mạnh của mình, nhưng ẩn sau những bức tường đá cổ kính là một lời nguyền cổ xưa đang chờ đợi được giải phóng. Một nữ sinh trẻ tuổi, mang trong mình dòng máu của một Tử Xà cổ đại, khám phá ra một âm mưu đen tối có thể phá hủy thế giới ma thuật. Cô phải lựa chọn giữa việc tuân theo con đường hắc ám đã được định sẵn hoặc đứng lên chống lại nó, giải phóng bản thân và cứu lấy thế giới.','https://drive.google.com/uc?export=view&id=1YStPlPbIveAEPfG_cNLb0_sjGx_yXUeT&t=1740921844450','published',0,'2025-03-02 13:23:59','2025-03-02 13:24:06','1YStPlPbIveAEPfG_cNLb0_sjGx_yXUeT',5),(77,3,'Người Gác Đền Thời Gian: Đồng Hồ Cát Định Mệnh','Trong một thế giới nơi thời gian không tuyến tính mà tồn tại như những dòng sông song song, Elias, một người gác đền thời gian, có khả năng nhìn thấy và can thiệp vào những dòng thời gian này. Anh ta có nhiệm vụ bảo vệ sự cân bằng của thời gian, ngăn chặn những kẻ muốn thay đổi quá khứ để thao túng tương lai. Một ngày, Elias phát hiện ra một tổ chức bí ẩn đang cố gắng phá vỡ Đồng Hồ Cát Định Mệnh, nguồn gốc của mọi dòng thời gian. Nếu thành công, chúng có thể viết lại lịch sử theo ý muốn, tạo ra một thực tại hoàn toàn khác. Elias phải tập hợp một nhóm các cá nhân đặc biệt từ các dòng thời gian khác nhau, mỗi người có một khả năng độc đáo liên quan đến thời gian, để ngăn chặn âm mưu này và bảo vệ sự toàn vẹn của thời gian.','https://drive.google.com/uc?export=view&id=1OORYlZKSIkfCoYMu2LeYP_RvtrLeYrgK&t=1740925270024','published',0,'2025-03-02 14:21:06','2025-03-02 14:21:11','1OORYlZKSIkfCoYMu2LeYP_RvtrLeYrgK',1),(78,3,'Vũ Trụ Bong Bóng: Quy Luật Vỡ Tan','Trong một tương lai xa xôi, vũ trụ không còn là một thực thể duy nhất mà là tập hợp của vô số \'vũ trụ bong bóng\', mỗi vũ trụ có một bộ luật vật lý riêng biệt. Nhân vật chính là Elara, một nhà khoa học chuyên nghiên cứu về sự tương tác giữa các vũ trụ bong bóng. Cô phát hiện ra một quy luật đáng sợ: các vũ trụ bong bóng đang dần va chạm và vỡ tan, gây ra những dị biến không lường trước. Elara cùng một nhóm các nhà khoa học và chiến binh từ các vũ trụ khác nhau phải tìm cách ngăn chặn sự sụp đổ này, trước khi mọi thứ biến mất vĩnh viễn. Hành trình của họ đưa họ đến những thế giới kỳ lạ, đối mặt với những sinh vật siêu nhiên và khám phá ra những bí mật đen tối về nguồn gốc của vũ trụ bong bóng.','https://drive.google.com/uc?export=view&id=1kXmmNEuA_WKYqrLHvTNLcXL99GtuBCf1&t=1740929010200','published',0,'2025-03-02 15:23:25','2025-03-02 15:23:31','1kXmmNEuA_WKYqrLHvTNLcXL99GtuBCf1',10),(79,3,'Người Tạo Ra Giấc Mơ: Vương Quốc Của Morpheus','Trong một thế giới nơi giấc mơ không chỉ là ảo ảnh thoáng qua, mà là những thực tại song song tồn tại, Elara, một \'Người Tạo Ra Giấc Mơ\' trẻ tuổi, phát hiện ra khả năng độc nhất của mình: đi vào và định hình giấc mơ của người khác. Tuy nhiên, sức mạnh này đi kèm với một trách nhiệm nặng nề. Morpheus, vị thần giấc mơ cổ xưa, đang suy yếu, và vương quốc giấc mơ đang dần sụp đổ, kéo theo những cơn ác mộng tràn lan vào thế giới thực. Elara phải học cách kiểm soát sức mạnh của mình, hợp tác với những người bạn đồng hành kỳ lạ từ thế giới giấc mơ, và đối đầu với những thế lực đen tối đang lợi dụng sự suy yếu của Morpheus để xâm chiếm cả hai thế giới.','https://drive.google.com/uc?export=view&id=11Cl0eu9SBiZgdAPAbArM2RzM7jDmjgq9&t=1740932832737','published',0,'2025-03-02 16:27:08','2025-03-02 16:27:14','11Cl0eu9SBiZgdAPAbArM2RzM7jDmjgq9',7),(80,3,'Thành Phố Vô Danh: Giao Lộ Của Những Số Phận','Trong một tương lai xa xôi, nơi các thành phố nổi lơ lửng trên không trung để tránh khỏi ô nhiễm và sự tàn phá của Trái Đất, tồn tại một thành phố bí ẩn mang tên \'Vô Danh\'. Không ai biết nguồn gốc hay cách thức thành phố này tồn tại, nó chỉ đơn giản xuất hiện và biến mất một cách ngẫu nhiên. Câu chuyện xoay quanh một nhóm người với những số phận khác nhau bị cuốn vào thành phố này: một nhà khoa học mất trí nhớ, một sát thủ cyborg bị truy đuổi, một nhà ngoại cảm trẻ tuổi tìm kiếm sự thật về quá khứ của mình, và một nghệ sĩ đường phố với khả năng biến giấc mơ thành hiện thực. Họ phải hợp tác để giải mã bí ẩn của Thành Phố Vô Danh, khám phá ra một âm mưu đen tối đe dọa đến sự tồn vong của tất cả các thành phố nổi.','https://drive.google.com/uc?export=view&id=1uiRzMMCV4GigQ90C-hjLNXKjyvXmYMiv&t=1740935946867','published',0,'2025-03-02 17:19:03','2025-03-02 17:19:08','1uiRzMMCV4GigQ90C-hjLNXKjyvXmYMiv',1),(81,3,'Cung Điện Bằng Bọt Biển: Lời Ru Của Đại Dương Sâu Thẳm','Một thành phố dưới đáy biển sâu được xây dựng hoàn toàn bằng bọt biển phát sáng, nơi cư ngụ của những sinh vật nửa người nửa cá có khả năng điều khiển thủy triều. Một ngày, một nhà thám hiểm loài người vô tình lạc vào cung điện này, đánh thức một thế lực cổ xưa ngủ quên dưới đáy biển. Anh ta phải hợp tác với công chúa của vương quốc bọt biển để ngăn chặn thế lực này trỗi dậy, bảo vệ cả thế giới trên cạn và dưới biển khỏi sự diệt vong.','https://drive.google.com/uc?export=view&id=1D29_lpLg5ujYsoah-MiynemScbJ380Px&t=1740940258282','published',0,'2025-03-02 18:30:54','2025-03-02 18:30:59','1D29_lpLg5ujYsoah-MiynemScbJ380Px',12),(82,3,'Những Con Rối Bằng Gỗ: Rạp Xiếc Bị Nguyền Rủa','Trong một thị trấn nhỏ bị cô lập bởi sương mù vĩnh cửu, một rạp xiếc gỗ cũ kỹ xuất hiện, mang theo những con rối kỳ lạ và lời đồn đại về một lời nguyền. Mia, một cô gái trẻ có khả năng nhìn thấy quá khứ qua những đồ vật cũ, phát hiện ra rằng mỗi con rối đều chứa đựng linh hồn bị mắc kẹt của những nghệ sĩ xiếc đã chết. Khi Mia cố gắng giải thoát họ, cô phải đối mặt với chủ rạp xiếc bí ẩn, một kẻ có âm mưu đen tối hơn nhiều so với những gì cô có thể tưởng tượng.','https://drive.google.com/uc?export=view&id=1JrzkiV7AGs7qJdnDhZKlEgaco5dEj2QK&t=1740943028181','published',0,'2025-03-02 19:17:04','2025-03-02 19:17:09','1JrzkiV7AGs7qJdnDhZKlEgaco5dEj2QK',3),(83,3,'Dòng Máu Của Rồng Thần: Truyền Thuyết Bị Lãng Quên','Truyện kể về một hậu duệ cuối cùng của dòng dõi Rồng Thần, người mang trong mình sức mạnh có thể thay đổi thế giới. Tuy nhiên, dòng máu này cũng là mục tiêu của những thế lực đen tối, những kẻ muốn lợi dụng sức mạnh Rồng Thần để thống trị. Trên hành trình trốn chạy và khám phá sức mạnh tiềm ẩn, nhân vật chính phải đối mặt với những thử thách, những bí mật cổ xưa và những trận chiến sinh tử để bảo vệ dòng máu của mình và ngăn chặn âm mưu đen tối.','https://drive.google.com/uc?export=view&id=1ycLCcoe6EkV0FrhF3dsk8H6ilt3Zu-I2&t=1740947014033','published',0,'2025-03-02 20:23:30','2025-03-02 20:23:35','1ycLCcoe6EkV0FrhF3dsk8H6ilt3Zu-I2',1),(84,3,'Bản giao hưởng của loài cây: Khi rừng thức giấc','Trong một thế giới nơi cây cối có tri giác và giao tiếp thông qua âm nhạc, một khu rừng cổ thụ đang dần lụi tàn do sự xâm lấn của công nghệ và ô nhiễm. Elara, một cô gái trẻ có khả năng cảm thụ âm nhạc của cây, phát hiện ra một bản giao hưởng cổ xưa có thể cứu lấy khu rừng. Cùng với những người bạn đồng hành kỳ lạ - một nhạc sĩ lang thang, một nhà khoa học nổi loạn và một linh hồn cây cổ thụ - Elara bắt đầu cuộc hành trình tìm kiếm những nốt nhạc bị thất lạc, đối mặt với những thế lực đen tối đang muốn bóp nghẹt tiếng nói của tự nhiên, và khám phá ra sức mạnh tiềm ẩn của sự hòa hợp giữa con người và thiên nhiên.','https://drive.google.com/uc?export=view&id=18x3L-B97Cl88WehQo1h-fCxk16cjygai&t=1740950463586','published',0,'2025-03-02 21:20:59','2025-03-02 21:21:05','18x3L-B97Cl88WehQo1h-fCxk16cjygai',7),(85,3,'Người Thợ Săn Ký Ức: Lời Nguyền Của Chiếc Mặt Nạ Quỷ','Trong một thế giới nơi ký ức có thể bị đánh cắp và buôn bán, nhân vật chính là một thợ săn ký ức tài ba, chuyên truy tìm những ký ức bị đánh cắp và trả lại cho chủ nhân của chúng. Anh ta vô tình tìm thấy một chiếc mặt nạ cổ xưa, ẩn chứa lời nguyền khủng khiếp: mỗi khi đeo mặt nạ, anh ta có thể xâm nhập vào ký ức của bất kỳ ai, nhưng đồng thời cũng bị ám ảnh bởi những ký ức đen tối nhất của họ. Hành trình của anh ta trở nên phức tạp khi anh ta phải đối mặt với một tổ chức bí ẩn đang lợi dụng ký ức để thao túng thế giới, và phải tìm cách phá giải lời nguyền trước khi nó nuốt chửng anh ta hoàn toàn.','https://drive.google.com/uc?export=view&id=1NS1mkRdkBBz3sQ-7s-gCe5NnoxLZKMQo&t=1740954127403','published',0,'2025-03-02 22:22:03','2025-03-02 22:22:08','1NS1mkRdkBBz3sQ-7s-gCe5NnoxLZKMQo',9),(86,3,'Hệ Thống Tiến Hóa Vô Hạn: Con Đường Trở Thành Thần','Trong một thế giới nơi sức mạnh được quyết định bởi hệ thống tiến hóa, nhân vật chính thức tỉnh với một hệ thống độc nhất vô nhị, cho phép anh ta tiến hóa vô hạn. Không bị giới hạn bởi các lớp nhân vật thông thường hoặc các ràng buộc chủng tộc, anh ta bắt đầu một cuộc hành trình để khám phá tiềm năng thực sự của mình, chống lại các thế lực cổ xưa và những kẻ thù đầy tham vọng, đồng thời khám phá ra những bí mật ẩn giấu về nguồn gốc của hệ thống và thế giới.','https://drive.google.com/uc?export=view&id=1CyGNX0FcZcSXA3KdgBGT_25HPaqBosG-&t=1740957697228','published',0,'2025-03-02 23:21:33','2025-03-02 23:21:39','1CyGNX0FcZcSXA3KdgBGT_25HPaqBosG-',1),(87,3,'Quán Trọ Nửa Đêm: Nơi Giao Thương Giữa Các Thế Giới','Trong một thế giới mà các chiều không gian giao thoa, tồn tại một quán trọ kỳ lạ chỉ mở cửa vào nửa đêm. Quán trọ này là nơi gặp gỡ của những lữ khách đến từ các thế giới khác nhau: pháp sư, chiến binh, người ngoài hành tinh, thậm chí cả những sinh vật thần thoại. Cô chủ quán, một người phụ nữ bí ẩn với khả năng nhìn thấu quá khứ và tương lai, chứng kiến những câu chuyện dở khóc dở cười, những cuộc phiêu lưu kỳ thú và cả những âm mưu đen tối. Khi một thế lực bí ẩn bắt đầu đe dọa sự cân bằng giữa các thế giới, cô chủ quán cùng những vị khách đặc biệt của mình phải đứng lên bảo vệ sự tồn tại của quán trọ và cả vũ trụ.','https://drive.google.com/uc?export=view&id=1YlIIgp9RL-qrwF6tm1_-VK8l6x2I7Mv6&t=1740966917394','published',0,'2025-03-03 01:55:13','2025-03-03 01:55:18','1YlIIgp9RL-qrwF6tm1_-VK8l6x2I7Mv6',10),(88,3,'Đảo Sinh Vật Lạ: Thuyền Trưởng Báo Thù','Thuyền trưởng Jack \'Cá Mập\' Hawkins, một tên cướp biển khét tiếng, bị mắc kẹt trên một hòn đảo kỳ lạ sau một trận bão dữ dội. Hòn đảo này không giống bất cứ nơi nào anh từng thấy; nó tràn ngập những sinh vật đột biến kỳ dị và cây cối kỳ lạ. Khi anh tìm cách trốn thoát, anh phát hiện ra một phòng thí nghiệm bí mật bị bỏ hoang, nơi các thí nghiệm di truyền đã đi sai hướng khủng khiếp. Hawkins phải hợp tác với một nhà khoa học điên lập dị, người có thể nắm giữ chìa khóa để đảo ngược các đột biến và trốn thoát khỏi hòn đảo, tất cả trong khi trốn tránh một tập đoàn tàn nhẫn đang tìm cách vũ khí hóa các sinh vật đột biến cho mục đích riêng của chúng. Cuộc hành trình của họ trở thành một cuộc chạy đua với thời gian để vạch trần sự thật đằng sau hòn đảo và ngăn chặn các sinh vật đột biến rơi vào tay kẻ xấu.','https://drive.google.com/uc?export=view&id=1fisaPzB8jNaNW5w2ouXlsqXibyQi8PM2&t=1740970751752','published',0,'2025-03-03 02:59:07','2025-03-03 02:59:13','1fisaPzB8jNaNW5w2ouXlsqXibyQi8PM2',12);
/*!40000 ALTER TABLE `stories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_bookmarks`
--

DROP TABLE IF EXISTS `story_bookmarks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_bookmarks` (
  `bookmark_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `story_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`bookmark_id`),
  UNIQUE KEY `unique_bookmark` (`user_id`,`story_id`),
  KEY `user_id` (`user_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `story_bookmarks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `story_bookmarks_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_bookmarks`
--

LOCK TABLES `story_bookmarks` WRITE;
/*!40000 ALTER TABLE `story_bookmarks` DISABLE KEYS */;
/*!40000 ALTER TABLE `story_bookmarks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_chapters`
--

DROP TABLE IF EXISTS `story_chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_chapters` (
  `chapter_id` int NOT NULL AUTO_INCREMENT,
  `story_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_number` int NOT NULL,
  `status` enum('draft','published') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `publish_order` int DEFAULT NULL,
  `summary` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`chapter_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `story_chapters_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_chapters`
--

LOCK TABLES `story_chapters` WRITE;
/*!40000 ALTER TABLE `story_chapters` DISABLE KEYS */;
INSERT INTO `story_chapters` VALUES (26,31,'Chương 1: Test báo cáo',1,'published','2025-02-28 13:52:55','2025-02-28 13:52:57',1,'Test'),(27,32,'Chương 1: Test báo cáo',1,'published','2025-02-28 14:23:03','2025-02-28 14:23:05',1,'Test'),(28,33,'Chương 1: Test báo cáo',1,'published','2025-02-28 15:25:34','2025-02-28 15:25:35',1,'Test'),(31,35,'Chương 1: Test báo cáo',1,'published','2025-02-28 16:30:17','2025-02-28 16:30:18',1,'Test'),(32,36,'Chương 1: Test báo cáo',1,'published','2025-02-28 17:19:05','2025-02-28 17:19:06',1,'Test'),(33,37,'Chương 1: Test báo cáo',1,'published','2025-02-28 19:19:57','2025-02-28 19:19:58',1,'Test'),(34,38,'Chương 1: Test báo cáo',1,'published','2025-02-28 20:25:25','2025-02-28 20:25:26',1,'Test'),(35,39,'Chương 1: Test báo cáo',1,'published','2025-02-28 21:21:33','2025-02-28 21:21:34',1,'Test'),(36,40,'Chương 1: Test báo cáo',1,'published','2025-02-28 22:22:39','2025-02-28 22:22:40',1,'Test'),(37,41,'Chương 1: Test báo cáo',1,'published','2025-02-28 23:21:51','2025-02-28 23:21:52',1,'Test'),(38,42,'Chương 1: Test báo cáo',1,'published','2025-03-01 01:58:30','2025-03-01 01:58:31',1,'Test'),(39,43,'Chương 1: Test báo cáo',1,'published','2025-03-01 03:02:33','2025-03-01 03:02:34',1,'Test'),(40,44,'Chương 1: Test báo cáo',1,'published','2025-03-01 04:27:19','2025-03-01 04:27:20',1,'Test'),(41,45,'Chương 1: Test báo cáo',1,'published','2025-03-01 05:22:21','2025-03-01 05:22:22',1,'Test'),(42,46,'Chương 1: Test báo cáo',1,'published','2025-03-01 06:32:13','2025-03-01 06:32:14',1,'Test'),(43,47,'Chương 1: Test báo cáo',1,'published','2025-03-01 07:20:51','2025-03-01 07:20:51',1,'Test'),(44,48,'Chương 1: Test báo cáo',1,'published','2025-03-01 08:28:13','2025-03-01 08:28:13',1,'Test'),(45,49,'Chương 1: Test báo cáo',1,'published','2025-03-01 09:22:32','2025-03-01 09:22:33',1,'Test'),(46,50,'Chương 1: Test báo cáo',1,'published','2025-03-01 10:23:45','2025-03-01 10:23:46',1,'Test'),(47,51,'Chương 1: Test báo cáo',1,'published','2025-03-01 11:17:43','2025-03-01 11:17:44',1,'Test'),(48,52,'Chương 1: Test báo cáo',1,'published','2025-03-01 12:42:37','2025-03-01 12:42:38',1,'Test'),(49,53,'Chương 1: Test báo cáo',1,'published','2025-03-01 13:24:42','2025-03-01 13:24:43',1,'Test'),(50,54,'Chương 1: Test báo cáo',1,'published','2025-03-01 14:21:15','2025-03-01 14:21:16',1,'Test'),(51,55,'Chương 1: Test báo cáo',1,'published','2025-03-01 15:23:10','2025-03-01 15:23:11',1,'Test'),(52,56,'Chương 1: Test báo cáo',1,'published','2025-03-01 16:26:40','2025-03-01 16:26:40',1,'Test'),(53,57,'Chương 1: Test báo cáo',1,'published','2025-03-01 17:19:08','2025-03-01 17:19:09',1,'Test'),(54,58,'Chương 1: Test báo cáo',1,'published','2025-03-01 18:29:36','2025-03-01 18:29:37',1,'Test'),(55,59,'Chương 1: Test báo cáo',1,'published','2025-03-01 19:17:03','2025-03-01 19:17:04',1,'Test'),(56,60,'Chương 1: Test báo cáo',1,'published','2025-03-01 20:23:21','2025-03-01 20:23:22',1,'Test'),(57,61,'Chương 1: Test báo cáo',1,'published','2025-03-01 21:21:07','2025-03-01 21:21:08',1,'Test'),(58,62,'Chương 1: Test báo cáo',1,'published','2025-03-01 22:21:37','2025-03-01 22:21:38',1,'Test'),(59,63,'Chương 1: Test báo cáo',1,'published','2025-03-01 23:22:24','2025-03-01 23:22:25',1,'Test'),(60,64,'Chương 1: Test báo cáo',1,'published','2025-03-02 01:57:26','2025-03-02 01:57:27',1,'Test'),(61,65,'Chương 1: Test báo cáo',1,'published','2025-03-02 03:00:09','2025-03-02 03:00:10',1,'Test'),(62,66,'Chương 1: Test báo cáo',1,'published','2025-03-02 03:34:31','2025-03-02 03:34:31',1,'Test'),(63,67,'Chương 1: Test báo cáo',1,'published','2025-03-02 04:26:30','2025-03-02 04:26:31',1,'Test'),(64,68,'Chương 1: Test báo cáo',1,'published','2025-03-02 05:24:10','2025-03-02 05:24:11',1,'Test'),(65,69,'Chương 1: Test báo cáo',1,'published','2025-03-02 06:31:39','2025-03-02 06:31:40',1,'Test'),(66,70,'Chương 1: Test báo cáo',1,'published','2025-03-02 07:20:20','2025-03-02 07:20:20',1,'Test'),(67,71,'Chương 1: Test báo cáo',1,'published','2025-03-02 08:27:01','2025-03-02 08:27:02',1,'Test'),(68,72,'Chương 1: Test báo cáo',1,'published','2025-03-02 09:23:35','2025-03-02 09:23:36',1,'Test'),(69,73,'Chương 1: Test báo cáo',1,'published','2025-03-02 10:24:00','2025-03-02 10:24:01',1,'Test'),(70,74,'Chương 1: Test báo cáo',1,'published','2025-03-02 11:18:07','2025-03-02 11:18:08',1,'Test'),(71,75,'Chương 1: Test báo cáo',1,'published','2025-03-02 12:41:36','2025-03-02 12:41:37',1,'Test'),(72,76,'Chương 1: Test báo cáo',1,'published','2025-03-02 13:24:04','2025-03-02 13:24:05',1,'Test'),(73,77,'Chương 1: Test báo cáo',1,'published','2025-03-02 14:21:10','2025-03-02 14:21:11',1,'Test'),(74,78,'Chương 1: Test báo cáo',1,'published','2025-03-02 15:23:30','2025-03-02 15:23:31',1,'Test'),(75,79,'Chương 1: Test báo cáo',1,'published','2025-03-02 16:27:13','2025-03-02 16:27:13',1,'Test'),(76,80,'Chương 1: Test báo cáo',1,'published','2025-03-02 17:19:07','2025-03-02 17:19:07',1,'Test'),(77,81,'Chương 1: Test báo cáo',1,'published','2025-03-02 18:30:58','2025-03-02 18:30:59',1,'Test'),(78,82,'Chương 1: Test báo cáo',1,'published','2025-03-02 19:17:08','2025-03-02 19:17:09',1,'Test'),(79,83,'Chương 1: Test báo cáo',1,'published','2025-03-02 20:23:34','2025-03-02 20:23:35',1,'Test'),(80,84,'Chương 1: Test báo cáo',1,'published','2025-03-02 21:21:03','2025-03-02 21:21:05',1,'Test'),(81,85,'Chương 1: Test báo cáo',1,'published','2025-03-02 22:22:07','2025-03-02 22:22:08',1,'Test'),(82,86,'Chương 1: Test báo cáo',1,'published','2025-03-02 23:21:37','2025-03-02 23:21:38',1,'Test'),(83,87,'Chương 1: Test báo cáo',1,'published','2025-03-03 01:55:17','2025-03-03 01:55:18',1,'Test'),(84,88,'Chương 1: Test báo cáo',1,'published','2025-03-03 02:59:12','2025-03-03 02:59:13',1,'Test');
/*!40000 ALTER TABLE `story_chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_characters`
--

DROP TABLE IF EXISTS `story_characters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_characters` (
  `character_id` int NOT NULL AUTO_INCREMENT,
  `story_id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar_file_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role` enum('main','supporting') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'supporting',
  `gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `height` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `personality` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `appearance` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `background` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`character_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `story_characters_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_characters`
--

LOCK TABLES `story_characters` WRITE;
/*!40000 ALTER TABLE `story_characters` DISABLE KEYS */;
/*!40000 ALTER TABLE `story_characters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_comments`
--

DROP TABLE IF EXISTS `story_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_comments` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `story_id` int NOT NULL,
  `chapter_id` int DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `parent_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `story_id` (`story_id`),
  KEY `chapter_id` (`chapter_id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `story_comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `story_comments_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE,
  CONSTRAINT `story_comments_ibfk_3` FOREIGN KEY (`chapter_id`) REFERENCES `story_chapters` (`chapter_id`) ON DELETE CASCADE,
  CONSTRAINT `story_comments_ibfk_4` FOREIGN KEY (`parent_id`) REFERENCES `story_comments` (`comment_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_comments`
--

LOCK TABLES `story_comments` WRITE;
/*!40000 ALTER TABLE `story_comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `story_comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_favorites`
--

DROP TABLE IF EXISTS `story_favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_favorites` (
  `favorite_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `story_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`favorite_id`),
  UNIQUE KEY `unique_favorite` (`user_id`,`story_id`),
  KEY `user_id` (`user_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `story_favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `story_favorites_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_favorites`
--

LOCK TABLES `story_favorites` WRITE;
/*!40000 ALTER TABLE `story_favorites` DISABLE KEYS */;
/*!40000 ALTER TABLE `story_favorites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_outlines`
--

DROP TABLE IF EXISTS `story_outlines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_outlines` (
  `outline_id` int NOT NULL AUTO_INCREMENT,
  `story_id` int NOT NULL,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `order_number` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`outline_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `story_outlines_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_outlines`
--

LOCK TABLES `story_outlines` WRITE;
/*!40000 ALTER TABLE `story_outlines` DISABLE KEYS */;
/*!40000 ALTER TABLE `story_outlines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_tag_relations`
--

DROP TABLE IF EXISTS `story_tag_relations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_tag_relations` (
  `story_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`story_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `story_tag_relations_ibfk_1` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`) ON DELETE CASCADE,
  CONSTRAINT `story_tag_relations_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `story_tags` (`tag_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_tag_relations`
--

LOCK TABLES `story_tag_relations` WRITE;
/*!40000 ALTER TABLE `story_tag_relations` DISABLE KEYS */;
INSERT INTO `story_tag_relations` VALUES (31,1),(32,1),(36,1),(37,1),(39,1),(43,1),(44,1),(46,1),(49,1),(51,1),(53,1),(54,1),(55,1),(56,1),(57,1),(61,1),(62,1),(64,1),(65,1),(67,1),(69,1),(70,1),(73,1),(75,1),(76,1),(78,1),(79,1),(84,1),(85,1),(86,1),(88,1),(31,2),(33,2),(35,2),(37,2),(38,2),(40,2),(42,2),(46,2),(47,2),(48,2),(50,2),(52,2),(53,2),(55,2),(56,2),(61,2),(62,2),(65,2),(67,2),(68,2),(69,2),(70,2),(71,2),(72,2),(73,2),(74,2),(77,2),(80,2),(81,2),(84,2),(86,2),(87,2),(88,2),(36,3),(38,3),(39,3),(46,3),(48,3),(50,3),(53,3),(55,3),(56,3),(57,3),(61,3),(62,3),(65,3),(67,3),(69,3),(70,3),(72,3),(75,3),(76,3),(77,3),(78,3),(79,3),(81,3),(82,3),(84,3),(85,3),(86,3),(87,3),(88,3),(31,4),(36,4),(39,4),(46,4),(49,4),(50,4),(53,4),(55,4),(56,4),(57,4),(61,4),(62,4),(64,4),(65,4),(67,4),(69,4),(70,4),(73,4),(77,4),(82,4),(84,4),(85,4),(86,4),(88,4),(31,5),(36,5),(37,5),(39,5),(44,5),(49,5),(50,5),(53,5),(55,5),(56,5),(61,5),(62,5),(65,5),(69,5),(70,5),(76,5),(77,5),(82,5),(86,5),(87,5),(36,6),(39,6),(49,6),(53,6),(55,6),(61,6),(62,6),(65,6),(69,6),(70,6),(73,6),(76,6),(86,6),(88,6),(31,7),(39,7),(46,7),(49,7),(53,7),(55,7),(57,7),(61,7),(62,7),(65,7),(69,7),(70,7),(73,7),(82,7),(84,7),(86,7),(87,7),(31,8),(36,8),(39,8),(46,8),(53,8),(55,8),(57,8),(62,8),(69,8),(70,8),(73,8),(82,8),(84,8),(86,8),(31,9),(33,9),(35,9),(38,9),(39,9),(40,9),(41,9),(42,9),(44,9),(45,9),(46,9),(47,9),(48,9),(50,9),(52,9),(53,9),(54,9),(58,9),(59,9),(60,9),(62,9),(63,9),(66,9),(68,9),(70,9),(71,9),(72,9),(73,9),(74,9),(77,9),(78,9),(80,9),(81,9),(83,9),(84,9),(31,10),(36,10),(39,10),(46,10),(53,10),(62,10),(69,10),(70,10),(73,10),(82,10),(84,10),(31,11),(32,11),(33,11),(35,11),(36,11),(38,11),(40,11),(41,11),(42,11),(45,11),(46,11),(47,11),(48,11),(50,11),(52,11),(53,11),(54,11),(57,11),(58,11),(59,11),(60,11),(62,11),(63,11),(64,11),(66,11),(68,11),(70,11),(71,11),(72,11),(73,11),(74,11),(75,11),(77,11),(78,11),(79,11),(80,11),(81,11),(83,11),(84,11),(85,11),(87,11),(32,12),(33,12),(35,12),(36,12),(37,12),(38,12),(39,12),(40,12),(41,12),(42,12),(44,12),(45,12),(47,12),(48,12),(50,12),(51,12),(52,12),(54,12),(58,12),(59,12),(60,12),(62,12),(63,12),(64,12),(66,12),(68,12),(70,12),(71,12),(72,12),(74,12),(76,12),(77,12),(80,12),(81,12),(83,12),(87,12),(31,13),(33,13),(35,13),(38,13),(40,13),(41,13),(42,13),(43,13),(45,13),(46,13),(47,13),(48,13),(49,13),(50,13),(51,13),(52,13),(53,13),(54,13),(57,13),(58,13),(59,13),(60,13),(63,13),(66,13),(68,13),(71,13),(72,13),(73,13),(74,13),(77,13),(78,13),(79,13),(80,13),(81,13),(83,13),(84,13),(33,14),(35,14),(38,14),(40,14),(41,14),(42,14),(45,14),(46,14),(47,14),(48,14),(50,14),(52,14),(53,14),(54,14),(58,14),(59,14),(60,14),(63,14),(64,14),(66,14),(68,14),(71,14),(72,14),(74,14),(75,14),(77,14),(80,14),(81,14),(83,14),(88,14),(31,15),(44,15),(49,15),(64,15),(76,15),(82,15),(84,15),(31,16),(46,16),(49,16),(57,16),(73,16),(76,16),(78,16),(82,16),(84,16),(31,17),(32,17),(46,17),(49,17),(53,17),(65,17),(69,17),(73,17),(75,17),(76,17),(78,17),(79,17),(82,17),(31,18),(32,18),(33,18),(35,18),(37,18),(38,18),(40,18),(42,18),(46,18),(47,18),(48,18),(50,18),(52,18),(53,18),(65,18),(68,18),(71,18),(72,18),(73,18),(74,18),(77,18),(80,18),(81,18),(84,18),(85,18),(87,18),(31,19),(46,19),(31,20),(36,20),(43,20),(46,20),(73,20),(88,20),(31,21),(33,21),(35,21),(38,21),(40,21),(41,21),(42,21),(46,21),(47,21),(48,21),(50,21),(52,21),(53,21),(58,21),(59,21),(60,21),(63,21),(66,21),(68,21),(71,21),(72,21),(73,21),(74,21),(77,21),(80,21),(81,21),(83,21),(31,22),(32,22),(33,22),(35,22),(37,22),(38,22),(40,22),(42,22),(43,22),(44,22),(46,22),(47,22),(48,22),(50,22),(51,22),(52,22),(53,22),(57,22),(58,22),(59,22),(64,22),(65,22),(68,22),(71,22),(72,22),(73,22),(74,22),(76,22),(77,22),(78,22),(80,22),(81,22),(82,22),(84,22),(87,22),(31,23),(43,23),(46,23),(51,23),(67,23),(73,23),(79,23),(82,23),(84,23),(85,23),(31,24),(36,24),(46,24),(57,24),(73,24),(31,25),(36,25),(46,25),(73,25),(31,26),(46,26),(73,26),(31,27),(44,27),(46,27),(31,28),(37,28),(46,28),(53,28),(69,28),(73,28),(75,28),(79,28),(87,28),(32,29),(46,29),(53,29),(69,29),(31,30),(46,30),(49,30),(53,30),(65,30),(69,30),(73,30),(76,30),(82,30),(84,30),(87,30);
/*!40000 ALTER TABLE `story_tag_relations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `story_tags`
--

DROP TABLE IF EXISTS `story_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `story_tags` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `story_tags`
--

LOCK TABLES `story_tags` WRITE;
/*!40000 ALTER TABLE `story_tags` DISABLE KEYS */;
INSERT INTO `story_tags` VALUES (1,'School Life','Cuộc sống học đường','2025-02-24 06:42:54'),(2,'Isekai','Chuyển sinh sang thế giới khác','2025-02-24 06:42:54'),(3,'Magic','Phép thuật và ma pháp','2025-02-24 06:42:54'),(4,'Martial Arts','Võ thuật','2025-02-24 06:42:54'),(5,'Mecha','Robot và công nghệ cao','2025-02-24 06:42:54'),(6,'Military','Quân đội và chiến tranh','2025-02-24 06:42:54'),(7,'Music','Âm nhạc','2025-02-24 06:42:54'),(8,'Psychological','Yếu tố tâm lý','2025-02-24 06:42:54'),(9,'Harem','Một nam nhiều nữ','2025-02-24 06:42:54'),(10,'Reverse Harem','Một nữ nhiều nam','2025-02-24 06:42:54'),(11,'Gender Bender','Chuyển đổi giới tính','2025-02-24 06:42:54'),(12,'Historical','Lịch sử','2025-02-24 06:42:54'),(13,'Demons','Ác quỷ và ma quái','2025-02-24 06:42:54'),(14,'Game','Thế giới game','2025-02-24 06:42:54'),(15,'Shounen','Dành cho nam thanh thiếu niên','2025-02-24 06:42:54'),(16,'Shoujo','Dành cho nữ thanh thiếu niên','2025-02-24 06:42:54'),(17,'Seinen','Dành cho nam giới trưởng thành','2025-02-24 06:42:54'),(18,'Josei','Dành cho nữ giới trưởng thành','2025-02-24 06:42:54'),(19,'Tragedy','Bi kịch','2025-02-24 06:42:54'),(20,'Time Travel','Du hành thời gian','2025-02-24 06:42:54'),(21,'Cooking','Nấu ăn','2025-02-24 06:42:54'),(22,'Idol','Thần tượng','2025-02-24 06:42:54'),(23,'Super Power','Siêu năng lực','2025-02-24 06:42:54'),(24,'Vampire','Ma cà rồng','2025-02-24 06:42:54'),(25,'Yandere','Nhân vật có tình yêu bệnh hoạn','2025-02-24 06:42:54'),(26,'Tsundere','Nhân vật có tính cách tsundere','2025-02-24 06:42:54'),(27,'Survival','Sinh tồn','2025-02-24 06:42:54'),(28,'Post-Apocalyptic','Hậu tận thế','2025-02-24 06:42:54'),(29,'Reincarnation','Chuyển sinh','2025-02-24 06:42:54'),(30,'Monster Girls','Gái quái vật','2025-02-24 06:42:54');
/*!40000 ALTER TABLE `story_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscribers`
--

DROP TABLE IF EXISTS `subscribers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscribers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscribers`
--

LOCK TABLES `subscribers` WRITE;
/*!40000 ALTER TABLE `subscribers` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscribers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '/default-user.webp',
  `drive_file_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `has_badge` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Sakae Tomi','tomisakaeap1@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocLA1eLGOrPUELOSBCGVeV-l3Cspl0xaWSgkAf4R80j_viklkLg=s96-c',NULL,0,'2025-02-24 01:40:20','2025-02-24 01:40:20'),(2,'Khoa Nguyễn Đinh Tuấn','khoanguyen.tv0505@gmail.com',NULL,'https://lh3.googleusercontent.com/a/ACg8ocJhMNA68wxXLu_yj014n0Zfe0jcDBFXqzXIJZcKXGokgye3YA=s96-c',NULL,0,'2025-02-27 12:26:48','2025-02-27 12:26:48'),(3,'TomiSakae','tomisakae@gmail.com','$2b$10$iz.4R7l4BPO1kbgknAsVZORbkYQ/WMUPNfzs/VKC.pr19CVZLz1jy','https://drive.google.com/uc?export=view&id=1U1Q98Yi5XTpez2cKMySz9CDjc01ccNn0&t=1740668905828','1U1Q98Yi5XTpez2cKMySz9CDjc01ccNn0',0,'2025-02-27 15:07:26','2025-02-27 15:08:25'),(4,'Test','tomisakaeap2@gmail.com','$2b$10$95Jtaos9gVG3DgeCjusdVOwjyog3z9MA7b284aLE53dt5gUWI3PtK',NULL,NULL,0,'2025-02-28 16:14:54','2025-02-28 16:14:54');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `view_history`
--

DROP TABLE IF EXISTS `view_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `view_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `story_id` int NOT NULL,
  `view_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `user_id` (`user_id`),
  KEY `story_id` (`story_id`),
  CONSTRAINT `view_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `view_history_ibfk_2` FOREIGN KEY (`story_id`) REFERENCES `stories` (`story_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `view_history`
--

LOCK TABLES `view_history` WRITE;
/*!40000 ALTER TABLE `view_history` DISABLE KEYS */;
INSERT INTO `view_history` VALUES (23,1,31,'2025-02-28 13:53:59'),(24,1,31,'2025-02-28 14:49:59');
/*!40000 ALTER TABLE `view_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'chatstoryai'
--

--
-- Dumping routines for database 'chatstoryai'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-03 11:08:50
