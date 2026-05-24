/*
SQLyog Community v13.3.1 (64 bit)
MySQL - 8.4.8 : Database - lmn-fashion
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`lmn-fashion` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `lmn-fashion`;

/*Table structure for table `categories` */

DROP TABLE IF EXISTS `categories`;

CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `categories` */

insert  into `categories`(`id`,`name`,`description`,`created_at`) values 
(1,'Ao So Mi','Dong ao so mi va polo cotton cao cap','2026-03-27 21:41:10'),
(2,'Quan Nam','Quan tay may do va quan joggers hien dai','2026-03-27 21:41:10'),
(3,'Ao Khoac','Ao khoac, mang to va blazers sang trong','2026-03-27 21:41:10'),
(4,'Phu Kien','Dong ho, that lung va kinh ram nam tinh','2026-03-27 21:41:10');

/*Table structure for table `chat_messages` */

DROP TABLE IF EXISTS `chat_messages`;

CREATE TABLE `chat_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT 'ID khach hang (chu cuoc tro chuyen)',
  `sender_id` int NOT NULL COMMENT 'ID nguoi gui',
  `sender_role` enum('customer','admin') NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `chat_messages` */

insert  into `chat_messages`(`id`,`user_id`,`sender_id`,`sender_role`,`message`,`is_read`,`created_at`) values 
(1,4,4,'customer','alo',1,'2026-04-12 20:57:30'),
(2,4,2,'admin','123',1,'2026-04-12 21:00:22');

/*Table structure for table `chatbot_knowledge` */

DROP TABLE IF EXISTS `chatbot_knowledge`;

CREATE TABLE `chatbot_knowledge` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `patterns` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `response` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `chatbot_knowledge` */

insert  into `chatbot_knowledge`(`id`,`tag`,`patterns`,`response`,`created_at`) values 
(1,'chÃ o_há»i','xin chÃ o,chÃ o,hello,hi,hey,alo,báº¯t Ä‘áº§u,cÃ³ ai khÃ´ng,shop Æ¡i,báº¡n Æ¡i,chÃ o shop,cho mÃ¬nh há»i,chÃ o báº¡n,háº¿ lÃ´,yo,mÃ¬nh cáº§n há»— trá»£,xin chao,chao,ai Æ¡i,help me,cÃ³ ai há»— trá»£ khÃ´ng,mÃ¬nh muá»‘n há»i,lmn Æ¡i,bot Æ¡i','? Xin chÃ o! MÃ¬nh lÃ  LMN Bot ?\nMÃ¬nh cÃ³ thá»ƒ giÃºp báº¡n vá» sáº£n pháº©m, giao hÃ ng, Ä‘á»•i tráº£, thanh toÃ¡n vÃ  nhiá»u hÆ¡n ná»¯a!\nBáº¡n cáº§n há»— trá»£ gÃ¬ áº¡?','2026-04-05 15:25:06'),
(2,'giao_hÃ ng','giao hÃ ng máº¥t bao lÃ¢u,bao lÃ¢u thÃ¬ nháº­n Ä‘Æ°á»£c hÃ ng,thá»i gian giao hÃ ng,ship máº¥t máº¥y ngÃ y,khi nÃ o nháº­n Ä‘Æ°á»£c,váº­n chuyá»ƒn máº¥t bao lÃ¢u,giao hÃ ng nhanh khÃ´ng,máº¥y ngÃ y cÃ³ hÃ ng,giao hÃ ng trong bao lÃ¢u,ship vá» tá»‰nh máº¥t bao lÃ¢u,giao hÃ ng toÃ n quá»‘c khÃ´ng,bao giá» nháº­n hÃ ng,hÃ ng máº¥y ngÃ y tá»›i,delivery time,ship nhanh khÃ´ng,thá»i gian váº­n chuyá»ƒn,bao lÃ¢u ship vá»,máº¥t bao lÃ¢u Ä‘á»ƒ nháº­n hÃ ng,khi nÃ o giao,bao lau thi nhan,ship mat may ngay,giao hang mat bao lau','? LMN giao hÃ ng toÃ n quá»‘c!\nThá»i gian dá»± kiáº¿n:\nâ€¢ HÃ  Ná»™i, HCM: 1â€“2 ngÃ y lÃ m viá»‡c\nâ€¢ Tá»‰nh thÃ nh khÃ¡c: 3â€“5 ngÃ y lÃ m viá»‡c\nÄÆ¡n hÃ ng sáº½ Ä‘Æ°á»£c Ä‘Ã³ng gÃ³i vÃ  gá»­i trong vÃ²ng 24h sau khi xÃ¡c nháº­n.','2026-04-05 15:25:06'),
(3,'phÃ­_ship','phÃ­ ship bao nhiÃªu,phÃ­ giao hÃ ng,cÃ³ máº¥t phÃ­ ship khÃ´ng,ship cÃ³ tÃ­nh tiá»n khÃ´ng,free ship khÃ´ng,miá»…n phÃ­ váº­n chuyá»ƒn khÃ´ng,phÃ­ váº­n chuyá»ƒn bao nhiÃªu,tá»‘n bao nhiÃªu tiá»n ship,ship bao nhiÃªu tiá»n,cÆ°á»›c giao hÃ ng,phÃ­ ship,phi ship bao nhieu,mien phi ship,free ship,tÃ­nh phÃ­ váº­n chuyá»ƒn khÃ´ng,ship cÃ³ free khÃ´ng,phÃ­ giao bao nhiÃªu','? LMN miá»…n phÃ­ giao hÃ ng 100% cho táº¥t cáº£ Ä‘Æ¡n hÃ ng trÃªn toÃ n quá»‘c!\nKhÃ´ng cÃ³ Ä‘Æ¡n tá»‘i thiá»ƒu, khÃ´ng cÃ³ Ä‘iá»u kiá»‡n - mua lÃ  Ä‘Æ°á»£c ship ngay!','2026-04-05 15:25:06'),
(4,'Ä‘á»•i_tráº£','Ä‘á»•i tráº£ nhÆ° tháº¿ nÃ o,chÃ­nh sÃ¡ch Ä‘á»•i tráº£,tráº£ hÃ ng Ä‘Æ°á»£c khÃ´ng,muá»‘n Ä‘á»•i hÃ ng,hÃ ng lá»—i thÃ¬ sao,khÃ´ng vá»«a muá»‘n Ä‘á»•i,Ä‘á»•i size Ä‘Æ°á»£c khÃ´ng,hoÃ n hÃ ng nhÆ° tháº¿ nÃ o,khÃ´ng Æ°ng muá»‘n tráº£,sáº£n pháº©m lá»—i pháº£i lÃ m sao,hÃ ng khÃ´ng Ä‘Ãºng mÃ´ táº£,Ä‘á»•i hÃ ng,tráº£ hÃ ng,return policy,refund,hoÃ n tiá»n Ä‘Æ°á»£c khÃ´ng,hÃ ng bá»‹ lá»—i,doi tra,tra hang,muá»‘n tráº£ láº¡i,khÃ´ng vá»«a,lá»—i sáº£n pháº©m,Ä‘á»•i cÃ¡i khÃ¡c','? ChÃ­nh sÃ¡ch Ä‘á»•i tráº£ LMN:\nâ€¢ Äá»•i tráº£ MIá»„N PHÃ trong vÃ²ng 30 ngÃ y\nâ€¢ Äiá»u kiá»‡n: hÃ ng cÃ²n nguyÃªn tag, chÆ°a qua sá»­ dá»¥ng\nâ€¢ HÃ ng lá»—i do sáº£n xuáº¥t: Ä‘á»•i má»›i 100%\nâ€¢ LiÃªn há»‡: support@lmnfashion.com\nChÃºng mÃ¬nh sáº½ xá»­ lÃ½ trong 24â€“48h lÃ m viá»‡c!','2026-04-05 15:25:06'),
(5,'thanh_toan','hinh thuc thanh toan,thanh toan bang gi,co cod khong,tra tien mat duoc khong,phuong thuc thanh toan,payment method,tra tien kieu gi','LMN hien chi ho tro COD - thanh toan tien mat khi nhan hang.','2026-04-05 15:25:06'),
(6,'size_báº£ng','báº£ng size,size Ã¡o,size quáº§n,chá»n size nhÆ° tháº¿ nÃ o,size m lÃ  bao nhiÃªu,size l bao nhiÃªu cm,báº£ng Ä‘o size,mÃ¬nh nÃªn chá»n size gÃ¬,size xl nhÆ° tháº¿ nÃ o,cá»¡ Ã¡o,kÃ­ch cá»¡ sáº£n pháº©m,guide size,bang size,kich co,size chart,Ä‘o size,mÃ¬nh cao 1m7 máº·c size gÃ¬,náº·ng 60kg máº·c size gÃ¬,chá»n cá»¡,tÆ° váº¥n size','? Báº£ng size LMN Fashion (Ä‘Æ¡n vá»‹: cm):\n\n| Size | Vai  | Ngá»±c | DÃ i |\n|------|------|------|-----|\n| S    | 42   | 88   | 67  |\n| M    | 44   | 92   | 68  |\n| L    | 46   | 96   | 69  |\n| XL   | 48   | 100  | 70  |\n| XXL  | 50   | 104  | 71  |\n\n? Tip: Náº¿u khÃ´ng cháº¯c, hÃ£y chá»n size lá»›n hÆ¡n má»™t báº­c!\n\n? HÆ°á»›ng dáº«n: Äo chiá»u rá»™ng vai, vÃ²ng ngá»±c, vÃ  chiá»u dÃ i Ã¡o trÆ°á»›c khi Ä‘áº·t.','2026-04-05 15:25:06'),
(7,'cháº¥t_liá»‡u','cháº¥t liá»‡u váº£i,váº£i gÃ¬,cháº¥t váº£i,cÃ³ tá»‘t khÃ´ng,cotton khÃ´ng,giáº·t nhÆ° tháº¿ nÃ o,bá»n khÃ´ng,váº£i cÃ³ co khÃ´ng,váº£i cÃ³ nhÄƒn khÃ´ng,cháº¥t lÆ°á»£ng tháº¿ nÃ o,chat lieu,vai gi,material,fabric,báº£o quáº£n nhÆ° nÃ o,giáº·t mÃ¡y Ä‘Æ°á»£c khÃ´ng,cÃ³ phai mÃ u khÃ´ng','? Sáº£n pháº©m LMN dÃ¹ng váº£i cao cáº¥p:\n\nâ€¢ **Cotton 100%** tá»± nhiÃªn, thoÃ¡ng mÃ¡t, tháº¥m hÃºt tá»‘t\nâ€¢ **Váº£i dá»‡t kim** co giÃ£n 4 chiá»u cho Ã¡o thá»ƒ thao\nâ€¢ Chá»‘ng nhÄƒn, bá»n mÃ u sau nhiá»u láº§n giáº·t\n\n? HÆ°á»›ng dáº«n giáº·t:\nâ€¢ Giáº·t á»Ÿ nhiá»‡t â‰¤ 30Â°C\nâ€¢ KhÃ´ng dÃ¹ng cháº¥t táº©y máº¡nh\nâ€¢ PhÆ¡i trong bÃ³ng rÃ¢m, trÃ¡nh Ã¡nh náº¯ng trá»±c tiáº¿p','2026-04-05 15:25:06'),
(8,'Ä‘Æ¡n_hÃ ng','xem Ä‘Æ¡n hÃ ng á»Ÿ Ä‘Ã¢u,kiá»ƒm tra Ä‘Æ¡n hÃ ng,Ä‘Æ¡n hÃ ng cá»§a tÃ´i,theo dÃµi Ä‘Æ¡n hÃ ng,Ä‘Æ¡n hÃ ng Ä‘Ã¢u rá»“i,tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng,Ä‘Æ¡n hÃ ng bá»‹ gÃ¬ váº­y,sao chÆ°a tháº¥y Ä‘Æ¡n,Ä‘áº·t hÃ ng rá»“i sao chÆ°a giao,don hang,order status,track order,xem don hang,Ä‘Æ¡n mÃ¬nh Ä‘Ã¢u rá»“i,kiá»ƒm tra order,hÃ ng ship tá»›i Ä‘Ã¢u rá»“i','? Äá»ƒ xem Ä‘Æ¡n hÃ ng cá»§a báº¡n:\n1. ÄÄƒng nháº­p vÃ o tÃ i khoáº£n\n2. Click icon ? trÃªn thanh Ä‘iá»u hÆ°á»›ng (gÃ³c pháº£i)\n3. Xem chi tiáº¿t tá»«ng Ä‘Æ¡n hÃ ng\n\nTráº¡ng thÃ¡i Ä‘Æ¡n:\nâ€¢ ? Chá» xá»­ lÃ½ â†’ Ä‘Æ¡n vá»«a Ä‘áº·t\nâ€¢ ? Äang xá»­ lÃ½ â†’ Ä‘ang Ä‘Ã³ng gÃ³i\nâ€¢ ? HoÃ n thÃ nh â†’ Ä‘Ã£ giao thÃ nh cÃ´ng','2026-04-05 15:25:06'),
(9,'Ä‘Äƒng_kÃ½','Ä‘Äƒng kÃ½ tÃ i khoáº£n,táº¡o tÃ i khoáº£n,cÃ¡ch Ä‘Äƒng kÃ½,láº­p tÃ i khoáº£n má»›i,register,signup,chÆ°a cÃ³ tÃ i khoáº£n,dang ky,tao tai khoan,sign up,create account,lÃ m sao Ä‘á»ƒ mua hÃ ng,cáº§n Ä‘Äƒng kÃ½ khÃ´ng,Ä‘Äƒng nháº­p','? CÃ¡ch Ä‘Äƒng kÃ½ tÃ i khoáº£n LMN:\n1. Click icon ? gÃ³c pháº£i mÃ n hÃ¬nh\n2. Chá»n **ÄÄƒng KÃ½**\n3. Äiá»n thÃ´ng tin: username, email, há» tÃªn\n4. Nháº­p mÃ£ OTP gá»­i vá» email\n5. HoÃ n táº¥t!\n\nChá»‰ máº¥t khoáº£ng 1 phÃºt thÃ´i ?','2026-04-05 15:25:06'),
(10,'khuyáº¿n_mÃ£i','cÃ³ khuyáº¿n mÃ£i khÃ´ng,sale khÃ´ng,giáº£m giÃ¡ khÃ´ng,mÃ£ giáº£m giÃ¡,coupon,voucher,cÃ³ Æ°u Ä‘Ã£i gÃ¬ khÃ´ng,Ä‘á»£t sale nÃ o khÃ´ng,cÃ³ discount khÃ´ng,khuyen mai,giam gia,promo,promotion,mÃ£ code giáº£m giÃ¡,flash sale,deal,hot deal','?ï¸ LMN thÆ°á»ng xuyÃªn cÃ³ cÃ¡c Ä‘á»£t khuyáº¿n mÃ£i!\n\nâ€¢ Nháº­p mÃ£ coupon khi checkout Ä‘á»ƒ Ä‘Æ°á»£c giáº£m giÃ¡\nâ€¢ Follow fanpage Facebook & Instagram Ä‘á»ƒ nháº­n thÃ´ng bÃ¡o sale sá»›m nháº¥t\nâ€¢ ThÃ nh viÃªn má»›i Ä‘Æ°á»£c Æ°u Ä‘Ã£i Ä‘Æ¡n hÃ ng Ä‘áº§u tiÃªn\n\nHiá»‡n táº¡i sáº£n pháº©m Ä‘ang á»Ÿ giÃ¡ Ä‘áº·c biá»‡t, Ä‘á»«ng bá» lá»¡! ?','2026-04-05 15:25:06'),
(11,'liÃªn_há»‡','liÃªn há»‡ á»Ÿ Ä‘Ã¢u,hotline,sá»‘ Ä‘iá»‡n thoáº¡i,email shop,contact,há»— trá»£ khÃ¡ch hÃ ng,gáº·p nhÃ¢n viÃªn,cáº§n tÆ° váº¥n,muá»‘n nÃ³i chuyá»‡n vá»›i ngÆ°á»i tháº­t,lien he,sdt,dien thoai,address,dia chi,shop á»Ÿ Ä‘Ã¢u,cá»­a hÃ ng á»Ÿ Ä‘Ã¢u,zalo shop','? ThÃ´ng tin liÃªn há»‡ LMN Fashion:\n\n? Email: support@lmnfashion.com\n? Äá»‹a chá»‰: HÃ  Ná»™i, Viá»‡t Nam\nâ° Giá» lÃ m viá»‡c: 8:00 â€“ 22:00 (Thá»© 2 â€“ Chá»§ nháº­t)\n\nChÃºng mÃ¬nh sáº½ pháº£n há»“i sá»›m nháº¥t cÃ³ thá»ƒ! ?','2026-04-05 15:25:06'),
(12,'thÆ°Æ¡ng_hiá»‡u','lmn lÃ  gÃ¬,vá» lmn,lmn fashion lÃ  gÃ¬,shop lÃ  ai,thÆ°Æ¡ng hiá»‡u lmn,lmn cÃ³ uy tÃ­n khÃ´ng,lmn tá»« Ä‘Ã¢u,giá»›i thiá»‡u vá» shop,cá»­a hÃ ng á»Ÿ Ä‘Ã¢u,about lmn,who is lmn,lmn story,brand story,shop bÃ¡n gÃ¬,lmn bÃ¡n cÃ¡i gÃ¬,giá»›i thiá»‡u','?ï¸ LMN Fashion â€“ Thá»i trang nam tá»‘i giáº£n, Made in Vietnam.\n\nChÃºng mÃ¬nh tin vÃ o:\nâ€¢ Cháº¥t lÆ°á»£ng hÆ¡n sá»‘ lÆ°á»£ng\nâ€¢ Thiáº¿t káº¿ tinh táº¿, vÆ°á»£t thá»i gian\nâ€¢ Sáº£n xuáº¥t cÃ³ trÃ¡ch nhiá»‡m vá»›i mÃ´i trÆ°á»ng\n\nMá»—i sáº£n pháº©m Ä‘Æ°á»£c thiáº¿t káº¿ tá»‰ má»‰ Ä‘á»ƒ giÃºp báº¡n tá»± tin má»—i ngÃ y! âœ¨','2026-04-05 15:25:06'),
(13,'cáº£m_Æ¡n','cáº£m Æ¡n,thank you,thanks,tks,camon,oke rá»“i,ok rá»“i,Ä‘Æ°á»£c rá»“i,hiá»ƒu rá»“i,rÃµ rá»“i,cam on,thank,tks nhe,ok mÃ¬nh hiá»ƒu rá»“i,mÃ¬nh hiá»ƒu rá»“i cáº£m Æ¡n,great thanks,tuyá»‡t vá»i','? KhÃ´ng cÃ³ gÃ¬! LMN luÃ´n sáºµn sÃ ng há»— trá»£ báº¡n.\nChÃºc báº¡n mua sáº¯m vui váº»! ?ï¸','2026-04-05 15:25:06'),
(14,'táº¡m_biá»‡t','táº¡m biá»‡t,bye,goodbye,thÃ´i nhÃ©,xong rá»“i,háº¹n gáº·p láº¡i,Ä‘i Ä‘Ã¢y,ok thÃ´i,tam biet,see you,good night,táº¡m biá»‡t nha,mÃ¬nh Ä‘i trÆ°á»›c nhÃ©,bye bye,chÃ o nhÃ©','? Táº¡m biá»‡t! Háº¹n gáº·p láº¡i báº¡n táº¡i LMN Fashion nhÃ©!\nCáº£m Æ¡n Ä‘Ã£ ghÃ© thÄƒm cá»­a hÃ ng cá»§a mÃ¬nh! ?ï¸','2026-04-05 15:25:06'),
(15,'mua_hang','mua hang nhu the nao,cach dat hang,cach mua,dat hang o dau,lam sao de mua,order nhu nao,quy trinh mua hang','Cach mua hang tai LMN Fashion:\n\n1. Chon san pham\n2. Them vao gio va chon so luong\n3. Kiem tra gio hang\n4. Nhap dia chi, SDT va ma giam gia neu co\n5. Chon thanh toan COD\n6. Xac nhan don hang','2026-04-05 15:25:06'),
(16,'báº£o_hÃ nh','báº£o hÃ nh,warranty,báº£o hÃ nh bao lÃ¢u,chÃ­nh sÃ¡ch báº£o hÃ nh,hÃ ng cÃ³ báº£o hÃ nh khÃ´ng,bao hanh,guarantee,sáº£n pháº©m bá»‹ há»ng,lá»—i ká»¹ thuáº­t,hÃ£y lo Ä‘Æ°á»£c khÃ´ng','?ï¸ **ChÃ­nh sÃ¡ch báº£o hÃ nh LMN:**\n\nâ€¢ Báº£o hÃ nh 30 ngÃ y cho táº¥t cáº£ sáº£n pháº©m\nâ€¢ Ãp dá»¥ng cho lá»—i sáº£n xuáº¥t, lá»—i váº£i, lá»—i Ä‘Æ°á»ng may\nâ€¢ KHÃ”NG Ã¡p dá»¥ng cho hao mÃ²n tá»± nhiÃªn hoáº·c sá»­ dá»¥ng sai cÃ¡ch\n\n? Gá»­i áº£nh/video lá»—i vá»: support@lmnfashion.com\nChÃºng mÃ¬nh sáº½ xá»­ lÃ½ trong 24-48h!','2026-04-05 15:25:06'),
(17,'phong_cÃ¡ch','phong cÃ¡ch,mix Ä‘á»“,phá»‘i Ä‘á»“,máº·c gÃ¬ Ä‘áº¹p,style,phá»‘i mÃ u,mix match,outfit,nÃªn máº·c gÃ¬,gá»£i Ã½ outfit,thá»i trang nam,phoi do,mac gi dep,mix do the nao','? **Gá»£i Ã½ phong cÃ¡ch tá»« LMN:**\n\n? **Minimalist (Tá»‘i giáº£n):**\n  Ão thun + Quáº§n kaki = Clean & Sharp\n\n? **Smart Casual:**\n  Ão polo + Quáº§n jean = Lá»‹ch lÃ£m mÃ  thoáº£i mÃ¡i\n\nâš« **Streetwear:**\n  Ão hoodie + Quáº§n jogger + GiÃ y thá»ƒ thao = Cool & Trendy\n\n? Mix vá»›i phá»¥ kiá»‡n (mÅ©, tÃºi Ä‘eo chÃ©o) Ä‘á»ƒ hoÃ n thiá»‡n look!\nHá»i mÃ¬nh tÃªn sáº£n pháº©m cá»¥ thá»ƒ Ä‘á»ƒ biáº¿t giÃ¡ nhÃ© ?','2026-04-05 15:25:06');

/*Table structure for table `coupons` */

DROP TABLE IF EXISTS `coupons`;

CREATE TABLE `coupons` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` enum('percent','fixed') COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT '0.00',
  `usage_limit` int DEFAULT NULL,
  `used_count` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `coupons` */

