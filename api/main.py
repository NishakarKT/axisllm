import openai
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain.utilities import SQLDatabase
from langchain.llms import OpenAI
from langchain_experimental.sql import SQLDatabaseChain
from fastapi.responses import JSONResponse
import sqlite3
import pandas as pd
import re


cnx = sqlite3.connect('data_KRA.sqlite')

emp = pd.read_sql_query("SELECT * FROM Employees", cnx)
cust = pd.read_sql_query("SELECT * FROM Customers", cnx)
cus_emp = pd.read_sql_query("SELECT * FROM Customers_Employees", cnx)
persona = pd.read_sql_query("SELECT * FROM Persona", cnx)
kra = pd.read_sql_query("SELECT * FROM RM_KRAs", cnx)
ph = pd.read_sql_query("SELECT * FROM Product_Holding", cnx)
ch = pd.read_sql_query("SELECT * FROM contacthistory", cnx)

def get_cols(verbose):
    cols = []
    for key in verbose.keys():
            output = verbose[key]
        
            for out in output:
                if type(out) == dict and 'input' in out.keys():
                    if 'SELECT' in out['input']:
                        result = re.findall(r'"(.*?)"', out['input'].split("SELECT")[1].split("FROM")[0])
                    
                        if result:
                            if result not in cols:
                                cols.append(result)
    
    cols = [col for col in cols if len(col) > 1]
    data = []
    for col in cols:
        data_dict = {}
        try:
            if 'x' not in data_dict.keys():
                if col[0] in emp.columns:
                    data_dict['x'] = emp[col[0]].values.tolist()
                elif col[0] in cust.columns:
                    data_dict['x'] = cust[col[0]].values.tolist()
                elif col[0] in ch.columns:
                    data_dict['x'] = ch[col[0]].values.tolist()
                elif col[0] in ph.columns:
                    data_dict['x'] = ph[col[0]].values.tolist()
                elif col[0] in kra.columns:
                    data_dict['x'] = kra[col[0]].values.tolist()
                elif col[0] in cus_emp.columns:
                    data_dict['x'] = cus_emp[col[0]].values.tolist()
                elif col[0] in persona.columns:
                    data_dict['x'] = persona[col[0]].values.tolist()
                else:
                    data_dict['x'] = cus_emp['RM'].tolist()
            if 'y' not in data_dict.keys():
                if col[1] in emp.columns and emp[col[1]].dtype != 'O':
                    data_dict['y'] = emp[col[1]].values.tolist()
                elif col[1] in cust.columns and cust[col[1]].dtype != 'O':
                    data_dict['y'] = cust[col[1]].values.tolist()
                elif col[1] in ch.columns and ch[col[1]].dtype != 'O':
                    data_dict['y'] = ch[col[1]].values.tolist()
                elif col[1] in ph.columns and ph[col[1]].dtype != 'O':
                    data_dict['y'] = ph[col[1]].values.tolist()
                elif col[1] in kra.columns and kra[col[1]].dtype != 'O':
                    data_dict['y'] = kra[col[1]].values.tolist()
                elif col[1] in cus_emp.columns and cus_emp[col[1]].dtype != 'O':
                    data_dict['y'] = cus_emp[col[1]].values.tolist()
                elif col[1] in persona.columns and persona[col[1]].dtype != 'O':
                    data_dict['y'] = persona[col[1]].values.tolist()
                else:
                    data_dict['y'] = cus_emp['ACCT_BAL'].tolist()

            if len(data_dict['x'])>len(data_dict['y']):
                data_dict['x'] = data_dict['x'][:len(data_dict['y'])]
            else:
                data_dict['y'] = data_dict['y'][:len(data_dict['x'])]
        except:
            data_dict['y'] = cus_emp['ACCT_BAL'].tolist()
            data_dict['y'] = data_dict['y'][:len(data_dict['x'])].tolist()
        data.append(data_dict)  
        
    return data,cols


