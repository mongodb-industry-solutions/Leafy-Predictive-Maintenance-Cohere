# Leafy-Predictive-Maintenance

This demo demonstrates MongoDB Atlas’s capabilities for predictive maintenance through three key features: 
- **Equipment Criticality Analysis** for prioritizing machines using AI and semantic searches
- **Failure Prediction** for real-time failure forecasts and visualizations
- **Repair Plan Generation** for creating detailed maintenance work orders.

Discover how these tools streamline maintenance processes and optimize machine performance.

## Step 1: Create a MongoDB Atlas Instance

1. Create a MongoDB Atlas instance if you don't already have one. Our recommended name for cluster is "Smart-Factory-Cluster". You can choose your own name but please make sure to update the name in step 7 (app services setup)
2. Create a database and some collections. Our recommended name for database is "smart_factory". You can choose your own name but please make sure to update the name in step 7 (app services setup)

## Step 2. Configure Environment Variables

To run this project, you will need to create a `.env` file in the root directory of your project and add the following variables:

```env
MONGODB_CONNECTION_STRING="your_mongodb_connection_string"
DATABASE="your_database_name"
FAILURES_COLLECTION="your_failures_collection_name"
RAW_DATA_COLLECTION="your_raw_data_collection_name"
TRANSFORMED_DATA_COLLECTION="your_transformed_data_collection_name"
MODELS_COLLECTION="your_models_collection_name"
MAINTAINENCE_HISTORY_COLLECTION="your_maintenance_history_collection_name"
CRITICALITY_ANALYSIS_SEARCH_INDEX="your_criticality_analysis_search_index_name"
REPAIR_MANUALS_COLLECTION="your_repair_manuals_collection_name"
REPAIR_PLAN_SEARCH_INDEX="your_repair_plan_search_index_name"
AWS_REGION="your_aws_region"
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_access"
GCP_TRANSLATE_API_KEY="your_gcp_translate_api_key"
GCP_PROJECT_ID="your_gcp_project_id"
NEXT_PUBLIC_APP_IFRAME_SRC="your_iframe_source_url"
```
Replace the placeholder values with your actual configuration values. Some of the collections you will import in step 3.

Recommended names for collections are listed below. 
```
DATABASE="smart_factory"
FAILURES_COLLECTION="machine_failures"
RAW_DATA_COLLECTION="raw_data"
TRANSFORMED_DATA_COLLECTION="transformed_data"
MODELS_COLLECTION="ml_models"
MAINTAINENCE_HISTORY_COLLECTION="maintenance_history"
REPAIR_MANUALS_COLLECTION="repair_manuals"
```



