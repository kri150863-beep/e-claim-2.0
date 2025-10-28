<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250722111313 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE blacklisted_token (id INT AUTO_INCREMENT NOT NULL, token TEXT DEFAULT NULL, expires_at DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE account_informations DROP backup_email, CHANGE users_id users_id INT DEFAULT NULL, CHANGE password password VARCHAR(250) NOT NULL');
        $this->addSql('DROP INDEX fk_administrative_settings_users1_idx ON administrative_settings');
        $this->addSql('ALTER TABLE administrative_settings CHANGE users_id users_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE admin_settings_communications DROP FOREIGN KEY fk_admin_settings_communication_administrative_settings1');
        $this->addSql('ALTER TABLE admin_settings_communications DROP is_active');
        $this->addSql('ALTER TABLE admin_settings_communications ADD CONSTRAINT FK_42D45B45260B1BF7 FOREIGN KEY (admin_setting_id) REFERENCES administrative_settings (id)');
        $this->addSql('ALTER TABLE admin_settings_communications RENAME INDEX fk_admin_settings_communication_communication_methods1_idx TO IDX_42D45B4519883967');
        $this->addSql('ALTER TABLE assignment ADD claims_id INT NOT NULL, DROP claims_number, CHANGE users_id users_id INT DEFAULT NULL, CHANGE status_id status_id INT DEFAULT NULL, ADD PRIMARY KEY (claims_id)');
        $this->addSql('ALTER TABLE assignment ADD CONSTRAINT FK_30C544BA87B1A554 FOREIGN KEY (claims_id) REFERENCES claims (id)');
        $this->addSql('CREATE INDEX fk_assignment_claims1_idx ON assignment (claims_id)');
        $this->addSql('ALTER TABLE claims CHANGE status_id status_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE claims RENAME INDEX fk_claims_status1_idx TO IDX_BEA313BE6BF700BD');
        $this->addSql('ALTER TABLE financial_informations CHANGE users_id users_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE user_roles DROP assigned_at, DROP is_active');
        $this->addSql('ALTER TABLE user_roles RENAME INDEX fk_user_roles_users1_idx TO IDX_54FCD59F67B3B43D');
        $this->addSql('ALTER TABLE user_roles RENAME INDEX fk_user_roles_roles1 TO IDX_54FCD59F38C751C4');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE blacklisted_token');
        $this->addSql('ALTER TABLE account_informations ADD backup_email VARCHAR(255) NOT NULL, CHANGE users_id users_id INT NOT NULL, CHANGE password password VARCHAR(250) DEFAULT NULL');
        $this->addSql('ALTER TABLE financial_informations CHANGE users_id users_id INT NOT NULL');
        $this->addSql('ALTER TABLE claims CHANGE status_id status_id INT NOT NULL');
        $this->addSql('ALTER TABLE claims RENAME INDEX idx_bea313be6bf700bd TO fk_claims_status1_idx');
        $this->addSql('ALTER TABLE user_roles ADD assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP, ADD is_active TINYINT(1) DEFAULT 1');
        $this->addSql('ALTER TABLE user_roles RENAME INDEX idx_54fcd59f67b3b43d TO fk_user_roles_users1_idx');
        $this->addSql('ALTER TABLE user_roles RENAME INDEX idx_54fcd59f38c751c4 TO fk_user_roles_Roles1');
        $this->addSql('ALTER TABLE admin_settings_communications DROP FOREIGN KEY FK_42D45B45260B1BF7');
        $this->addSql('ALTER TABLE admin_settings_communications ADD is_active TINYINT(1) DEFAULT 1');
        $this->addSql('ALTER TABLE admin_settings_communications ADD CONSTRAINT fk_admin_settings_communication_administrative_settings1 FOREIGN KEY (admin_setting_id) REFERENCES administrative_settings (users_id) ON UPDATE NO ACTION ON DELETE NO ACTION');
        $this->addSql('ALTER TABLE admin_settings_communications RENAME INDEX idx_42d45b4519883967 TO fk_admin_settings_communication_communication_methods1_idx');
        $this->addSql('ALTER TABLE administrative_settings CHANGE users_id users_id INT NOT NULL');
        $this->addSql('CREATE INDEX fk_administrative_settings_users1_idx ON administrative_settings (users_id)');
        $this->addSql('ALTER TABLE assignment DROP FOREIGN KEY FK_30C544BA87B1A554');
        $this->addSql('DROP INDEX `primary` ON assignment');
        $this->addSql('DROP INDEX fk_assignment_claims1_idx ON assignment');
        $this->addSql('ALTER TABLE assignment ADD claims_number VARCHAR(100) NOT NULL, DROP claims_id, CHANGE status_id status_id INT NOT NULL, CHANGE users_id users_id INT NOT NULL');
    }
}