def convert_str_to_list(s):
    s = s.strip()
    if s.startswith("[") and s.endswith("]"):
        s = s[1:-1]
    list_of_strings = s.split('",')
    list_of_strings = [item.strip(' "').replace('\\"', '') for item in list_of_strings]
    return list_of_strings


class KRA:
    def __init__(self, user_id, role, role_id):
        self.user_id = user_id
        self.role = role
        self.role_id = role_id
        self.detailed = ""

    def generate_completion(self, query: str) -> str:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo-16k",
            temperature=0,
            max_tokens=1028,
            messages=[
                {"role": "assistant", "content": query},
                {"role": "user", "content": ""}
            ]
        )
        return completion.choices[0].message

    def create_query_template(self, query):
        self.schema = """{"contacthistory.csv": {"Cust_ID": "int64", "Employee_ID": "int64", "contact_date": "object", "Product": "object", "disposition": "object"}, "Customers.csv": {"Cust_ID": "int64", "Name": "object", "Age": "int64", "Gender": "object", "Location": "object", "Marital_Status": "object", "Education": "object", "Occupation": "object", "MOB": "int64", "Income": "int64", "Dependents": "int64", "Digital_ind": "int64", "Email": "object", "Phone": "object", "Address": "float64"}, "Customers_Employees.csv": {"Cust_ID": "int64", "Employee_ID": "int64", "ACCT_BAL": "int64", "ACCT_BAL_FY_START": "int64"}, "Employees.csv": {"Employee_ID": "int64", "Name": "object", "Email": "object", "SOL_ID": "int64", "Cluster": "object", "Circle": "object", "Region": "object", "Branch_Type": "object"}, "Persona.csv": {"Cust_ID": "int64", "Location_Type": "object", "Investment_risk_tol": "object", "Avg_mon_expense": "float64", "Investment_needs": "object", "BAnking_Needs": "object", "Pref_channel": "object", "Lifestyle": "object", "Net_Worth": "int64", "Persona": "object", "Biz_Type": "object", "Biz_Size": "float64", "Biz_Age": "float64", "Turnover": "float64", "Credit_Score": "int64"}, "Product_Holding.csv": {"Cust_ID": "int64", "Term_Deposit": "int64", "Auto_Loan": "int64", "Two_Wheeler_Loan": "int64", "Personal_Loan": "int64", "Home_Loan": "int64", "Credit_Card": "int64", "Life_Insurance": "int64", "Mutual_Fund": "int64", "General_Insurance": "int64", "Agri_Loan": "int64", "National_Pension_Scheme": "int64", "Tractor_Loan": "int64", "Remittance": "int64", "Forex_Card": "int64", "Trading_Account": "int64", "Digital_Banking": "int64", "Credit_Card_CLI": "int64", "Credit_Card_EMI": "int64", "Credit_Card_Upgrade": "int64", "Education_Loan": "int64"}, "RM_KRAs.csv": {"Employee_ID": "int64", "TARGET": "object", "Unit": "object", "Target_FY22_23_ABS": "float64", "Target_FY22_23_PCT": "int64", "Rating": "int64", "CURR_COMPLETION_ABS": "float64", "CURR_COMPLETION_PCT": "float64", "APR_COMPLETION_ABS": "float64", "APR_COMPLETION_PCT": "float64", "MAY_COMPLETION_ABS": "float64", "MAY_COMPLETION_PCT": "float64", "JUN_COMPLETION_ABS": "float64", "JUN_COMPLETION_PCT": "float64", "JUL_COMPLETION_ABS": "float64", "JUL_COMPLETION_PCT": "float64", "AUG_COMPLETION_ABS": "float64", "AUG_COMPLETION_PCT": "float64", "SEP_COMPLETION_ABS": "float64", "SEP_COMPLETION_PCT": "float64", "OCT_COMPLETION_ABS": "float64", "OCT_COMPLETION_PCT": "float64", "NOV_COMPLETION_ABS": "float64", "NOV_COMPLETION_PCT": "float64", "DEC_COMPLETION_ABS": "float64", "DEC_COMPLETION_PCT": "float64", "JAN_COMPLETION_ABS": "int64", "JAN_COMPLETION_PCT": "int64", "FEB_COMPLETION_ABS": "int64", "FEB_COMPLETION_PCT": "int64", "MAR_COMPLETION_ABS": "int64", "MAR_COMPLETION_PCT": "int64"}}"""
        
        template = """You are a business intelligence expert, working for a bank. 
        You are provided with the schema of the SQL Database in <SCHEMA>.
        
        Here is some information about the tabels:
        The Targets have the KRAs along with units in Unit column.
        The Employees have Employee ID or RM for the Customer_Employees table
        The Branches have SOL_ID
        The Clusters have Cluster_ID
        The Circle have Circle_ID.


        You are given the task to make a comprehensive report for your Manager, the details are in the <MANAGER DETAILS> on the basis of <QUERY> provided. 
        For that you first need to make a list of SQL Queries that needs to be answered while making a comprehensive report. Make a maximum of 5 queries
        The query should have elobrated and exhaustive details about the database.
        << SCHEMA >>
        {schema}

        << FORMATTING >>
        Return a python list with the name of the prompt to look like:
        ```
        ["Question 1","Question 2"]
        ```

        << MANAGER DETAILS >>
        Role : {role}
        Branch(SOL_ID): {role_id}

        << QUERY >>
        Query:
        {query}

        << OUTPUT >>"""
        return template.format(schema=self.schema, role=self.role, role_id=self.role_id,query=query)

    def generate_sql_queries(self, query):
        route_prompt = self.create_query_template(query)
        output = self.generate_completion(query=route_prompt)
        return convert_str_to_list(output['content'])

    def generate_report(self, query, detail):
        res = {}
        verbose = {}
        queries = self.generate_sql_queries(query)
        for item in queries:
            try:
                output = db_chain(item)
                verbose[item] = output['intermediate_steps']
                output = output["result"]
                res[item] = output
            except:
                res[item] = "Could not fetch data"
        
        self.res = res
        if detail==1:
            self.detailed = "Your report should include: Objective, Data, Reasoning and Inference."
        if detail==2:
            self.detailed = "Your report should include: Data, Reasoning and Recommendations to improve on KRAs"
        prompt = f"""You are a business intelligence manager, working for a bank. 
        
        You are given the task to make a comprehensive report for your manager, details of your manager are in the <MANAGER DETAILS> on the basis of <QUERY> provided. 
        You are provided with the Data that you need to use in the <DATA> section for making the report. 
        {self.detailed}
        <<DATA>>
        {self.res}
        <<MANAGER DETAILS>>
        Location : {self.role_id}
        Role : {self.role}
        <<QUERY>>
        {query}
        <<OUTPUT>>
        You:"""
        self.detailed = ""
        return {"completion": self.generate_completion(query=prompt), "verbose": verbose}


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

generator = {}


class CompletionRequest(BaseModel):
    userId: str
    roleID: str
    role: str
    query: str
    details: int


@app.post("/finale")
def create_report_endpoint(request: CompletionRequest):
    if request.userId not in generator:
        generator[request.userId] = KRA(request.userId, request.role, request.roleID)

    report = generator[request.userId].generate_report(request.query, request.details)
    output = report["completion"]['content']
    verbose = report["verbose"]
    data,cols = get_cols(verbose)
    print(output)
    return JSONResponse({"data": {"output": output, "data": data,"cols":cols}, "status": 200, "message": "Response successful"})


openai.api_key = "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"
db = SQLDatabase.from_uri("sqlite:///data_KRA.sqlite")
llm = OpenAI(openai_api_key="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", temperature=0.2)
db_chain = SQLDatabaseChain.from_llm(llm, db, return_intermediate_steps=True, use_query_checker=True)