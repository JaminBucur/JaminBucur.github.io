CREATE TABLE Users (
    userID INTEGER PRIMARY KEY AUTOINCREMENT,
    userCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
    username TEXT NOT NULL,
    email TEXT NOT NULL,
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
    name TEXT NOT NULL,
    description TEXT NOT NULL,
	categoryID INTEGER NOT NULL,
	price REAL NOT NULL,
    image TEXT NOT NULL,
    ingredients TEXT NOT NULL,
	directions TEXT NOT NULL,
    featured INTEGER CHECK(featured IN (0, 1)) NOT NULL DEFAULT 0,
    FOREIGN KEY (categoryID) REFERENCES Categories(categoryID)
);

CREATE TABLE Nutrition (
    nutritionID INTEGER PRIMARY KEY AUTOINCREMENT,
    servings_per_container INTEGER NOT NULL,
    serving_size TEXT NOT NULL,
    calories INTEGER NOT NULL,
    total_fat TEXT NOT NULL,
    cholesterol TEXT NOT NULL,
    sodium TEXT NOT NULL,
    total_carbohydrates TEXT NOT NULL,
    sugars TEXT NOT NULL,
    protein TEXT NOT NULL,
    productID TEXT NOT NULL,
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
    discountValue REAL NOT NULL
);

CREATE TABLE ProductDiscounts (
    productID INTEGER NOT NULL,
    discountID INTEGER NOT NULL,
    FOREIGN KEY (productID) REFERENCES Products(productID),
    FOREIGN KEY (discountID) REFERENCES Discounts(discountID)
);

CREATE TABLE CouponCodes (
    code TEXT PRIMARY KEY,
    discountID INTEGER NOT NULL,
    expirationDate DATETIME,
    FOREIGN KEY (discountID) REFERENCES Discounts(discountID)
);