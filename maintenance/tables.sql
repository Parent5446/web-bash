SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `webbash` ;
CREATE SCHEMA IF NOT EXISTS `webbash` ;
SHOW WARNINGS;
USE `webbash` ;

-- -----------------------------------------------------
-- Table `webbash`.`grp`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `webbash`.`grp` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `name` CHAR(255) NOT NULL ,
  PRIMARY KEY (`id`) );

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `webbash`.`file`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `webbash`.`file` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `parent` INT UNSIGNED NULL DEFAULT NULL ,
  `name` VARCHAR(255) NOT NULL ,
  `size` BIGINT UNSIGNED NULL DEFAULT NULL ,
  `filetype` ENUM('f', 'l', 'd') NOT NULL DEFAULT 'f' ,
  `linkid` INT UNSIGNED NULL DEFAULT NULL ,
  `linkpath` TINYBLOB NULL DEFAULT NULL ,
  `owner` INT UNSIGNED NULL DEFAULT 1 ,
  `grp` INT UNSIGNED NULL DEFAULT 1 ,
  `perms` INT UNSIGNED NOT NULL DEFAULT 420 ,
  `atime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP ,
  `mtime` TIMESTAMP NULL DEFAULT NULL ,
  `ctime` TIMESTAMP NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX (`parent` ASC, `name` ASC) ,
  INDEX `fk_{9F1F35CD-4DDA-4E6C-80FA-B83CDC90E6C0}` (`linkid` ASC) ,
  INDEX `fk_{DACF5BC1-9661-4466-AD1E-8E6FBE6295A7}` (`owner` ASC) ,
  INDEX `fk_{2244B300-3D46-4427-AEEF-5966C286EB53}` (`grp` ASC) ,
  CONSTRAINT `fk_{4BDD89F6-FDB9-4052-B7DF-86571175427D}`
    FOREIGN KEY (`parent` )
    REFERENCES `webbash`.`file` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_{9F1F35CD-4DDA-4E6C-80FA-B83CDC90E6C0}`
    FOREIGN KEY (`linkid` )
    REFERENCES `webbash`.`file` (`id` )
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_{DACF5BC1-9661-4466-AD1E-8E6FBE6295A7}`
    FOREIGN KEY (`owner` )
    REFERENCES `webbash`.`user` (`id` )
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_{2244B300-3D46-4427-AEEF-5966C286EB53}`
    FOREIGN KEY (`grp` )
    REFERENCES `webbash`.`grp` (`id` )
    ON DELETE SET NULL
    ON UPDATE CASCADE);

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `webbash`.`user`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `webbash`.`user` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(255) NOT NULL ,
  `homedir` INT UNSIGNED NULL DEFAULT NULL ,
  `email` VARCHAR(255) NULL DEFAULT NULL ,
  `email_confirmed` TINYINT(1) NOT NULL DEFAULT false ,
  `password` TINYBLOB NOT NULL ,
  `token` BINARY(64) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`) ,
  UNIQUE INDEX (`name` ASC) ,
  INDEX `fk_{9DA069A3-7877-4059-9220-60F576066E59}` (`homedir` ASC) ,
  CONSTRAINT `fk_{9DA069A3-7877-4059-9220-60F576066E59}`
    FOREIGN KEY (`homedir` )
    REFERENCES `webbash`.`file` (`id` )
    ON DELETE SET NULL
    ON UPDATE CASCADE);

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `webbash`.`usergroup`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `webbash`.`usergroup` (
  `user` INT UNSIGNED NOT NULL ,
  `grp` INT UNSIGNED NOT NULL ,
  PRIMARY KEY (`user`, `grp`) ,
  UNIQUE INDEX (`grp` ASC, `user` ASC) ,
  CONSTRAINT `fk_{004B5D27-237C-4E14-9478-8FDCF7B21CA4}`
    FOREIGN KEY (`user` )
    REFERENCES `webbash`.`user` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_{AABB82EC-6823-4905-BF9E-42A99B1CD65B}`
    FOREIGN KEY (`grp` )
    REFERENCES `webbash`.`grp` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE);

SHOW WARNINGS;

-- -----------------------------------------------------
-- Table `webbash`.`history`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `webbash`.`history` (
  `user` INT UNSIGNED NOT NULL ,
  `id` INT UNSIGNED NOT NULL ,
  `command` TINYBLOB NULL DEFAULT NULL ,
  PRIMARY KEY (`user`, `id`) ,
  CONSTRAINT `fk_{40F32AD6-23D2-4F47-BB1A-8D87A23D7D20}`
    FOREIGN KEY (`user` )
    REFERENCES `webbash`.`user` (`id` )
    ON DELETE CASCADE
    ON UPDATE CASCADE);

SHOW WARNINGS;
USE `webbash` ;

DELIMITER $$
SHOW WARNINGS$$
USE `webbash`$$

CREATE TRIGGER `history_INCREMENT` BEFORE INSERT ON history FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	SET @newid = NULL;
	IF NEW.`id` = 0 THEN
		SELECT COALESCE(MAX(id) + 1, 1)
		INTO @newid FROM `history`
		WHERE `history`.`user` = NEW.`user`;

		SET NEW.`id` = @newid;
	END IF;
END
$$

SHOW WARNINGS$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `webbash`
-- -----------------------------------------------------
START TRANSACTION;
USE `webbash`;
INSERT INTO `webbash`.`file` (`parent`, `id`, `name`, `filetype`, `owner`, `grp`, `perms`, `atime`, `ctime`, `mtime`) VALUES (NULL, 1, 'root', 'd', NULL, NULL, 493, NOW(), NOW(), NOW());
INSERT INTO `webbash`.`file` (`parent`, `id`, `name`, `filetype`, `owner`, `grp`, `perms`, `atime`, `ctime`, `mtime`) VALUES (NULL, 2, 'etc', 'd', NULL, NULL, 493, NOW(), NOW(), NOW());
INSERT INTO `webbash`.`file` (`parent`, `id`, `name`, `filetype`, `owner`, `grp`, `perms`, `atime`, `ctime`, `mtime`) VALUES (NULL, 3, 'home', 'd', NULL, NULL, 493, NOW(), NOW(), NOW());
INSERT INTO `webbash`.`file` (`parent`, `id`, `name`, `filetype`, `owner`, `grp`, `perms`, `atime`, `ctime`, `mtime`) VALUES (2, 4, 'hostname', 'f', NULL, NULL, 420, NOW(), NOW(), NOW());
INSERT INTO `webbash`.`file` (`parent`, `id`, `name`, `filetype`, `owner`, `grp`, `perms`, `atime`, `ctime`, `mtime`) VALUES (1, 5, 'welcome', 'f', NULL, NULL, 420, NOW(), NOW(), NOW());
INSERT INTO `webbash`.`user` (`id`, `name`, `homedir`, `email`, `email_confirmed`, `password`, `token`) VALUES (1, 'root', 1, 'root@localhost', true, 0x243279243132243031323334353637383961626364656624242424242E734D71736A77696F344C6C484172772F78336C653569694943374E51685032, NULL);

INSERT INTO `webbash`.`grp` (`id`, `name`) VALUES (1, 'root');
INSERT INTO `webbash`.`grp` (`id`, `name`) VALUES (2, 'admin');

UPDATE `webbash`.`file` SET `owner` = 1, `grp` = 1;
INSERT INTO `webbash`.`usergroup` (`user`, `grp`) VALUES (1, 1);
INSERT INTO `webbash`.`usergroup` (`user`, `grp`) VALUES (1, 2);
COMMIT;
