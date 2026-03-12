-- 1. Top 10 Companies by Revenue
SELECT
  Rank,
  Company,
  Sector,
  ROUND(Revenues_M / 1000, 2) AS revenue_billions
FROM `your_project.your_dataset.fortune1000_2024`
ORDER BY Revenues_M DESC
LIMIT 10;
 
-- 2. Average Profit by Sector
SELECT
  Sector,
  COUNT(*) AS company_count,
  ROUND(AVG(Profits_M), 2) AS avg_profit_m,
  ROUND(SUM(Revenues_M) / 1000, 2) AS total_revenue_billions
FROM `your_project.your_dataset.fortune1000_2024`
WHERE Profitable = 'yes'
GROUP BY Sector
ORDER BY avg_profit_m DESC;
 
-- 3. Companies with Revenue over $100 Billion
SELECT
  Company,
  Ticker,
  Sector,
  Industry,
  ROUND(Revenues_M / 1000, 2) AS revenue_billions,
  ROUND(Profits_M / 1000, 2) AS profit_billions
FROM `your_project.your_dataset.fortune1000_2024`
WHERE Revenues_M > 100000
ORDER BY Revenues_M DESC;
 
-- 4. Profit Margin by Company (Top 20)
SELECT
  Company,
  Sector,
  Revenues_M,
  Profits_M,
  ROUND((Profits_M / Revenues_M) * 100, 2) AS profit_margin_pct
FROM `your_project.your_dataset.fortune1000_2024`
WHERE Revenues_M > 0
  AND Profitable = 'yes'
ORDER BY profit_margin_pct DESC
LIMIT 20;
 
-- 5. Revenue per Employee Efficiency (Top 15)
SELECT
  Company,
  Sector,
  Number_of_employees,
  Revenues_M,
  ROUND(Revenues_M / (Number_of_employees / 1000), 2) AS revenue_per_1k_employees
FROM `your_project.your_dataset.fortune1000_2024`
WHERE Number_of_employees > 0
ORDER BY revenue_per_1k_employees DESC
LIMIT 15;
 
-- 6. Companies with Female CEOs by Sector
SELECT
  Sector,
  COUNT(*) AS total_companies,
  SUM(CASE WHEN FemaleCEO = 'yes' THEN 1 ELSE 0 END) AS female_ceo_count,
  ROUND(SUM(CASE WHEN FemaleCEO = 'yes' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS female_ceo_pct
FROM `your_project.your_dataset.fortune1000_2024`
GROUP BY Sector
ORDER BY female_ceo_count DESC;
 
-- 7. Top Market Cap Companies
SELECT
  Company,
  Ticker,
  Sector,
  ROUND(MarketCap_Updated_M / 1000, 2) AS market_cap_billions,
  ROUND(Revenues_M / 1000, 2) AS revenue_billions
FROM `your_project.your_dataset.fortune1000_2024`
WHERE MarketCap_Updated_M IS NOT NULL
ORDER BY MarketCap_Updated_M DESC
LIMIT 15;
