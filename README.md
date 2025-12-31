#Fortune 1000 Data Analytics | Modern Data Engineering GCP Project
##Introduction

This project implements a modern cloud-native data ingestion and analytics pipeline on Google Cloud Platform (GCP) for Fortune 1000 company data.
It demonstrates how structured business datasets can be ingested, transformed, validated, and loaded into a scalable analytics warehouse using Dataflow (JavaScript UDF) and BigQuery.

The pipeline follows enterprise-grade data engineering practices used by finance, analytics, and BI teams to process large business datasets.

##Architecture

CSV → Google Cloud Storage → Dataflow (JavaScript UDF) → BigQuery → Analytics

The pipeline ingests raw CSV files from Cloud Storage, applies transformations using a Dataflow JavaScript UDF, and loads the cleaned, schema-validated data into BigQuery for querying and reporting.

##Technology Used

###Programming & Scripting

JavaScript (Dataflow UDF)

JSON (BigQuery schema)

SQL (BigQuery analytics)

###Google Cloud Platform

Google Cloud Storage

Google Cloud Dataflow

BigQuery

###Analytics

BigQuery SQL

BI tools (Looker / dashboards)

##Dataset Used

The dataset represents Fortune 1000 companies, including:

Company rank, name, and ticker

Industry and sector

Financial metrics (revenue, profits, assets, market cap)

Workforce and governance indicators

The original dataset was loaded through the pipeline and stored in BigQuery.
For safety and compliance, only a small synthetic sample is included in this repository.

##Data Model

The destination table is defined using a JSON-based BigQuery schema that enforces:

Strong data typing (INTEGER, FLOAT, STRING, DATE)

Null handling and validation

Consistent field definitions for analytics

This ensures the warehouse is reliable and analytics-ready.

##Pipeline Scripts

Dataflow Transformation (JavaScript UDF)
dataflow/fortune1000_batch_ingest.js

BigQuery Table Schema
schema/fortune1000_schema.json

Sample Dataset (synthetic)
data/sample_fortune1000.csv

##Pipeline Execution

The repository includes real execution evidence:

A Dataflow job showing a successful batch ingestion run

A BigQuery table populated with Fortune 1000 records

These confirm the pipeline was executed end-to-end on Google Cloud.

##About

This project demonstrates how to build a production-style cloud data ingestion pipeline using Google Cloud Dataflow and BigQuery, following best practices for:

Schema-driven ingestion

Serverless batch processing

Data quality enforcement

Analytics-ready warehouse design

It reflects the same architecture patterns used by modern data teams in finance, analytics, and enterprise reporting.
