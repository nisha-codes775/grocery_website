-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: store_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (12,'Dairy','https://nutrition.org/wp-content/uploads/2019/01/Non-Dairy-Milk-S.Ferreira-2-1500x1125.jpg'),(13,'Grocery','https://5.imimg.com/data5/JQ/BG/AA/ANDROID-104179931/product-jpeg-500x500.jpg'),(14,'Snacks','https://assets.winni.in/product/primary/2021/11/56073.jpeg?dpr=1&w=1000'),(16,'Beauty & Personal Care','https://d2ati23fc66y9j.cloudfront.net/category-pages/sub_category-174021874143.jpg'),(17,'Beverages','https://thumbs.dreamstime.com/b/cans-beverages-19492376.jpg'),(18,'Household Essentials','https://t3.ftcdn.net/jpg/01/91/32/34/360_F_191323402_W2ATUPr8dGHALHrvyX4WVlEDz4qXmmd9.jpg');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `discount_percentage` int NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
INSERT INTO `offers` VALUES (1,'Make Delicious Desert upto 5% OFF',5,'2026-05-27','2026-06-06'),(2,'Cinthol Lime Talcum Powder Superior Germ Protection',10,'2026-05-29','2026-06-15');
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) DEFAULT '1',
  `is_deleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,12,'Taaza Milk',30.00,'https://www.bbassets.com/media/uploads/p/l/40090894_7-amul-taaza.jpg',1,0),(2,12,'Gold Full Cream Milk',36.00,'https://www.bbassets.com/media/uploads/p/l/40090893_8-amul-amul-gold.jpg',1,0),(3,12,'Toned Milk (1L)',77.00,'https://www.bbassets.com/media/uploads/p/l/306926_4-amul-homogenised-toned-milk.jpg',1,0),(4,12,'Amul Pasteurised Butter, 500 g',230.00,'https://www.bbassets.com/media/uploads/p/l/104864_8-amul-butter-pasteurised.jpg',1,0),(5,12,'Amul Pure Milk Cheese Slices, 200 g (10 pcs)',140.00,'https://www.bbassets.com/media/uploads/p/l/104808_9-amul-cheese-slices.jpg',1,0),(6,12,'Britannia Whole Wheat Bread, 450 g ',50.00,'https://www.bbassets.com/media/uploads/p/l/40162924_7-britannia-100-whole-wheat-bread.jpg',1,0),(7,12,'Mother Dairy Classic Curd, 400 g Cup',50.00,'https://www.bbassets.com/media/uploads/p/l/40004532_9-mother-dairy-dahi-made-from-toned-milk.jpg',1,0),(8,12,'Nestle EveryDay Dairy Whitener, 200 g',124.00,'https://www.bbassets.com/media/uploads/p/l/266093_7-nestle-everyday-dairy-whitener-milk-powder-for-tea.jpg',1,0),(9,12,'Amul Fresh Cream, 250 ml',60.00,'https://www.bbassets.com/media/uploads/p/l/40102603_3-amul-fresh-cream-25-milk-fat-low-fat.jpg',1,0),(10,17,'Mountain Dew Citrus Soft Drink(750ml)',38.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/7ff6b74b-6201-4a12-a259-19fa9da3b2cb/Mountain-Dew-Citrus-Soft-Drink.jpeg',1,0),(11,17,'Maaza Mango Fruit Juice (600 ml)',30.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/d5072a7f-924a-46e0-83ed-684612504e2b/Maaza-Mango-Fruit-Juice-Ready-to-Drink-Beverage.jpeg',1,0),(12,17,'Coca-Cola Zero Sugar Soft Drink ',30.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/459528d6-f5bd-4727-8e9d-09d20f56d2b4/Coca-Cola-Zero-Sugar-Soft-Drink-Low-Calorie-Refreshment.jpeg',1,0),(13,17,'Coca-Cola Diet Coke Soft Drink Can',40.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/5e4695df-05d0-4bc7-a3ff-4557b0fdd61b/Coca-Cola-Diet-Coke-Soft-Drink-Can-Low-Calorie-Fizzy.jpeg',1,0),(14,NULL,'HELL Energy Drink ',50.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1085-1085,pr-true,f-auto,q-40,dpr-2/cms/product_variant/9a193d32-4814-4cfe-adf8-8e05fc4fed67/HELL-Energy-Drink-Classic-Canned-Beverage.jpeg',1,0),(15,17,'Sting Energy Drink Pet',20.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2000-2000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/a1babfb1-995f-4498-824c-0d869cd49bfa/Sting-Energy-Drink-Pet.jpeg',1,0),(16,17,'Monster Energy Ultra Zero Sugar',110.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/6f850844-121e-4680-9b1d-a55ed7cab666/Monster-Energy-Ultra-Zero-Sugar-Carbonated-Caffeinated-Beverage.jpeg',1,0),(17,13,'Tata Sampann Unpolished Green Moong',76.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/f0628299-37db-44f1-af00-6ec04d2be8d5/Tata-Sampann-Unpolished-Green-Moong-.jpeg',1,0),(18,13,'Tata Sampann Unpolished Chana Dal',65.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/8bda347f-b661-47de-8392-d7a97c7fadfa/Tata-Sampann-Unpolished-Chana-Dal.jpeg',1,0),(19,13,'Daily Good Sona Masoori Raw Rice',70.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/bf4f32ed-f962-498e-80ff-948405d833af/Daily-Good-Sona-Masoori-Raw-Rice.jpeg',0,0),(20,13,'Daily Good Dosa Rice',70.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/32cb82ad-d221-4f24-968c-024b2d8ace4c/Daily-Good-Dosa-Rice.jpeg',1,0),(21,13,'Daily Good Chilli With Stem / Guntur With Stem',50.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2500-2500,pr-true,f-auto,q-40,dpr-2/cms/product_variant/7bf00949-ffd1-40e1-821c-0d1f03c917ab/Daily-Good-Chilli-With-Stem-Guntur-With-Stem.jpeg',1,0),(22,16,'Cinthol Lime Talcum Powder Superior Germ Protection',172.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1600-1600,pr-true,f-auto,q-40,dpr-2/cms/product_variant/e4605872-c4fa-47be-a135-18686b6023cf/Cinthol-Lime-Talcum-Powder-Superior-Germ-Protection.jpeg',1,0),(23,16,'Denver Detox Day Body Wash for Men',121.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1500-1500,pr-true,f-auto,q-40,dpr-2/cms/product_variant/5118e96d-f845-409a-af45-ff0c0abebd3b/Denver-Detox-Day-Body-Wash-for-Men.jpeg',1,0),(24,NULL,'Pears Pure & Gentle Bathing Soap Share.svg:1 pack (4 x 75 g)',143.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/4470489f-0ab8-4ae5-9a37-9a46fd3445fa/Pears-Pure-Gentle-Bathing-Soap.jpeg',1,0),(25,16,'Lifebuoy Total 10 Protect Hand Wash - Buy 1 Get 1 Free',199.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-2400-2400,pr-true,f-auto,q-40,dpr-2/cms/product_variant/cf55d5d6-b387-4a66-8e01-3c6d261fd21a/Lifebuoy-Total-10-Protect-Hand-Wash-Buy-1-Get-1-Free.jpeg',1,0),(26,16,'Maybelline New York The Colossal Bold Liner',219.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-900-900,pr-true,f-auto,q-40,dpr-2/cms/product_variant/ef918a3f-b160-4c2b-b5e0-b4a38ca2707a/Maybelline-New-York-The-Colossal-Bold-Liner-Smudgeproof-Waterproof-Eyeliner-Bold-Black.jpeg',1,0),(27,14,'Britannia Nutrichoice High-Fibre Digestive Biscuits',22.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1200-1200,pr-true,f-auto,q-40,dpr-2/cms/product_variant/79c80941-4dd4-4ad5-a86e-1ff7157f9e71/Britannia-Nutrichoice-High-Fibre-Digestive-Biscuits.jpeg',1,0),(28,14,'Parle Hide & Seek Choco Chip Cookies',25.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1000-1000,pr-true,f-auto,q-40,dpr-2/cms/product_variant/37ed595e-229d-485e-89bc-a39521ffddf4/Parle-Hide-Seek-Choco-Chip-Cookies.jpeg',1,0),(29,14,'Cadbury Oreo Chocolate Flavour Creme Sandwich Biscuits',10.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-1100-1100,pr-true,f-auto,q-40,dpr-2/cms/product_variant/0164562b-e446-4530-9707-0253fada85b1/Cadbury-Oreo-Chocolate-Flavour-Creme-Sandwich-Biscuits.jpeg',1,0),(30,14,'Farmley Makha Shaka- Flaming Hot Stix ',25.00,'https://cdn.zeptonow.com/production/ik-seo/tr:w-470,ar-3125-3125,pr-true,f-auto,q-40,dpr-2/cms/product_variant/9b701422-a18e-4513-bc92-a03764ee5c5e/Farmley-Makha-Shaka-Flaming-Hot-Stix-Made-With-Makhana-Healthy-Munchies.jpeg',1,0);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-27 21:11:55
