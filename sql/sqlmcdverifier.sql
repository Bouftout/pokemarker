#------------------------------------------------------------
#        Script MySQL.
#------------------------------------------------------------


#------------------------------------------------------------
# Table: accounts
#------------------------------------------------------------

CREATE TABLE accounts(
        id       Int  Auto_increment  NOT NULL ,
        username Varchar (50) NOT NULL ,
        password Varchar (255) NOT NULL ,
        email    Varchar (100) NOT NULL
	,CONSTRAINT accounts_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: statistique
#------------------------------------------------------------

CREATE TABLE statistique(
        id       Int  Auto_increment  NOT NULL ,
        namestat Varchar (50) NOT NULL ,
        stat     Varchar (50) NOT NULL
	,CONSTRAINT statistique_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: nature
#------------------------------------------------------------

CREATE TABLE nature(
        id    Int  Auto_increment  NOT NULL ,
        natur Varchar (50) NOT NULL
	,CONSTRAINT nature_PK PRIMARY KEY (id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: equipe
#------------------------------------------------------------

CREATE TABLE equipe(
        id          Int  Auto_increment  NOT NULL ,
        nom         Varchar (50) NOT NULL ,
        date        Date NOT NULL ,
        id_accounts Int NOT NULL
	,CONSTRAINT equipe_PK PRIMARY KEY (id)

	,CONSTRAINT equipe_accounts_FK FOREIGN KEY (id_accounts) REFERENCES accounts(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: pokemon
#------------------------------------------------------------

CREATE TABLE pokemon(
        id             Int  Auto_increment  NOT NULL ,
        idaccounts     Int NOT NULL ,
        nv             Int NOT NULL ,
        name           Varchar (50) NOT NULL ,
        surnom         Varchar (50) NOT NULL ,
        original       Bool NOT NULL ,
        date           Date NOT NULL ,
        description    Varchar (50) NOT NULL ,
        id_accounts    Int NOT NULL ,
        id_statistique Int NOT NULL ,
        id_nature      Int NOT NULL ,
        id_equipe      Int NOT NULL
	,CONSTRAINT pokemon_PK PRIMARY KEY (id)

	,CONSTRAINT pokemon_accounts_FK FOREIGN KEY (id_accounts) REFERENCES accounts(id)
	,CONSTRAINT pokemon_statistique0_FK FOREIGN KEY (id_statistique) REFERENCES statistique(id)
	,CONSTRAINT pokemon_nature1_FK FOREIGN KEY (id_nature) REFERENCES nature(id)
	,CONSTRAINT pokemon_equipe2_FK FOREIGN KEY (id_equipe) REFERENCES equipe(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: date
#------------------------------------------------------------

CREATE TABLE date(
        date Int  Auto_increment  NOT NULL
	,CONSTRAINT date_PK PRIMARY KEY (date)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: combat
#------------------------------------------------------------

CREATE TABLE combat(
        id_pokemon        Int NOT NULL ,
        id_pokemon_combat Int NOT NULL ,
        date              Int NOT NULL ,
        id                Int NOT NULL ,
        idpok1            Int NOT NULL ,
        idpok2            Int NOT NULL ,
        pvrestant         Varchar (50) NOT NULL ,
        vainqueur         Varchar (50) NOT NULL
	,CONSTRAINT combat_PK PRIMARY KEY (id_pokemon,id_pokemon_combat,date)

	,CONSTRAINT combat_pokemon_FK FOREIGN KEY (id_pokemon) REFERENCES pokemon(id)
	,CONSTRAINT combat_pokemon0_FK FOREIGN KEY (id_pokemon_combat) REFERENCES pokemon(id)
	,CONSTRAINT combat_date1_FK FOREIGN KEY (date) REFERENCES date(date)
)ENGINE=InnoDB;