### Getting a GCP Translate API Key
You can create a free account and get a GCP Translate API key by following the [Google Cloud Platform's](https://cloud.google.com/gcp?utm_source=google&utm_medium=cpc&utm_campaign=emea-es-all-en-bkws-all-all-trial-e-gcp-1707574&utm_content=text-ad-none-any-DEV_c-CRE_500236788678-ADGP_Hybrid+%7C+BKWS+-+EXA+%7C+Txt+-+GCP+-+General+-+v3-KWID_43700060384861657-kwd-26415313501-userloc_1005424&utm_term=KW_google+cloud+platform-NET_g-PLAC_&&gad_source=1&gclid=CjwKCAjwp4m0BhBAEiwAsdc4aGWrFtSlO6P2himmtN7pEC2GGWxFBc7i-RD4vcuqTNRFur8u7w_RCxoCNEsQAvD_BwE&gclsrc=aw.ds&hl=en) instructions.
You will need to search for "Cloud Translation API" and create a new API key. Copy the API key and use it as your `GCP_TRANSLATE_API_KEY` in the .env file.

> [!NOTE]
> Feel free to use any other translation API, just make sure to make the necessary changes in the `translate.js` file.
      
### Integrating Atlas Charts
To integrate Atlas Charts, you will need to create a charts dashboard on MongoDB Atlas and copy the iframe link into the `NEXT_PUBLIC_APP_IFRAME_SRC`. Follow this [tutorial](https://www.mongodb.com/docs/charts/embedding-charts-iframe/) on how to get the iframe link from Atlas Charts.
Link the Atlas charts dashboard to machine_failures collection. You can create any widgets you want :)
We have also included a .charts file in [public](https://github.com/mongodb-industry-solutions/Leafy-Predictive-Maintenance/tree/main/public) folder. You can also use that. Just follow this [tutorial](https://www.mongodb.com/docs/charts/dashboards/dashboard-import-export) on how to import Charts.


## Step 3: Add some Documents in MongoDB

Import the documents provided [here](https://github.com/mongodb-industry-solutions/Leafy-Predictive-Maintenance/tree/main/collections) into Atlas. These include different PDFs (maintenance history document, maintenance instructions and repair plans) that will be used for retrieval-augmented generation in the demo.

The application setup is not finished. Now that you've uploaded the chunks and embeddings with metadata in MongoDB, in order to perform searches, you will need to create the index.

## Step 4: Create a Vector Search Index in MongoDB Atlas
Go to MongoDB Atlas and navigate to Atlas Search.

Click "Create Search Index" and select JSON Editor under Atlas Vector Search.
Choose the database and collection (REPAIR_MANUALS_COLLECTION) you created earlier.
Set "pred_maint_repair_index" as the Index Name and update your env file variable REPAIR_PLAN_SEARCH_INDEX.

Paste the following index definition in the edit box:
```
{
  "fields": [
    {
      "numDimensions": 1024,
      "path": "embeddings",
      "similarity": "euclidean",
      "type": "vector"
    }
  ]
}
```

Click "Next" and then "Create Search Index."

Follow the same steps to create one more index:

- Set "pred_maint_criticality_index" as the Index Name, for collection (MAINTAINENCE_HISTORY_COLLECTION) and paste the following index: 

```
{
  "fields": [
    {
      "numDimensions": 1024,
      "path": "embeddings",
      "similarity": "euclidean",
      "type": "vector"
    },
    {
      "path": "source.filename",
      "type": "filter"
    }
  ]
}
```
update your env file variable CRITICALITY_ANALYSIS_SEARCH_INDEX value

## Step 5. Running the Inference Script

First, make sure you imported the 'collections/smart_factory.ml_models.json' into MongoDB.

Next, install the necessary python dependencies and navigate to the `app/python` directory and execute the script with the following command separately:
`python inference.py`

Make sure you have an .env file in the same folder as inference.py with the required variables 

This script performs automated predictive maintenance using MongoDB and a pre-trained machine learning model. If a failure is predicted, it logs the details to a failure collection. This process streamlines maintenance tasks by automatically detecting and recording potential machine issues.

## Step 6. Atlas Stream Processing Setup

1. Setup Atlas Stream Processing using this tutorial https://www.mongodb.com/docs/atlas/atlas-stream-processing/tutorial/
2. Use the pipeline in ```ASP/ASP Pipeline``` file for the stream processor
3. Make sure to setup your source and sink collections as listed in the Pipeline

## Step 7. Run Alerts app

Navigate to the alerts-app directory:
```
cd alerts-app
```

Create a .env file with the following content:
```
MONGODB_CONNECTION_STRING="your_mongodb_uri"
DATABASE="your_mongodb_database"
```

Install the necessary dependencies:
```
npm install
```

Start the application:
```
node server.js
```

The application is now running on port 5003.


## Step 8. Run the Demo

### Install Dependencies

```
npm i
```

### Run Server

```
npm run dev
```
Use a browser to open the link http://localhost:3000/

Take a look at this [youtube video](https://www.youtube.com/watch?v=YwTWpUl3QS8) to understand how the demo works or read this [white paper](https://www.mongodb.com/resources/solutions/use-cases/generative-ai-predictive-maintenance-applications) and [blog](https://www.mongodb.com/blog/post/building-gen-ai-powered-predictive-maintenance-mongodb) for more explanation.
