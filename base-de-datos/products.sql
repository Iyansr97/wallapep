SET NAMES utf8mb4;
DROP DATABASE IF EXISTS products;
CREATE DATABASE products CHARACTER SET latin1;
USE products;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE `users` (
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `documentIdentity` varchar(50) DEFAULT NULL,
  `documentNumber` varchar(50) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL,
  `postalCode` varchar(50) DEFAULT NULL,
  `birthday` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `documentIdentity`, `documentNumber`, `country`, `address`, `postalCode`, `birthday`) VALUES ('iyan@iyan.iyan', '70f32b0989903de63dde4ea96d5d4000', 1, 'Iyan', 'Sánchez Rodríguez', 'DNI', '71234567W', 'España', 'Calle Uría 12, 3ºB', '33003', 863568000000);
INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `documentIdentity`, `documentNumber`, `country`, `address`, `postalCode`, `birthday`) VALUES ('lucia.fernandez@example.com', '81dc9bdb52d04dc20036dbd8313ed055', 2, 'Lucía', 'Fernández', 'DNI', '10987654W', 'España', 'Gran Vía 45, 2ºA', '28013', 657504000000);
INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `documentIdentity`, `documentNumber`, `country`, `address`, `postalCode`, `birthday`) VALUES ('carlos.martinez@example.com', '81dc9bdb52d04dc20036dbd8313ed055', 3, 'Carlos', 'Martínez', 'NIE', 'X1234567L', 'España', 'Avenida de la Constitución 8', '41001', 480211200000);
INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `documentIdentity`, `documentNumber`, `country`, `address`, `postalCode`, `birthday`) VALUES ('mariajose.garciadelafuente@example.com', '81dc9bdb52d04dc20036dbd8313ed055', 4, 'María José Inmaculada de los Ángeles', 'García de la Fuente y Álvarez-Castellanos', 'Passport', 'AAB123456', 'Argentina', 'Avenida del Libertador General San Martín 1234', '1425', 273283200000);
INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `documentIdentity`, `documentNumber`, `country`, `address`, `postalCode`, `birthday`) VALUES ('pablo.menendez@example.com', '81dc9bdb52d04dc20036dbd8313ed055', 5, 'Pablo', 'Menéndez', 'DNI', '53124876M', 'España', 'Calle Corrida 21, 1ºC', '33206', 729388800000);
INSERT INTO `users` (`email`, `password`, `id`, `name`, `surname`, `documentIdentity`, `documentNumber`, `country`, `address`, `postalCode`, `birthday`) VALUES ('ana.lopez@example.com', '81dc9bdb52d04dc20036dbd8313ed055', 6, 'Ana', 'López', 'Passport', 'CB482193', 'Portugal', 'Rua Augusta 100', '1100', 932860800000);

