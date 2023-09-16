# Software Installation
1. Install Node JS
2. Install Python
3. Mongo DB Community Server

# Clone the Application
1. Create a new directory
2. Run => git clone https://github.com/NishakarKT/axisllm.git .

# Frontend
1. cd client
2. npm i --legacy-peer-deps
3. npm start
4. React Frontend is live at http://127.0.0.1:3000

# Node Server
1. cd server
2. npm i
3. Create an .env file with following environment variables:

COMPANY=<company_name>
MONGO_URI=<mongo_connection_uri>
EMAIL=<email>
PASSWORD=<email_app_password>
DISPLAY_EMAIL=<email_to_be_displayed>
JWT_SECRET_KEY=<JWT_secret_key>

4. npm run start
5. Node Server is live at http://127.0.0.1:8001

# Python API
1. cd api
2. create a virtuall environment
3. pip install -r requirements.txt
4. Create an .env file with following environment variables:

OPENAI_KEY=<openai_api_key>

5. uvicorn main:app --reload
6. Python Server is live at http://127.0.0.1:8000

# Database (It activates by itself post installlation)
1. Install Mongosh
2. Open Mongosh (Mongo Shell)
3. Query your data
4. Live at mongodb://127.0.0.1:27017