SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS inventory_logs;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS otps;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    status ENUM('active', 'inactive') DEFAULT 'inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_otps_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    category_id INT,
    stock_quantity INT DEFAULT 100,
    sizes VARCHAR(255) DEFAULT 'S,M,L,XL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
    address TEXT,
    phone VARCHAR(20),
    coupon_code VARCHAR(50),
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    size VARCHAR(50),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percent', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    usage_limit INT DEFAULT NULL,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inventory_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    order_id INT NULL,
    change_amount INT NOT NULL,
    reason ENUM('order_created', 'order_cancelled', 'manual_adjustment') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating TINYINT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_product_review (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (user_name, email, password, full_name, phone, address, role, status)
VALUES
    ('admin', 'admin@lmn.local', 'admin123', 'System Admin', '0900000000', 'Ha Noi, Viet Nam', 'admin', 'active')
ON DUPLICATE KEY UPDATE
    password = VALUES(password),
    full_name = VALUES(full_name),
    phone = VALUES(phone),
    address = VALUES(address),
    role = VALUES(role),
    status = VALUES(status);

INSERT INTO categories (name, description) VALUES
    ('Ao So Mi', 'Dong ao so mi va polo cotton cao cap'),
    ('Quan Nam', 'Quan tay may do va quan joggers hien dai'),
    ('Ao Khoac', 'Ao khoac, mang to va blazers sang trong'),
    ('Phu Kien', 'Dong ho, that lung va kinh ram nam tinh');

INSERT INTO products (name, description, price, image_url, category_id, stock_quantity) VALUES
    ('Áo hoodie có khóa màu xám', 'Sản phẩm Áo hoodie có khóa màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-hoodie-co-khoa-mau-xam-png.png', 1, 100),
    ('Áo hoodie màu đen', 'Sản phẩm Áo hoodie màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-hoodie-mau-en-png.png', 1, 100),
    ('Áo khoác màu đen', 'Sản phẩm Áo khoác màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-khoac-mau-en-png.png', 3, 100),
    ('Áo khoác nỉ màu đen', 'Sản phẩm Áo khoác nỉ màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-khoac-ni-mau-en-png.png', 3, 100),
    ('Áo phông dáng hộp màu nâu', 'Sản phẩm Áo phông dáng hộp màu nâu chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-phong-dang-hop-mau-nau-png.png', 1, 100),
    ('Áo phông màu nâu', 'Sản phẩm Áo phông màu nâu chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-phong-mau-nau-png.png', 1, 100),
    ('Áo polo dài tay màu hồng', 'Sản phẩm Áo polo dài tay màu hồng chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-polo-dai-tay-mau-hong-png.png', 1, 100),
    ('Áo polo dài tay màu xám', 'Sản phẩm Áo polo dài tay màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-polo-dai-tay-mau-xam-png.png', 1, 100),
    ('Áo polo in hình màu đen', 'Sản phẩm Áo polo in hình màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-polo-in-hinh-mau-en-png.png', 1, 100),
    ('Áo polo màu đen', 'Sản phẩm Áo polo màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-polo-mau-en-png.png', 1, 100),
    ('Áo polo màu trắng', 'Sản phẩm Áo polo màu trắng chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-polo-mau-trang-png.png', 1, 100),
    ('Áo polo màu xám', 'Sản phẩm Áo polo màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-polo-mau-xam-png.png', 1, 100),
    ('Áo polo màu xanh', 'Sản phẩm Áo polo màu xanh chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-polo-mau-xanh-png.png', 1, 100),
    ('Áo sơ mi dài tay màu be', 'Sản phẩm Áo sơ mi dài tay màu be chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-dai-tay-mau-be-png.png', 1, 100),
    ('Áo sơ mi dài tay màu đen', 'Sản phẩm Áo sơ mi dài tay màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-dai-tay-mau-en-png.png', 1, 100),
    ('Áo sơ mi dài tay màu xanh', 'Sản phẩm Áo sơ mi dài tay màu xanh chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-dai-tay-mau-xanh-png.png', 1, 100),
    ('Áo sơ mi kẻ sọc màu xám', 'Sản phẩm Áo sơ mi kẻ sọc màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-ke-soc-mau-xam-png.png', 1, 100),
    ('Áo sơ mi màu be', 'Sản phẩm Áo sơ mi màu be chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-mau-be-png.png', 1, 100),
    ('Áo sơ mi màu đen', 'Sản phẩm Áo sơ mi màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-mau-en-png.png', 1, 100),
    ('Áo sơ mi màu đỏ rượu', 'Sản phẩm Áo sơ mi màu đỏ rượu chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-mau-o-ruou-png.png', 1, 100),
    ('Áo sơ mi màu trắng', 'Sản phẩm Áo sơ mi màu trắng chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-mau-trang-png.png', 1, 100),
    ('Áo sơ mi màu xanh', 'Sản phẩm Áo sơ mi màu xanh chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-so-mi-mau-xanh-png.png', 1, 100),
    ('Áo thun dáng hộp màu đen', 'Sản phẩm Áo thun dáng hộp màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-thun-dang-hop-mau-t-en-png.png', 1, 100),
    ('Áo thun dáng hộp màu trắng', 'Sản phẩm Áo thun dáng hộp màu trắng chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-thun-dang-hop-mau-trang-png.png', 1, 100),
    ('Áo thun in hình màu đen', 'Sản phẩm Áo thun in hình màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-thun-in-hinh-mau-en-png.png', 1, 100),
    ('Áo thun in hình màu xanh', 'Sản phẩm Áo thun in hình màu xanh chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-thun-in-hinh-mau-xanh-png.png', 1, 100),
    ('Áo thun kẻ sọc màu đen', 'Sản phẩm Áo thun kẻ sọc màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-thun-ke-soc-mau-en-png.png', 1, 100),
    ('Áo thun màu đỏ', 'Sản phẩm Áo thun màu đỏ chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/ao-thun-mau-o-png.png', 1, 100),
    ('Giày thể thao màu đen', 'Sản phẩm Giày thể thao màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/giay-the-thao-mau-en-png.png', 4, 100),
    ('Khăn choàng cổ màu đen', 'Sản phẩm Khăn choàng cổ màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/khan-choang-co-mau-en-png.png', 4, 100),
    ('Mũ cói màu be', 'Sản phẩm Mũ cói màu be chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/mu-coi-mau-be-png.png', 4, 100),
    ('Mũ đeo chéo màu đỏ', 'Sản phẩm Mũ đeo chéo màu đỏ chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/mu-eo-cheo-mau-o-png.png', 4, 100),
    ('Mũ len màu đen', 'Sản phẩm Mũ len màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/mu-len-mau-en-png.png', 4, 100),
    ('Mũ len màu xám', 'Sản phẩm Mũ len màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/mu-len-mau-xam-png.png', 4, 100),
    ('Mũ lưỡi trai màu xanh dương', 'Sản phẩm Mũ lưỡi trai màu xanh dương chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/mu-luoi-trai-mau-xanh-am-png.png', 4, 100),
    ('Quần dài kẻ sọc màu trắng', 'Sản phẩm Quần dài kẻ sọc màu trắng chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-dai-ke-soc-mau-trang-png.png', 2, 100),
    ('Quần jean màu đen', 'Sản phẩm Quần jean màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-jean-mau-en-png.png', 2, 100),
    ('Quần jean màu xám', 'Sản phẩm Quần jean màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-jean-mau-xam-png.png', 2, 100),
    ('Quần jogger màu xám', 'Sản phẩm Quần jogger màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-jogger-mau-xam-png.png', 2, 100),
    ('Quần kaki dài màu be', 'Sản phẩm Quần kaki dài màu be chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-kaki-dai-mau-be-png.png', 2, 100),
    ('Quần nỉ dài màu đen', 'Sản phẩm Quần nỉ dài màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-ni-dai-mau-en-png.png', 2, 100),
    ('Quần short jean màu đen', 'Sản phẩm Quần short jean màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-short-jean-mau-en-png.png', 2, 100),
    ('Quần short jean màu xanh', 'Sản phẩm Quần short jean màu xanh chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-short-jean-mau-xanh-png.png', 2, 100),
    ('Quần short màu hồng', 'Sản phẩm Quần short màu hồng chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-short-mau-hong-png.png', 2, 100),
    ('Quần short màu nâu', 'Sản phẩm Quần short màu nâu chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-short-mau-nau-png.png', 2, 100),
    ('Quần short màu xám', 'Sản phẩm Quần short màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-short-mau-xam-png.png', 2, 100),
    ('Quần short màu xanh', 'Sản phẩm Quần short màu xanh chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-short-mau-xanh-png.png', 2, 100),
    ('Quần short nỉ màu xám', 'Sản phẩm Quần short nỉ màu xám chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-short-ni-mau-xam-png.png', 2, 100),
    ('Quần thun dài màu đen', 'Sản phẩm Quần thun dài màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-thun-dai-mau-en-png.png', 2, 100),
    ('Quần túi hộp màu đen', 'Sản phẩm Quần túi hộp màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-tui-hop-mau-en-png.png', 2, 100),
    ('Quần túi hộp màu nâu', 'Sản phẩm Quần túi hộp màu nâu chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/quan-tui-hop-mau-nau-png.png', 2, 100),
    ('Thắt lưng vải màu đen', 'Sản phẩm Thắt lưng vải màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/that-lung-vai-mau-en-png.png', 4, 100),
    ('Túi dù đeo chéo màu đen', 'Sản phẩm Túi dù đeo chéo màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/tui-du-eo-cheo-mau-en-png.png', 4, 100),
    ('Túi đeo chéo màu đen', 'Sản phẩm Túi đeo chéo màu đen chất lượng cao, thiết kế hiện đại.', 500000.00, 'img/tui-eo-cheo-mau-en-png.png', 4, 100);

INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, usage_limit, expires_at) VALUES
    ('WELCOME10', 'percent', 10, 500000, 100, '2027-12-31 23:59:59'),
    ('SAVE200K', 'fixed', 200000, 1500000, 50, '2027-12-31 23:59:59');
