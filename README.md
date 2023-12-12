# SummarizationAPI
We have Swagger Documentation on the below link
http://140.82.12.45:3000/docs/

## Instructions for sending a request to SummarizationAPI using Postman
1.	Download Postman. Go to https://www.postman.com/downloads/ and choose your desired platform among Mac, Windows, or Linux. #   by using the link https://www.postman.com/downloads/ <br />
  a.	Open the downloaded file and click on run, it will start the Installation on your system <br />
  b.	You can sign up or else it works without signing up. It is a free tool used for testing HTTP methods. <br />
  c.	Now you have successfully installed Postman. <br />
2.	Create a new request on Postman using the following steps <br />
	   a. Open Postman and create 'New Request' <br />
	   b. Select POST from the request dropdown. <br />
	     ![image](https://github.com/apadyal/SummarizationAPI/issues/1#issuecomment-1851245410)
	
	  	
	   c. Enter the API URL in the address box <br />
	      ![image](https://github.com/apadyal/SummarizationAPI/issues/1#issuecomment-1851243937)
	
	   d. For building the request body, click on 'raw' and select 'JSON' from the dropdown. <br />
	       ![image](https://github.com/apadyal/SummarizationAPI/issues/1#issuecomment-1851244271)
	
	   e. Enter the message into the request body. NOTE:  add newline character '\n' If your paragraph has newlines for JSON parsing to successfully parse your message body as per JSON convention. <br />
	      ![image](https://github.com/apadyal/SummarizationAPI/issues/1#issuecomment-1851244976)
	  	The request JSON format is as follows - <br />
	
	     { 
	        “text”: “< Your lengthy paragraph here >”, <br />
	        “sentenceCount”: 3 <Number of sentence in the summary> <br />
	     } 
    
API Operation Template to use- 
Sr. No.	HTTP Method	Uniform API	Description	Example Payload
1	POST	POST resource	POST method must be used to input the text to summarize it	POST:/api/summarize
{
“text”: “string”,
“sentenceCount”: “string”
}

## Introduction
Text summarization is a natural language processing task that aims to produce a concise and coherent summary of a given text document or conversation. Text summarization can be useful for various applications, such as meeting notes, news articles, customer feedback, etc. However, text summarization is also a challenging and complex problem that requires large and sophisticated language models to generate high-quality summaries.

## Abstract
The Azure Summarization service is a cloud-based solution that provides extractive and abstractive summarization of text documents or conversations using large language models from Hugging Face. However, the service requires users to create and manage Azure resources, such as Language and Function App, and to use the Azure SDKs to interact with the service. To simplify the usage of the service, we propose a wrapper API that can summarize any paragraph with a single HTTP request. The wrapper API is implemented as a serverless function that invokes the Azure Summarization service and returns the summary output in JSON format. To use this API, the user does not require any subscription it is a free service.

## Technology Stack
Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. APIs. Hence, we are using Node JS and Express as a Web framework to implement the project. 

## Implementation Flow
 
![image](https://github.com/apadyal/SummarizationAPI/issues/1#issuecomment-1851253951)

We are implementing the API by using the HTTP POST method to get the input from a testing tool POSTMAN and present the prepared requested payload in a summarized sentence to the user. We have followed the steps to implement the Summarization API- <br />
1.	The user will send a request using POSTMAN.<br />
2.	The user’s request will be sent to our API.<br />
3.	Our API will get the user’s request and send it to the Azure Summarization API, the Azure Summarization API will fulfill the request by generating the response as per the requested payload.<br />
4.	The generated response by Azure Summarization API will be sent to our API.<br />
5.	Our API will send the response payload as an output to the user's request.<br />

While implementing the above steps we have made sure that the user will need not to go and register or configure for the Azure Summarization API, the user can directly go and use/consume Our API to communicate with Azure Summarization.

