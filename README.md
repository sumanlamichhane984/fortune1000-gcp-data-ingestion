# Fortune 1000 Data Analytics | GCP Data Engineering Pipeline

![GCP](https://img.shields.io/badge/Google_Cloud-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![BigQuery](https://img.shields.io/badge/BigQuery-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Dataflow](https://img.shields.io/badge/Dataflow-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## Overview

This project implements a cloud-native batch data ingestion and analytics pipeline on Google Cloud Platform (GCP) for the Fortune 1000 (2024) dataset. Raw CSV data is ingested from Google Cloud Storage, transformed and validated using a Dataflow JavaScript UDF, and loaded into BigQuery for analytical querying.

The pipeline follows enterprise-grade data engineering practices used by finance and analytics teams to process large structured business datasets at scale.

---

## Architecture

```
fortune1000_2024.csv
        |
        v
Google Cloud Storage (Raw Zone)
        |
        v
Cloud Dataflow (JavaScript UDF)
  - Parses CSV rows
  - Handles nulls, empty strings, "N/A" values
  - Type casting: INT, FLOAT, DATE, STRING
  - Skips header row automatically
        |
        v
BigQuery (Analytics Warehouse)
  - Schema-enforced table
  - 32 columns, strongly typed
  - Analytics-ready for BI tools
        |
        v
BigQuery SQL Analytics
  - Revenue analysis
  - Profit margins
  - Market cap rankings
  - Workforce efficiency
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Google Cloud Storage | Raw file storage |
| Google Cloud Dataflow | Serverless batch transformation |
| BigQuery | Analytics data warehouse |
| JavaScript (UDF) | Row-level transformation logic |
| JSON Schema | BigQuery table schema definition |

---

## Repository Structure

```
fortune1000-gcp-data-ingestion/
├── dataflow/
│   └── fortune1000_batch_ingest.js   # Dataflow JavaScript UDF
├── schema/
│   └── fortune1000_schema.json       # BigQuery table schema (32 fields)
├── data/
│   └── fortune1000_2024.csv          # Real Fortune 1000 2024 dataset
├── docs/
│   ├── dataflow-job.png              # Dataflow job execution screenshot
│   └── bigquery-table.png            # BigQuery table screenshot
├── sql/
│   └── analytics_queries.sql         # 7 analytical BigQuery queries
├── README.md
├── LICENSE
└── .gitignore
```

---

## Dataset

The dataset contains Fortune 1000 companies (2024 edition) with 32 fields per company including:

| Column | Type | Description |
|---|---|---|
| Rank | INTEGER | Fortune 1000 ranking |
| Company | STRING | Company name |
| Ticker | STRING | Stock ticker symbol |
| Sector | STRING | Business sector |
| Industry | STRING | Specific industry |
| Revenues_M | FLOAT | Annual revenue in millions USD |
| Profits_M | FLOAT | Annual profit in millions USD |
| Assets_M | FLOAT | Total assets in millions USD |
| MarketCap_Updated_M | FLOAT | Updated market cap in millions USD |
| Number_of_employees | INTEGER | Total workforce size |
| Profitable | STRING | Whether company is profitable (yes/no) |
| FemaleCEO | STRING | Whether CEO is female (yes/no) |
| Founder_is_CEO | STRING | Whether founder is current CEO |
| CEO | STRING | CEO full name |
| Country | STRING | Country of headquarters |
| HeadquartersCity | STRING | HQ city |
| HeadquartersState | STRING | HQ state |
| Updated | DATE | Date market cap was last updated |

---

## Dataflow UDF — Key Design Decisions

The JavaScript UDF (`dataflow/fortune1000_batch_ingest.js`) handles several real-world data quality challenges:

- **Null handling** — empty strings, `"N/A"`, `"null"`, `"none"` are all normalized to `NULL`
- **Type casting** — revenues, profits, market cap cast to `FLOAT`; rank and employees cast to `INTEGER`; updated date cast to `DATE`
- **CSV parsing** — custom quote-aware parser handles fields with commas inside quoted strings
- **Header skipping** — automatically skips the CSV header row
- **Currency cleaning** — strips `$`, `%`, `,` characters before numeric conversion
- **Dual input support** — handles both raw CSV rows and JSON objects

**Why Dataflow UDF over Python Beam?**
Dataflow JavaScript UDFs are ideal for schema-driven CSV ingestion where transformation logic is field-level and stateless. No cluster management, fully serverless, and natively integrates with the GCS → BigQuery template.

---

## BigQuery Schema

The destination table enforces strong typing across all 32 fields. Key type decisions:

- Financial metrics (`Revenues_M`, `Profits_M`, `Assets_M`, `MarketCap_March28_M`, `MarketCap_Updated_M`) → `FLOAT` to handle decimal precision
- Identifiers (`Rank`, `Number_of_employees`) → `INTEGER`
- Boolean-like flags (`Profitable`, `FemaleCEO`, `Founder_is_CEO`) → `STRING` (stored as yes/no for flexibility)
- `Updated` → `DATE` (YYYY-MM-DD format)

---

## Analytics Queries

7 production-ready BigQuery queries in `sql/analytics_queries.sql`:

| # | Query | Business Question |
|---|---|---|
| 1 | Top 10 by Revenue | Which companies generate the most revenue? |
| 2 | Average Profit by Sector | Which sectors are most profitable on average? |
| 3 | Revenue > $100B | Which companies crossed the $100B revenue mark? |
| 4 | Profit Margin Top 20 | Which companies are most efficient at converting revenue to profit? |
| 5 | Revenue per Employee | Which companies generate the most revenue per 1,000 employees? |
| 6 | Female CEO by Sector | How is female CEO representation distributed across sectors? |
| 7 | Top Market Cap | Which companies have the highest market capitalization? |

---

## Pipeline Execution Evidence

Real execution screenshots are available in the `docs/` folder:

- `docs/dataflow-job.png` — Dataflow job showing successful batch run on GCP
- `docs/bigquery-table.png` — BigQuery table populated with Fortune 1000 records

---

## How to Run

### Prerequisites
- GCP project with Dataflow and BigQuery APIs enabled
- A GCS bucket with the CSV file uploaded
- BigQuery dataset created

### Steps

1. Upload `data/fortune1000_2024.csv` to your GCS bucket:
```bash
gsutil cp data/fortune1000_2024.csv gs://your-bucket/raw/fortune1000_2024.csv
```

2. Upload the UDF to GCS:
```bash
gsutil cp dataflow/fortune1000_batch_ingest.js gs://your-bucket/udf/fortune1000_batch_ingest.js
```

3. Create the BigQuery table using the schema:
```bash
bq mk --table your_project:your_dataset.fortune1000_2024 schema/fortune1000_schema.json
```

4. Run the Dataflow GCS to BigQuery template from GCP Console:
   - Template: `Text Files on Cloud Storage to BigQuery`
   - Input: `gs://your-bucket/raw/fortune1000_2024.csv`
   - UDF path: `gs://your-bucket/udf/fortune1000_batch_ingest.js`
   - UDF function name: `process`
   - Output table: `your_project:your_dataset.fortune1000_2024`

5. Run analytics queries in BigQuery Console from `sql/analytics_queries.sql`

---

## Challenges & Lessons Learned

- **Quoted CSV fields with commas** required building a custom quote-aware parser inside the UDF rather than using simple string splitting
- **Mixed null representations** in the raw data (`""`, `"N/A"`, `"null"`) required a unified normalization function to keep the warehouse clean
- **Dataflow UDF debugging** is done by testing the JS function locally with sample rows before deploying to GCP — this saved significant iteration time

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

