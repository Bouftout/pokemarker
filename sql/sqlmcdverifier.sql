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
        id          Int  Auto_increment  NOT NULL ,
        nv          Int NOT NULL ,
        name        Varchar (50) NOT NULL ,
        surnom      Varchar (50) NOT NULL ,
        original    Bool NOT NULL ,
        description Varchar (50) NOT NULL ,
        id_accounts Int NOT NULL ,
        id_nature   Int NOT NULL ,
        id_equipe   Int NOT NULL
	,CONSTRAINT pokemon_PK PRIMARY KEY (id)

	,CONSTRAINT pokemon_accounts_FK FOREIGN KEY (id_accounts) REFERENCES accounts(id)
	,CONSTRAINT pokemon_nature0_FK FOREIGN KEY (id_nature) REFERENCES nature(id)
	,CONSTRAINT pokemon_equipe1_FK FOREIGN KEY (id_equipe) REFERENCES equipe(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: date
#------------------------------------------------------------

CREATE TABLE date(
        date Date NOT NULL
	,CONSTRAINT date_PK PRIMARY KEY (date)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: possede
#------------------------------------------------------------

CREATE TABLE possede(
        id         Int NOT NULL ,
        id_pokemon Int NOT NULL
	,CONSTRAINT possede_PK PRIMARY KEY (id,id_pokemon)

	,CONSTRAINT possede_statistique_FK FOREIGN KEY (id) REFERENCES statistique(id)
	,CONSTRAINT possede_pokemon0_FK FOREIGN KEY (id_pokemon) REFERENCES pokemon(id)
)ENGINE=InnoDB;


#------------------------------------------------------------
# Table: combat
#------------------------------------------------------------

CREATE TABLE combat(
        id                Int NOT NULL AUTO_INCREMENT,
        id_pokemon_p1_combat INT,
        id_pokemon_p2_combat Int,
        date              Date DEFAULT current_timestamp() ,
        pvrestant         Varchar (50) NOT NULL,
        id_vainqueur         INT,
        id_perdant           INT NOT NULL,
        FOREIGN KEY (id_pokemon_p1_combat) REFERENCES pokemon(id),
        FOREIGN KEY (id_pokemon_p2_combat) REFERENCES pokemon(id),
        FOREIGN KEY (id_vainqueur) REFERENCES accounts(id),
        FOREIGN KEY (id_perdant) REFERENCES accounts(id),
        PRIMARY KEY (id)

)ENGINE=InnoDB;

