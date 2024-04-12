CREATE TABLE Users (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    userCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    userType TEXT CHECK(userType IN ('admin', 'shopper')) NOT NULL,
	tier TEXT CHECK (tier IN ('member', 'bbpue')) NOT NULL
);

CREATE TABLE Categories (
    categoryID INTEGER PRIMARY KEY AUTOINCREMENT,
    categoryName TEXT NOT NULL,
    menuOrder INTEGER NOT NULL
);

CREATE TABLE Products (
    productID INTEGER PRIMARY KEY AUTOINCREMENT,
    productName TEXT,
    description TEXT,
	categoryID INTEGER,
	price REAL,
    image TEXT,
    ingredients TEXT,
	directions TEXT,
    featured INTEGER CHECK(featured IN (0, 1)) DEFAULT 0,
    FOREIGN KEY (categoryID) REFERENCES Categories(categoryID)
);

CREATE TABLE Nutrition (
    nutritionID INTEGER PRIMARY KEY AUTOINCREMENT,
    servings_per_container INTEGER,
    serving_size TEXT,
    calories INTEGER,
    total_fat TEXT,
    cholesterol TEXT,
    sodium TEXT,
    total_carbohydrates TEXT,
    sugars TEXT,
    protein TEXT,
    productID INTEGER,
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

CREATE TABLE Carts (
    cartID INTEGER PRIMARY KEY AUTOINCREMENT,
    status TEXT CHECK(status IN ('new', 'abandoned', 'purchased')) NOT NULL,
    cartCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    userID INTEGER NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(userID)
);

CREATE TABLE CartProducts (
    inCartID INTEGER PRIMARY KEY AUTOINCREMENT,
    cartID INTEGER NOT NULL,
    productID INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (cartID) REFERENCES Carts(cartID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

CREATE TABLE Discounts (
    discountID INTEGER PRIMARY KEY AUTOINCREMENT,
    discountValue REAL NOT NULL,
    discountCaption TEXT
);

CREATE TABLE ProductDiscounts (
    productID INTEGER NOT NULL UNIQUE,
    discountID INTEGER NOT NULL,
    FOREIGN KEY (productID) REFERENCES Products(productID),
    FOREIGN KEY (discountID) REFERENCES Discounts(discountID)
);

CREATE TABLE CouponCodes (
    code TEXT PRIMARY KEY,
    codeValue REAL NOT NULL,
    expirationDate DATETIME
);