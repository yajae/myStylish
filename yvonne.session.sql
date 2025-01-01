-- CREATE TABLE campaigns (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     title VARCHAR(255) NOT NULL,
--     category VARCHAR(100) NOT NULL,
--     description TEXT,
--     main_image VARCHAR(255),
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );
INSERT INTO campaigns (title, category, description, main_image)
VALUES ('Campaign Title', 'Category Name', 'This is a description of the campaign.', './public/uploads/1715429247675-695351702-800x.webp');