insert  into `coupons`(`id`,`code`,`discount_type`,`discount_value`,`min_order_amount`,`usage_limit`,`used_count`,`is_active`,`expires_at`,`created_at`) values 
(1,'WELCOME10','percent',10.00,500000.00,100,0,1,'2027-12-31 23:59:59','2026-03-27 21:41:10'),
(2,'SAVE200K','fixed',200000.00,1500000.00,50,0,1,'2027-12-31 23:59:59','2026-03-27 21:41:10');

/*Table structure for table `inventory_logs` */

DROP TABLE IF EXISTS `inventory_logs`;

CREATE TABLE `inventory_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `change_amount` int NOT NULL,
  `reason` enum('order_created','order_cancelled','manual_adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `inventory_logs_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `inventory_logs_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `inventory_logs` */

insert  into `inventory_logs`(`id`,`product_id`,`order_id`,`change_amount`,`reason`,`created_at`) values 
(3,5,3,-1,'order_created','2026-03-27 21:47:53'),
(4,5,4,-1,'order_created','2026-03-27 21:53:47'),
(5,'thanh_toan','hinh thuc thanh toan,thanh toan bang gi,co cod khong,tra tien mat duoc khong,phuong thuc thanh toan,payment method,tra tien kieu gi','LMN hien chi ho tro COD - thanh toan tien mat khi nhan hang.','2026-04-05 15:25:06'),
(6,5,6,-1,'order_created','2026-03-27 21:55:17'),
(7,5,7,-1,'order_created','2026-03-27 21:57:11'),
(8,5,8,-1,'order_created','2026-03-27 21:58:00'),
(9,5,9,-1,'order_created','2026-03-27 21:59:32'),
(10,5,10,-1,'order_created','2026-03-27 22:02:15'),
(11,5,11,-1,'order_created','2026-03-27 22:04:00'),
(12,5,12,-1,'order_created','2026-03-27 22:04:27'),
(13,5,13,-1,'order_created','2026-03-27 22:05:41'),
(14,2,13,-1,'order_created','2026-03-27 22:05:41'),
(15,'mua_hang','mua hang nhu the nao,cach dat hang,cach mua,dat hang o dau,lam sao de mua,order nhu nao,quy trinh mua hang','Cach mua hang tai LMN Fashion:\n\n1. Chon san pham\n2. Them vao gio va chon so luong\n3. Kiem tra gio hang\n4. Nhap dia chi, SDT va ma giam gia neu co\n5. Chon thanh toan COD\n6. Xac nhan don hang','2026-04-05 15:25:06'),
(16,2,14,-1,'order_created','2026-03-27 22:07:10'),
(17,5,15,-1,'order_created','2026-03-27 22:08:24'),
(18,2,15,-1,'order_created','2026-03-27 22:08:24'),
(19,5,16,-1,'order_created','2026-03-27 22:08:25'),
(20,2,16,-1,'order_created','2026-03-27 22:08:25'),
(21,5,17,-1,'order_created','2026-03-27 22:10:43'),
(22,2,17,-1,'order_created','2026-03-27 22:10:43'),
(23,5,18,-1,'order_created','2026-03-27 22:11:58'),
(24,2,18,-1,'order_created','2026-03-27 22:11:58'),
(25,5,19,-1,'order_created','2026-03-27 22:13:29'),
(26,2,19,-1,'order_created','2026-03-27 22:13:29'),
(27,5,20,-1,'order_created','2026-03-27 22:14:53'),
(28,2,20,-1,'order_created','2026-03-27 22:14:53'),
(29,29,21,-1,'order_created','2026-03-27 22:16:01'),
(30,30,21,-1,'order_created','2026-03-27 22:16:01'),
(31,29,22,-1,'order_created','2026-03-27 22:18:55'),
(32,30,22,-1,'order_created','2026-03-27 22:18:55'),
(33,29,23,-1,'order_created','2026-03-27 22:19:16'),
(34,30,23,-1,'order_created','2026-03-27 22:19:16'),
(35,2,24,-1,'order_created','2026-03-27 22:19:43'),
(36,2,25,-1,'order_created','2026-03-27 22:19:43'),
(37,2,26,-2,'order_created','2026-03-27 22:21:54'),
(38,6,27,-1,'order_created','2026-03-27 22:22:14'),
(39,6,28,-1,'order_created','2026-03-27 22:32:13'),
(40,6,29,-1,'order_created','2026-03-27 22:33:43'),
(41,51,29,-1,'order_created','2026-03-27 22:33:43'),
(42,38,30,-1,'order_created','2026-03-27 22:33:57'),
(43,23,31,-1,'order_created','2026-03-27 22:34:14'),
(44,23,32,-1,'order_created','2026-03-27 22:36:09'),
(45,1,33,-1,'order_created','2026-03-27 22:49:37'),
(46,1,34,-5,'order_created','2026-03-27 22:53:22'),
(47,1,35,-5,'order_created','2026-03-27 22:58:21'),
(48,2,35,-1,'order_created','2026-03-27 22:58:21'),
(49,1,36,-5,'order_created','2026-03-27 23:00:42'),
(50,2,36,-1,'order_created','2026-03-27 23:00:42'),
(51,1,37,-5,'order_created','2026-03-27 23:01:18'),
(52,1,38,-5,'order_created','2026-03-27 23:03:55'),
(53,1,39,-11,'order_created','2026-03-27 23:04:18'),
(54,1,40,-14,'order_created','2026-03-27 23:07:36'),
(55,1,41,-17,'order_created','2026-03-27 23:08:17'),
(56,1,42,-12,'order_created','2026-03-27 23:14:38'),
(57,2,43,-1,'order_created','2026-03-27 23:19:12'),
(58,2,44,-1,'order_created','2026-03-27 23:21:03'),
(59,2,45,-1,'order_created','2026-03-27 23:22:30'),
(60,2,46,-1,'order_created','2026-03-27 23:29:06'),
(61,5,47,-1,'order_created','2026-03-27 23:29:26'),
(62,2,48,-1,'order_created','2026-03-27 23:30:17'),
(63,2,49,-1,'order_created','2026-03-27 23:32:06'),
(64,23,50,-1,'order_created','2026-04-02 20:13:13'),
(65,5,50,-1,'order_created','2026-04-02 20:13:13'),
(66,2,50,-1,'order_created','2026-04-02 20:13:13'),
(71,2,53,-1,'order_created','2026-04-02 20:31:56'),
(74,1,55,-1,'order_created','2026-04-02 20:41:20'),
(75,4,56,-1,'order_created','2026-04-02 20:45:28'),
(76,3,57,-1,'order_created','2026-04-02 20:50:12'),
(81,50,59,-1,'order_created','2026-04-10 14:34:47'),
(82,2,60,-1,'order_created','2026-04-12 20:10:55'),
(85,2,62,-1,'order_created','2026-04-12 20:19:41'),
(86,2,63,-1,'order_created','2026-04-12 20:22:01'),
(87,2,64,-1,'order_created','2026-04-12 20:23:56'),
(88,2,65,-1,'order_created','2026-04-12 20:28:47'),
(89,2,66,-1,'order_created','2026-04-12 20:34:13'),
(90,2,67,-1,'order_created','2026-04-12 20:36:04'),
(91,6,68,-1,'order_created','2026-04-12 20:36:41'),
(92,5,69,-1,'order_created','2026-04-12 20:41:22');

/*Table structure for table `order_items` */

DROP TABLE IF EXISTS `order_items`;

CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `order_items` */

insert  into `order_items`(`id`,`order_id`,`product_id`,`quantity`,`size`,`price`) values 
(3,3,5,1,NULL,500000.00),
(4,4,5,1,NULL,500000.00),
(5,'thanh_toan','hinh thuc thanh toan,thanh toan bang gi,co cod khong,tra tien mat duoc khong,phuong thuc thanh toan,payment method,tra tien kieu gi','LMN hien chi ho tro COD - thanh toan tien mat khi nhan hang.','2026-04-05 15:25:06'),
(6,6,5,1,NULL,500000.00),
(7,7,5,1,NULL,500000.00),
(8,8,5,1,NULL,500000.00),
(9,9,5,1,NULL,500000.00),
(10,10,5,1,NULL,500000.00),
(11,11,5,1,NULL,500000.00),
(12,12,5,1,NULL,500000.00),
(13,13,5,1,NULL,500000.00),
(14,13,2,1,NULL,500000.00),
(15,'mua_hang','mua hang nhu the nao,cach dat hang,cach mua,dat hang o dau,lam sao de mua,order nhu nao,quy trinh mua hang','Cach mua hang tai LMN Fashion:\n\n1. Chon san pham\n2. Them vao gio va chon so luong\n3. Kiem tra gio hang\n4. Nhap dia chi, SDT va ma giam gia neu co\n5. Chon thanh toan COD\n6. Xac nhan don hang','2026-04-05 15:25:06'),
(16,14,2,1,NULL,500000.00),
(17,15,5,1,NULL,500000.00),
(18,15,2,1,NULL,500000.00),
(19,16,5,1,NULL,500000.00),
(20,16,2,1,NULL,500000.00),
(21,17,5,1,NULL,500000.00),
(22,17,2,1,NULL,500000.00),
(23,18,5,1,NULL,500000.00),
(24,18,2,1,NULL,500000.00),
(25,19,5,1,NULL,500000.00),
(26,19,2,1,NULL,500000.00),
(27,20,5,1,NULL,500000.00),
(28,20,2,1,NULL,500000.00),
(29,21,29,1,NULL,500000.00),
(30,21,30,1,NULL,500000.00),
(31,22,29,1,NULL,500000.00),
(32,22,30,1,NULL,500000.00),
(33,23,29,1,NULL,500000.00),
(34,23,30,1,NULL,500000.00),
(35,24,2,1,NULL,500000.00),
(36,25,2,1,NULL,500000.00),
(37,26,2,2,NULL,500000.00),
(38,27,6,1,NULL,500000.00),
(39,28,6,1,NULL,500000.00),
(40,29,6,1,NULL,500000.00),
(41,29,51,1,NULL,500000.00),
(42,30,38,1,NULL,500000.00),
(43,31,23,1,NULL,500000.00),
(44,32,23,1,NULL,500000.00),
(45,33,1,1,NULL,500000.00),
(46,34,1,5,NULL,500000.00),
(47,35,1,5,NULL,500000.00),
(48,35,2,1,NULL,500000.00),
(49,36,1,5,NULL,500000.00),
(50,36,2,1,NULL,500000.00),
(51,37,1,5,NULL,500000.00),
(52,38,1,5,NULL,500000.00),
(53,39,1,11,NULL,500000.00),
(54,40,1,14,NULL,500000.00),
(55,41,1,17,NULL,500000.00),
(56,42,1,12,NULL,500000.00),
(57,43,2,1,NULL,500000.00),
(58,44,2,1,NULL,500000.00),
(59,45,2,1,NULL,500000.00),
(60,46,2,1,NULL,500000.00),
(61,47,5,1,NULL,500000.00),
(62,48,2,1,NULL,500000.00),
(63,49,2,1,NULL,500000.00),
(64,50,23,1,NULL,500000.00),
(65,50,5,1,NULL,500000.00),
(66,50,2,1,NULL,500000.00),
(69,53,2,1,NULL,2000.00),
(71,55,1,1,NULL,2000.00),
(72,56,4,1,NULL,2000.00),
(73,57,3,1,NULL,2000.00),
(76,59,50,1,NULL,2000.00),
(77,60,2,1,'M',2000.00),
(79,62,2,1,'M',2000.00),
(80,63,2,1,'L',2000.00),
(81,64,2,1,'M',2000.00),
(82,65,2,1,'M',2000.00),
(83,66,2,1,'M',2000.00),
(84,67,2,1,'S',2000.00),
(85,68,6,1,'S',2000.00),
(86,69,5,1,'M',2000.00);

/*Table structure for table `orders` */

DROP TABLE IF EXISTS `orders`;

CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `status` enum('pending','processing','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `address` text COLLATE utf8mb4_unicode_ci,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `coupon_code` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discount_amount` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `orders` */

