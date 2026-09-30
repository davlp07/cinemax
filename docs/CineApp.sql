CREATE TABLE IF NOT EXISTS `user` (
	`id` varchar(24) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL UNIQUE,
	`password_hash` varchar(255),
	`role` enum NOT NULL,
	`created_at` datetime NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `account` (
	`id` varchar(24) NOT NULL,
	`user_id` varchar(24) NOT NULL,
	`provider` varchar(255) NOT NULL,
	`provider_account_id` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `cinema` (
	`id` varchar(24) NOT NULL,
	`name` varchar(255) NOT NULL,
	`cnpj` varchar(14) NOT NULL,
	`address` varchar(255) NOT NULL,
	`city` varchar(255) NOT NULL,
	`state` varchar(255) NOT NULL,
	`owner_id` varchar(24) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `room` (
	`id` varchar(24) NOT NULL,
	`cinema_id` varchar(24) NOT NULL,
	`name` varchar(255) NOT NULL,
	`rows_count` int NOT NULL,
	`seats_per_row` int NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `seat` (
	`id` varchar(24) NOT NULL,
	`room_id` varchar(24) NOT NULL,
	`row_letter` varchar(255) NOT NULL,
	`seat_number` int NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `movie` (
	`id` varchar(24) NOT NULL,
	`cinema_id` varchar(24) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(255) NOT NULL,
	`duration_minutes` int NOT NULL,
	`poster_url` varchar(255) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `session` (
	`id` varchar(24) NOT NULL,
	`movie_id` varchar(24) NOT NULL,
	`room_id` varchar(24) NOT NULL,
	`start_time` datetime NOT NULL,
	`base_pri` int NOT NULL,
	`base_price` decimal(10,0) NOT NULL,
	`refund_limit_hours` int NOT NULL,
	`cancellation` int NOT NULL,
	`cancellation_fee` decimal(10,0) NOT NULL,
	PRIMARY KEY (`id`)
);
CREATE TABLE IF NOT EXISTS `ticket` (
	`id` varchar(24) NOT NULL,
	`session_id` varchar(24) NOT NULL,
	`user_id` varchar(24) NOT NULL,
	`seat_id` varchar(24) NOT NULL,
	`status` enum NOT NULL,
	`purchase_price` decimal(10,0) NOT NULL,
	`purchased_at` datetime NOT NULL,
	PRIMARY KEY (`id`)
);
ALTER TABLE `account` ADD CONSTRAINT `account_fk1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);
ALTER TABLE `cinema` ADD CONSTRAINT `cinema_fk6` FOREIGN KEY (`owner_id`) REFERENCES `user`(`id`);
ALTER TABLE `room` ADD CONSTRAINT `room_fk1` FOREIGN KEY (`cinema_id`) REFERENCES `cinema`(`id`);
ALTER TABLE `seat` ADD CONSTRAINT `seat_fk1` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`);
ALTER TABLE `movie` ADD CONSTRAINT `movie_fk1` FOREIGN KEY (`cinema_id`) REFERENCES `cinema`(`id`);
ALTER TABLE `session` ADD CONSTRAINT `session_fk1` FOREIGN KEY (`movie_id`) REFERENCES `movie`(`id`);
ALTER TABLE `session` ADD CONSTRAINT `session_fk2` FOREIGN KEY (`room_id`) REFERENCES `room`(`id`);
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_fk1` FOREIGN KEY (`session_id`) REFERENCES `session`(`id`);
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_fk2` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`);
ALTER TABLE `ticket` ADD CONSTRAINT `ticket_fk3` FOREIGN KEY (`seat_id`) REFERENCES `seat`(`id`);