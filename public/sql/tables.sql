CREATE TABLE user (
    USER_ID int NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(50),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email_address VARCHAR(50),
    admin_user VARCHAR(1),
    user_removed VARCHAR(1),
    password VARCHAR(50),
    PRIMARY KEY (USER_ID)
);