insert  into `orders`(`id`,`user_id`,`total_amount`,`status`,`address`,`phone`,`created_at`,`coupon_code`,`discount_amount`) values 
(3,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123421','2026-03-27 21:47:53',NULL,0.00,'paid'),
(4,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123123','2026-03-27 21:53:47',NULL,0.00,'paid'),
(5,'thanh_toan','hinh thuc thanh toan,thanh toan bang gi,co cod khong,tra tien mat duoc khong,phuong thuc thanh toan,payment method,tra tien kieu gi','LMN hien chi ho tro COD - thanh toan tien mat khi nhan hang.','2026-04-05 15:25:06'),
(6,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Na123m','123','2026-03-27 21:55:17',NULL,0.00,'paid'),
(7,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12123','2026-03-27 21:57:11',NULL,0.00,'paid'),
(8,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123123','2026-03-27 21:58:00',NULL,0.00,'paid'),
(9,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312weq','2026-03-27 21:59:32',NULL,0.00,'paid'),
(10,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312314','2026-03-27 22:02:15',NULL,0.00,'paid'),
(11,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123qwe1231','2026-03-27 22:04:00',NULL,0.00,'paid'),
(12,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123qwe1231','2026-03-27 22:04:27',NULL,0.00,'paid'),
(13,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123123','2026-03-27 22:05:41',NULL,0.00,'paid'),
(14,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312','2026-03-27 22:07:10',NULL,0.00,'paid'),
(15,'mua_hang','mua hang nhu the nao,cach dat hang,cach mua,dat hang o dau,lam sao de mua,order nhu nao,quy trinh mua hang','Cach mua hang tai LMN Fashion:\n\n1. Chon san pham\n2. Them vao gio va chon so luong\n3. Kiem tra gio hang\n4. Nhap dia chi, SDT va ma giam gia neu co\n5. Chon thanh toan COD\n6. Xac nhan don hang','2026-04-05 15:25:06'),
(16,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','1231231','2026-03-27 22:08:25',NULL,0.00,'paid'),
(17,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123234','2026-03-27 22:10:43',NULL,0.00,'paid'),
(18,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123234','2026-03-27 22:11:58',NULL,0.00,'paid'),
(19,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123124','2026-03-27 22:13:29',NULL,0.00,'paid'),
(20,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123124','2026-03-27 22:14:53',NULL,0.00,'paid'),
(21,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','1231412','2026-03-27 22:16:01',NULL,0.00,'paid'),
(22,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','1231412','2026-03-27 22:18:55',NULL,0.00,'paid'),
(23,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123124','2026-03-27 22:19:16',NULL,0.00,'pending'),
(24,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','1234123123','2026-03-27 22:19:43',NULL,0.00,'paid'),
(25,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','1234123123','2026-03-27 22:19:43',NULL,0.00,'paid'),
(26,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312412','2026-03-27 22:21:54',NULL,0.00,'pending'),
(27,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312123','2026-03-27 22:22:14',NULL,0.00,'paid'),
(28,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡123t Nam','12312321321weqw','2026-03-27 22:32:13',NULL,0.00,'paid'),
(29,1,1000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','21312421312','2026-03-27 22:33:43',NULL,0.00,'pending'),
(30,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','21312321','2026-03-27 22:33:57',NULL,0.00,'pending'),
(31,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','21312','2026-03-27 22:34:14',NULL,0.00,'paid'),
(32,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','21312','2026-03-27 22:36:09',NULL,0.00,'paid'),
(33,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123546','2026-03-27 22:49:37',NULL,0.00,'paid'),
(34,1,2500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312312','2026-03-27 22:53:22',NULL,0.00,'paid'),
(35,1,3000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','022','2026-03-27 22:58:21',NULL,0.00,'paid'),
(36,1,3000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','15548','2026-03-27 23:00:42',NULL,0.00,'pending'),
(37,1,2500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','1654','2026-03-27 23:01:18',NULL,0.00,'pending'),
(38,1,2500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312','2026-03-27 23:03:55',NULL,0.00,'pending'),
(39,1,5500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123124123','2026-03-27 23:04:18',NULL,0.00,'pending'),
(40,1,7000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12312412','2026-03-27 23:07:36',NULL,0.00,'pending'),
(41,1,8500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12314','2026-03-27 23:08:17',NULL,0.00,'pending'),
(42,1,6000000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','124444','2026-03-27 23:14:38',NULL,0.00,'pending'),
(43,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','12314','2026-03-27 23:19:12',NULL,0.00,'pending'),
(44,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','111','2026-03-27 23:21:03',NULL,0.00,'pending'),
(45,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','11','2026-03-27 23:22:30',NULL,0.00,'pending'),
(46,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123','2026-03-27 23:29:06',NULL,0.00,'pending'),
(47,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','q','2026-03-27 23:29:26',NULL,0.00,'pending'),
(48,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','2','2026-03-27 23:30:17',NULL,0.00,'pending'),
(49,1,500000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','1','2026-03-27 23:32:06',NULL,0.00,'pending'),
(50,4,1500000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','12312qwe232','2026-04-02 20:13:13',NULL,0.00,'pending'),
(53,4,2000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','23423412312','2026-04-02 20:31:56',NULL,0.00,'pending'),
(55,4,2000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam345','23423523423','2026-04-02 20:41:20',NULL,0.00,'pending'),
(56,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','23423523423','2026-04-02 20:45:28',NULL,0.00,'pending'),
(57,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','1111111111111','2026-04-02 20:50:12',NULL,0.00,'paid'),
(59,5,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','11111','2026-04-10 14:34:47',NULL,0.00,'paid'),
(60,4,2000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','11111','2026-04-12 20:10:55',NULL,0.00,'pending'),
(62,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','123141','2026-04-12 20:19:41',NULL,0.00,'paid'),
(63,4,2000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123141','2026-04-12 20:22:01',NULL,0.00,'pending'),
(64,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','123123','2026-04-12 20:23:56',NULL,0.00,'paid'),
(65,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','12312321','2026-04-12 20:28:47',NULL,0.00,'paid'),
(66,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','123124123','2026-04-12 20:34:13',NULL,0.00,'paid'),
(67,4,2000.00,'pending','HÃ  Ná»™i, Viá»‡t Nam','123','2026-04-12 20:36:04',NULL,0.00,'pending'),
(68,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','1231241231231','2026-04-12 20:36:41',NULL,0.00,'paid'),
(69,4,2000.00,'processing','HÃ  Ná»™i, Viá»‡t Nam','12321412','2026-04-12 20:41:22',NULL,0.00,'paid');

/*Table structure for table `otps` */

DROP TABLE IF EXISTS `otps`;

CREATE TABLE `otps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `otp` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `otps` */

insert  into `otps`(`id`,`email`,`otp`,`expires_at`,`created_at`) values 
(3,'nguyenxuanloc2005@gmail.com','731522','2026-04-10 14:36:16','2026-04-10 14:31:15');

/*Table structure for table `products` */

DROP TABLE IF EXISTS `products`;

CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `price` decimal(10,2) NOT NULL,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `stock_quantity` int DEFAULT '100',
  `sizes` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'S,M,L,XL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `products` */

insert  into `products`(`id`,`name`,`description`,`price`,`image_url`,`category_id`,`stock_quantity`,`sizes`,`created_at`) values 
(1,'Ão hoodie cÃ³ khÃ³a mÃ u xÃ¡m','Sáº£n pháº©m Ão hoodie cÃ³ khÃ³a mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-hoodie-co-khoa-mau-xam-png.png',1,19,'S,M,L,XL','2026-03-27 21:41:10'),
(2,'Ão hoodie mÃ u Ä‘en','Sáº£n pháº©m Ão hoodie mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-hoodie-mau-en-png.png',1,71,'S,M,L,XL','2026-03-27 21:41:10'),
(3,'Ão khoÃ¡c mÃ u Ä‘en','Sáº£n pháº©m Ão khoÃ¡c mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-khoac-mau-en-png.png',3,99,'S,M,L,XL','2026-03-27 21:41:10'),
(4,'Ão khoÃ¡c ná»‰ mÃ u Ä‘en','Sáº£n pháº©m Ão khoÃ¡c ná»‰ mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-khoac-ni-mau-en-png.png',3,99,'S,M,L,XL','2026-03-27 21:41:10'),
(5,'thanh_toan','hinh thuc thanh toan,thanh toan bang gi,co cod khong,tra tien mat duoc khong,phuong thuc thanh toan,payment method,tra tien kieu gi','LMN hien chi ho tro COD - thanh toan tien mat khi nhan hang.','2026-04-05 15:25:06'),
(6,'Ão phÃ´ng mÃ u nÃ¢u','Sáº£n pháº©m Ão phÃ´ng mÃ u nÃ¢u cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-phong-mau-nau-png.png',1,96,'S,M,L,XL','2026-03-27 21:41:10'),
(7,'Ão polo dÃ i tay mÃ u há»“ng','Sáº£n pháº©m Ão polo dÃ i tay mÃ u há»“ng cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-polo-dai-tay-mau-hong-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(8,'Ão polo dÃ i tay mÃ u xÃ¡m','Sáº£n pháº©m Ão polo dÃ i tay mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-polo-dai-tay-mau-xam-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(9,'Ão polo in hÃ¬nh mÃ u Ä‘en','Sáº£n pháº©m Ão polo in hÃ¬nh mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-polo-in-hinh-mau-en-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(10,'Ão polo mÃ u Ä‘en','Sáº£n pháº©m Ão polo mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-polo-mau-en-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(11,'Ão polo mÃ u tráº¯ng','Sáº£n pháº©m Ão polo mÃ u tráº¯ng cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-polo-mau-trang-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(12,'Ão polo mÃ u xÃ¡m','Sáº£n pháº©m Ão polo mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-polo-mau-xam-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(13,'Ão polo mÃ u xanh','Sáº£n pháº©m Ão polo mÃ u xanh cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-polo-mau-xanh-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(14,'Ão sÆ¡ mi dÃ i tay mÃ u be','Sáº£n pháº©m Ão sÆ¡ mi dÃ i tay mÃ u be cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-dai-tay-mau-be-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(15,'mua_hang','mua hang nhu the nao,cach dat hang,cach mua,dat hang o dau,lam sao de mua,order nhu nao,quy trinh mua hang','Cach mua hang tai LMN Fashion:\n\n1. Chon san pham\n2. Them vao gio va chon so luong\n3. Kiem tra gio hang\n4. Nhap dia chi, SDT va ma giam gia neu co\n5. Chon thanh toan COD\n6. Xac nhan don hang','2026-04-05 15:25:06'),
(16,'Ão sÆ¡ mi dÃ i tay mÃ u xanh','Sáº£n pháº©m Ão sÆ¡ mi dÃ i tay mÃ u xanh cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-dai-tay-mau-xanh-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(17,'Ão sÆ¡ mi káº» sá»c mÃ u xÃ¡m','Sáº£n pháº©m Ão sÆ¡ mi káº» sá»c mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-ke-soc-mau-xam-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(18,'Ão sÆ¡ mi mÃ u be','Sáº£n pháº©m Ão sÆ¡ mi mÃ u be cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-mau-be-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(19,'Ão sÆ¡ mi mÃ u Ä‘en','Sáº£n pháº©m Ão sÆ¡ mi mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-mau-en-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(20,'Ão sÆ¡ mi mÃ u Ä‘á» rÆ°á»£u','Sáº£n pháº©m Ão sÆ¡ mi mÃ u Ä‘á» rÆ°á»£u cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-mau-o-ruou-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(21,'Ão sÆ¡ mi mÃ u tráº¯ng','Sáº£n pháº©m Ão sÆ¡ mi mÃ u tráº¯ng cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-mau-trang-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(22,'Ão sÆ¡ mi mÃ u xanh','Sáº£n pháº©m Ão sÆ¡ mi mÃ u xanh cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-so-mi-mau-xanh-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(23,'Ão thun dÃ¡ng há»™p mÃ u Ä‘en','Sáº£n pháº©m Ão thun dÃ¡ng há»™p mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-thun-dang-hop-mau-t-en-png.png',1,97,'S,M,L,XL','2026-03-27 21:41:10'),
(24,'Ão thun dÃ¡ng há»™p mÃ u tráº¯ng','Sáº£n pháº©m Ão thun dÃ¡ng há»™p mÃ u tráº¯ng cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-thun-dang-hop-mau-trang-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(25,'Ão thun in hÃ¬nh mÃ u Ä‘en','Sáº£n pháº©m Ão thun in hÃ¬nh mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-thun-in-hinh-mau-en-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(26,'Ão thun in hÃ¬nh mÃ u xanh','Sáº£n pháº©m Ão thun in hÃ¬nh mÃ u xanh cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-thun-in-hinh-mau-xanh-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(27,'Ão thun káº» sá»c mÃ u Ä‘en','Sáº£n pháº©m Ão thun káº» sá»c mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-thun-ke-soc-mau-en-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(28,'Ão thun mÃ u Ä‘á»','Sáº£n pháº©m Ão thun mÃ u Ä‘á» cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/ao-thun-mau-o-png.png',1,100,'S,M,L,XL','2026-03-27 21:41:10'),
(29,'GiÃ y thá»ƒ thao mÃ u Ä‘en','Sáº£n pháº©m GiÃ y thá»ƒ thao mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/giay-the-thao-mau-en-png.png',4,97,'36,37,38,39,40','2026-03-27 21:41:10'),
(30,'KhÄƒn choÃ ng cá»• mÃ u Ä‘en','Sáº£n pháº©m KhÄƒn choÃ ng cá»• mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/khan-choang-co-mau-en-png.png',4,97,'S,M,L,XL','2026-03-27 21:41:10'),
(31,'MÅ© cÃ³i mÃ u be','Sáº£n pháº©m MÅ© cÃ³i mÃ u be cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/mu-coi-mau-be-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10'),
(32,'MÅ© Ä‘eo chÃ©o mÃ u Ä‘á»','Sáº£n pháº©m MÅ© Ä‘eo chÃ©o mÃ u Ä‘á» cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/mu-eo-cheo-mau-o-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10'),
(33,'MÅ© len mÃ u Ä‘en','Sáº£n pháº©m MÅ© len mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/mu-len-mau-en-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10'),
(34,'MÅ© len mÃ u xÃ¡m','Sáº£n pháº©m MÅ© len mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/mu-len-mau-xam-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10'),
(35,'MÅ© lÆ°á»¡i trai mÃ u xanh dÆ°Æ¡ng','Sáº£n pháº©m MÅ© lÆ°á»¡i trai mÃ u xanh dÆ°Æ¡ng cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/mu-luoi-trai-mau-xanh-am-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10'),
(36,'Quáº§n dÃ i káº» sá»c mÃ u tráº¯ng','Sáº£n pháº©m Quáº§n dÃ i káº» sá»c mÃ u tráº¯ng cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-dai-ke-soc-mau-trang-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(37,'Quáº§n jean mÃ u Ä‘en','Sáº£n pháº©m Quáº§n jean mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-jean-mau-en-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(38,'Quáº§n jean mÃ u xÃ¡m','Sáº£n pháº©m Quáº§n jean mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-jean-mau-xam-png.png',2,99,'S,M,L,XL','2026-03-27 21:41:10'),
(39,'Quáº§n jogger mÃ u xÃ¡m','Sáº£n pháº©m Quáº§n jogger mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-jogger-mau-xam-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(40,'Quáº§n kaki dÃ i mÃ u be','Sáº£n pháº©m Quáº§n kaki dÃ i mÃ u be cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-kaki-dai-mau-be-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(41,'Quáº§n ná»‰ dÃ i mÃ u Ä‘en','Sáº£n pháº©m Quáº§n ná»‰ dÃ i mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-ni-dai-mau-en-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(42,'Quáº§n short jean mÃ u Ä‘en','Sáº£n pháº©m Quáº§n short jean mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-short-jean-mau-en-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(43,'Quáº§n short jean mÃ u xanh','Sáº£n pháº©m Quáº§n short jean mÃ u xanh cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-short-jean-mau-xanh-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(44,'Quáº§n short mÃ u há»“ng','Sáº£n pháº©m Quáº§n short mÃ u há»“ng cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-short-mau-hong-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(45,'Quáº§n short mÃ u nÃ¢u','Sáº£n pháº©m Quáº§n short mÃ u nÃ¢u cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-short-mau-nau-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(46,'Quáº§n short mÃ u xÃ¡m','Sáº£n pháº©m Quáº§n short mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-short-mau-xam-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(47,'Quáº§n short mÃ u xanh','Sáº£n pháº©m Quáº§n short mÃ u xanh cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-short-mau-xanh-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(48,'Quáº§n short ná»‰ mÃ u xÃ¡m','Sáº£n pháº©m Quáº§n short ná»‰ mÃ u xÃ¡m cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-short-ni-mau-xam-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(49,'Quáº§n thun dÃ i mÃ u Ä‘en','Sáº£n pháº©m Quáº§n thun dÃ i mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-thun-dai-mau-en-png.png',2,100,'S,M,L,XL','2026-03-27 21:41:10'),
(50,'Quáº§n tÃºi há»™p mÃ u Ä‘en','Sáº£n pháº©m Quáº§n tÃºi há»™p mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-tui-hop-mau-en-png.png',2,99,'S,M,L,XL','2026-03-27 21:41:10'),
(51,'Quáº§n tÃºi há»™p mÃ u nÃ¢u','Sáº£n pháº©m Quáº§n tÃºi há»™p mÃ u nÃ¢u cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/quan-tui-hop-mau-nau-png.png',2,99,'S,M,L,XL','2026-03-27 21:41:10'),
(52,'Tháº¯t lÆ°ng váº£i mÃ u Ä‘en','Sáº£n pháº©m Tháº¯t lÆ°ng váº£i mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/that-lung-vai-mau-en-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10'),
(53,'TÃºi dÃ¹ Ä‘eo chÃ©o mÃ u Ä‘en','Sáº£n pháº©m TÃºi dÃ¹ Ä‘eo chÃ©o mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/tui-du-eo-cheo-mau-en-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10'),
(54,'TÃºi Ä‘eo chÃ©o mÃ u Ä‘en','Sáº£n pháº©m TÃºi Ä‘eo chÃ©o mÃ u Ä‘en cháº¥t lÆ°á»£ng cao, thiáº¿t káº¿ hiá»‡n Ä‘áº¡i.',2000.00,'img/tui-eo-cheo-mau-en-png.png',4,100,'S,M,L,XL','2026-03-27 21:41:10');

/*Table structure for table `reviews` */

DROP TABLE IF EXISTS `reviews`;

CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product_review` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `reviews` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci,
  `role` enum('admin','customer') COLLATE utf8mb4_unicode_ci DEFAULT 'customer',
  `status` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'inactive',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`user_name`,`email`,`password`,`full_name`,`phone`,`address`,`role`,`status`,`created_at`) values 
(1,'nguyenloc','nxl522005@gmail.com','password','','',NULL,'admin','active','2026-03-26 22:40:38'),
(2,'admin','admin@lmn.local','admin123','System Admin','0900000000','Ha Noi, Viet Nam','admin','active','2026-03-27 10:49:03'),
(4,'user','tlh2k5@gmail.com','password','user','','HÃ  Ná»™i','customer','active','2026-04-02 20:06:07'),
(5,'thanh_toan','hinh thuc thanh toan,thanh toan bang gi,co cod khong,tra tien mat duoc khong,phuong thuc thanh toan,payment method,tra tien kieu gi','LMN hien chi ho tro COD - thanh toan tien mat khi nhan hang.','2026-04-05 15:25:06'),

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