CREATE TABLE `creditcards` (
  `userId` bigint(20) DEFAULT NULL,
  `number` varchar(50) DEFAULT NULL,
  `expirationDate` bigint(20) DEFAULT NULL,
  `code` int(11) DEFAULT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `FK_creditcarts_users` (`userId`),
  CONSTRAINT `FK_creditcarts_users` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (1, '4111111111111111', 1859241600000, 123, 'Visa personal', 1);
INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (1, '5500000000000004', 1811808000000, 456, 'Mastercard trabajo', 2);
INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (1, '340000000000009', 1867017600000, 7890, 'Tarjeta compartida para los gastos del piso', 3);
INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (2, '4000056655665556', 1830297600000, 321, 'Visa Lucía', 4);
INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (3, '5105105105105100', 1819756800000, 654, 'Mastercard', 5);
INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (4, '4012888888881881', 1896134400000, 987, 'Tarjeta del banco con un alias bastante largo', 6);
INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (5, '4222222222222', 1890777600000, 111, 'Visa Pablo', 7);
INSERT INTO `creditcards` (`userId`, `number`, `expirationDate`, `code`, `alias`, `id`) VALUES (6, '4000000000000002', 1877558400000, 222, 'Visa', 8);

CREATE TABLE `products` (
  `title` varchar(50) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `date` bigint(20) NOT NULL DEFAULT 0,
  `description` longtext DEFAULT NULL,
  `buyerId` bigint(20) DEFAULT NULL,
  `sellerId` bigint(20) DEFAULT NULL,
  `price` float DEFAULT NULL,
  `category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `buyer` (`buyerId`),
  KEY `seller` (`sellerId`),
  CONSTRAINT `buyer` FOREIGN KEY (`buyerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `seller` FOREIGN KEY (`sellerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Smart TV Samsung 55\" 4K UHD HDR10+ con soporte', 1, 1793635977361, 'Vendo televisor Samsung de 55 pulgadas con resolución 4K UHD, comprado hace dos años y en perfecto estado. Incluye el mando original, el soporte de pared y el cable de alimentación.\n\nCaracterísticas principales: HDR10+, tres puertos HDMI (uno de ellos eARC), dos puertos USB, Wi-Fi y Bluetooth, sistema Smart TV con todas las aplicaciones habituales (Netflix, YouTube, Prime Video, Disney+, Movistar+). El panel no tiene ningún píxel muerto ni golpes, y la imagen se ve perfecta incluso con mucha luz.\n\nLo vendo porque me he mudado a un piso más pequeño y no me cabe en el salón. Preferiblemente entrega en mano en Oviedo o Gijón, pero también puedo enviarlo bien embalado con la caja original (el envío corre a cargo del comprador). No hago cambios. Si tienes cualquier duda pregúntame antes de comprar y te respondo lo antes posible.', NULL, 2, 399.99, 'electronica');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('PlayStation 5', 2, 1793808777361, 'Con un mando y dos juegos. Poco uso.', NULL, 3, 380, 'consola');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Nintendo Switch OLED edición Zelda + 3 juegos', 3, 1793463177361, 'Con caja y cargador original. Incluye Zelda: Tears of the Kingdom, Mario Kart 8 y Animal Crossing.', NULL, 1, 290, 'consola');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('iPhone 13 128GB', 4, 1793898777361, 'Buen estado, batería al 89%. Incluye funda.', NULL, 4, 420, 'movil');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Xiaomi Redmi Note 12', 5, 1792858377361, '128 GB, libre de operador. Se entrega en su caja con cargador y funda.', NULL, 5, 150, 'movil');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Samsung Galaxy S21 Ultra 256GB Phantom Black', 6, 1792167177361, 'Libre de operador.\nPantalla sin rayas, con protector puesto desde el primer día.\nSe entrega con cargador rápido.', NULL, 2, 480, 'movil');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Portátil Lenovo ThinkPad T14 i5 16GB RAM 512GB', 7, 1793722377361, 'Ideal para trabajar o estudiar. Teclado en español, batería en buen estado (unas 6 horas de uso real).', NULL, 1, 450, 'electronica');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Auriculares Sony WH-1000XM4', 8, 1791303177361, 'Cancelación de ruido, con estuche.', NULL, 3, 160, 'electronica');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Cable USB-C', 9, 1790007177361, 'Cable de carga y datos de 1 metro, sin usar.', NULL, 5, 3.5, 'electronica');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Sofá 3 plazas', 10, 1793203977361, 'Tapizado azul claro, estilo clásico. Recogida en mano.', NULL, 4, 150, 'hogar');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Lámpara de pie de diseño nórdico con luz regulable', 11, 1792599177361, 'Luz cálida regulable, altura 160 cm.', NULL, 1, 35, 'hogar');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Monstera deliciosa', 12, 1793376777361, 'Planta de interior sana y con hojas grandes. Se entrega con su maceta blanca.', NULL, 2, 25, 'hogar');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Mesa de escritorio blanca 120x60', 13, 1793905257361, 'Desmontable, se entrega con todos los tornillos.', NULL, 6, 55, 'hogar');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Bicicleta eléctrica plegable urbana 250W 36V', 14, 1793549577361, 'Vendo bicicleta eléctrica plegable, comprado hace dos años y en perfecto estado. Incluye el mando original, el soporte de pared y el cable de alimentación.\n\nCaracterísticas principales: HDR10+, tres puertos HDMI (uno de ellos eARC), dos puertos USB, Wi-Fi y Bluetooth, sistema Smart TV con todas las aplicaciones habituales (Netflix, YouTube, Prime Video, Disney+, Movistar+). El panel no tiene ningún píxel muerto ni golpes, y la imagen se ve perfecta incluso con mucha luz.\n\nLo vendo porque me he mudado a un piso más pequeño y no me cabe en el salón. Preferiblemente entrega en mano en Oviedo o Gijón, pero también puedo enviarlo bien embalado con la caja original (el envío corre a cargo del comprador). No hago cambios. Si tienes cualquier duda pregúntame antes de comprar y te respondo lo antes posible.', NULL, 3, 890, 'deporte');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Raqueta de pádel Bullpadel', 15, 1791735177361, 'Usada una temporada.', NULL, 4, 60, 'deporte');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Zapatillas running', 16, 1790439177361, 'Talla 43.', NULL, 1, 45, 'deporte');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Juego de mancuernas de 2 a 24 kg', 17, 1793117577361, 'Juego completo con soporte. Recogida en mano por el peso.', NULL, 5, 120, 'deporte');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Chaqueta vaquera', 18, 1792944777361, 'Talla L, casi nueva.', NULL, 2, 30, 'ropa');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Abrigo largo de lana con capucha, talla M', 19, 1793722377361, 'Color rojo, muy calentito. Solo lo he usado un invierno.', NULL, 6, 75, 'ropa');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Vestido', 20, 1788711177361, 'Vestido blanco de verano, talla S. Puesto solo una vez.', NULL, 4, 12, 'ropa');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Harry Potter colección completa (7 libros)', 21, 1793290377361, 'Los 7 libros en tapa blanda, edición en español. Algunos tienen el lomo un poco gastado.', NULL, 3, 45, 'libros');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('El Quijote edición ilustrada', 22, 1792685577361, 'Tapa dura, como nuevo.', NULL, 2, 22, 'libros');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Lote de libros de programación', 23, 1793808777361, 'Lote de libros de C, Python y Perl en buen estado.', NULL, 1, 18, 'libros');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Moto Yamaha MT-07 del 2019 con 15.000 km', 24, 1792339977361, 'Revisiones al día en concesionario oficial. Neumáticos nuevos. ITV pasada.', NULL, 3, 5990, 'deporte');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Mando Xbox Series', 25, 1791303177361, 'Mando inalámbrico original, poco uso.', 2, 1, 35, 'consola');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Teclado mecánico retroiluminado switches rojos', 26, 1789575177361, 'Teclado completo con retroiluminación RGB y distribución española.', 3, 1, 70, 'electronica');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Cafetera italiana', 27, 1790439177361, '6 tazas.', 1, 2, 20, 'hogar');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Mochila Fjällräven Kånken edición limitada roja', 28, 1790871177361, 'Vendo mochila Fjällräven, comprado hace dos años y en perfecto estado. Incluye el mando original, el soporte de pared y el cable de alimentación.\n\nCaracterísticas principales: HDR10+, tres puertos HDMI (uno de ellos eARC), dos puertos USB, Wi-Fi y Bluetooth, sistema Smart TV con todas las aplicaciones habituales (Netflix, YouTube, Prime Video, Disney+, Movistar+). El panel no tiene ningún píxel muerto ni golpes, y la imagen se ve perfecta incluso con mucha luz.\n\nLo vendo porque me he mudado a un piso más pequeño y no me cabe en el salón. Preferiblemente entrega en mano en Oviedo o Gijón, pero también puedo enviarlo bien embalado con la caja original (el envío corre a cargo del comprador). No hago cambios. Si tienes cualquier duda pregúntame antes de comprar y te respondo lo antes posible.', 1, 4, 55, 'ropa');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Tablet', 29, 1792599177361, 'Tablet de 12 pulgadas con teclado y lápiz incluidos.', 1, 3, 90, 'electronica');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Sapiens: De animales a dioses', 30, 1787847177361, 'Yuval Noah Harari.', 1, 5, 12, 'libros');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Altavoz Bluetooth JBL Flip 6', 31, 1791994377361, 'Resistente al agua, unas 12 horas de batería. Incluye cable de carga.', 5, 2, 85, 'electronica');
INSERT INTO `products` (`title`, `id`, `date`, `description`, `buyerId`, `sellerId`, `price`, `category`) VALUES ('Silla de oficina ergonómica', 32, 1790007177361, 'Regulable en altura.', 4, 3, 95, 'hogar');

CREATE TABLE `transactions` (
  `buyerId` bigint(20) DEFAULT NULL,
  `sellerId` bigint(20) DEFAULT NULL,
  `buyerCountry` varchar(50) DEFAULT NULL,
  `buyerAddress` varchar(50) DEFAULT NULL,
  `buyerPostCode` int(11) DEFAULT NULL,
  `productId` bigint(20) DEFAULT NULL,
  `productPrice` int(11) DEFAULT NULL,
  `buyerPaymentId` bigint(20) DEFAULT NULL,
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `startDate` bigint(20) DEFAULT NULL,
  `endDate` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_transactions_users_2` (`sellerId`),
  KEY `FK_transactions_products` (`productId`),
  KEY `FK_transactions_users` (`buyerId`),
  KEY `FK_transactions_creditcards` (`buyerPaymentId`),
  CONSTRAINT `FK_transactions_products` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_transactions_users` FOREIGN KEY (`buyerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_transactions_users_2` FOREIGN KEY (`sellerId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (2, 1, 'España', 'Gran Vía 45, 2ºA', 28013, 25, 35, 4, 1, 1792177977361, 1792350777361);
INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (3, 1, 'España', 'Avenida de la Constitución 8', 41001, 26, 70, 5, 2, 1790881977361, 1791054777361);
INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (1, 2, 'España', 'Calle Uría 12, 3ºB', 33003, 27, 20, 1, 3, 1791745977361, 1791918777361);
INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (1, 4, 'España', 'Calle Uría 12, 3ºB', 33003, 28, 55, 1, 4, 1793041977361, 1793214777361);
INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (1, 3, 'España', 'Calle Uría 12, 3ºB', 33003, 29, 90, 1, 5, 1793646777361, 1793819577361);
INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (1, 5, 'España', 'Calle Uría 12, 3ºB', 33003, 30, 12, 1, 6, 1793897337361, NULL);
INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (5, 2, 'España', 'Calle Corrida 21, 1ºC', 33206, 31, 85, 7, 7, 1792869177361, 1793041977361);
INSERT INTO `transactions` (`buyerId`, `sellerId`, `buyerCountry`, `buyerAddress`, `buyerPostCode`, `productId`, `productPrice`, `buyerPaymentId`, `id`, `startDate`, `endDate`) VALUES (4, 3, 'Argentina', 'Avenida del Libertador General San Martín 1234', 1425, 32, 95, 6, 8, 1791313977361, 1791486777361);

SET FOREIGN_KEY_CHECKS = 1;
