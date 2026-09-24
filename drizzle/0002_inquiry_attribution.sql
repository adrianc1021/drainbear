ALTER TABLE `inquiries`
  ADD COLUMN `landingPage` varchar(500) NULL,
  ADD COLUMN `gclid` varchar(300) NULL,
  ADD COLUMN `clickIdType` varchar(20) NULL,
  ADD COLUMN `sourceIp` varchar(45) NULL,
  ADD COLUMN `userAgent` varchar(500) NULL;
