-- Seed Data for Cyber Shield Pan-India B2B Crop Marketplace
-- Prepared by Cyber Shield | SIH 26033

INSERT INTO crop_catalogue (id, crop_name, category, reference_price_per_kg, reference_source, reference_date) VALUES
('11111111-1111-1111-1111-111111111111', 'Paddy / Rice', 'Cereals', 24.50, 'Agmarknet / NAFED MSP Reference (2026)', '2026-09-10'),
('22222222-2222-2222-2222-222222222222', 'Wheat', 'Cereals', 26.00, 'CACP / Mandi Modal Average', '2026-09-12'),
('33333333-3333-3333-3333-333333333333', 'Tomato', 'Vegetables', 22.00, 'Nashik APMC Daily Bulletin', '2026-09-13'),
('44444444-4444-4444-4444-444444444444', 'Onion', 'Vegetables', 28.00, 'Lasalgaon Mandi Average', '2026-09-12'),
('55555555-5555-5555-5555-555555555555', 'Banana (Sold by Kg Weight)', 'Fruits', 18.50, 'Theni Banana Growers Association', '2026-09-11'),
('66666666-6666-6666-6666-666666666666', 'Coconut (Sold by Kg Weight)', 'Cash Crops', 34.00, 'Coconut Development Board Cochin', '2026-09-12')
ON CONFLICT (crop_name) DO NOTHING;
