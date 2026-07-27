CREATE TABLE `estimate_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`location` varchar(50) NOT NULL,
	`building` varchar(50) NOT NULL,
	`timeSlot` varchar(20) NOT NULL,
	`priceLow` int NOT NULL,
	`priceHigh` int NOT NULL,
	`sourcePage` varchar(200),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `estimate_leads_id` PRIMARY KEY(`id`)
);
