const express = require('express');
require("dotenv").config();
const app = express();
const port = 3000;
const { AzureKeyCredential, TextAnalysisClient } = require("@azure/ai-language-text");

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    swaggerDefinition: {
        info: {
            title: 'Summarization',
            version: '1.0.0',
            description: 'An API to summarize the text into given number of sentences. This is an API that utilizes Azure AI Language service._'
            
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./server.js'],
    explorer: true,
};


const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

/**
 * @swagger
 * tags:
 * name: Summary
 * description: The books managing API
 */

const endpoint = process.env.LANGUAGE_ENDPOINT;
const apiKey = process.env.LANGUAGE_KEY;

async function ExtractText(text, summarySentenceCount) {

    // Load the .env file if it exists
    require("dotenv").config();
    const endpoint = process.env.LANGUAGE_ENDPOINT;
    const apiKey = process.env.LANGUAGE_KEY;

  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const actions = [
    {
      kind: "ExtractiveSummarization",
      maxSentenceCount: summarySentenceCount,
    },
  ];
  const poller = await client.beginAnalyzeBatch(actions, text, "en");

  poller.onProgress(() => {
    console.log(
      `Last time the operation was updated was on: ${poller.getOperationState().modifiedOn}`
    );
  });
  console.log(`The operation was created on ${poller.getOperationState().createdOn}`);
  console.log(`The operation results will expire on ${poller.getOperationState().expiresOn}`);

  const results = await poller.pollUntilDone();

  for await (const actionResult of results) {
    if (actionResult.kind !== "ExtractiveSummarization") {
      throw new Error(`Expected extractive summarization results but got: ${actionResult.kind}`);
    }
    if (actionResult.error) {
      const { code, message } = actionResult.error;
      throw new Error(`Unexpected error (${code}): ${message}`);
    }
    
    for (const result of actionResult.results) {
      console.log(`- Document ${result.id}`);
      if (result.error) {
        const { code, message } = result.error;
        throw new Error(`Unexpected error (${code}): ${message}`);
      }

      return new Promise((resolve) => resolve(result.sentences.map((sentence) => sentence.text).join("\n")));
    }
  }
}

/**
  * @swagger
  * /summarize:
  *   post:
  *     tags:
  *       - Summary
  *     summary: Summarize the provided text snippet
  *     description: Summarize the provided text snippet
  *     requestBody:
  *       description: The text to summarize.
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/Book'
  *     responses:
  *       "200":
  *         description: Successful operation
  *         content:
  *           application/json:
  *             schema:
  *         status: string
  *         summary: string
 */
app.post('/summarize', async(req, res) => {
    var text = req.body.text;
    var sentenceCount = req.body.sentenceCount;
    await ExtractText([text], sentenceCount)
          .then(result => {
            res.status(200);
                    var result = {
                        "status": "success",
                        "summary": result,
                    }
                    res.json(result);
          }).catch((ex) => {

            res.status(200);
                    var result = {
                        "status": "error",
                        'errorCode':ex.code,
                        "errorMessage": ex.message,
                    }
                    res.json(result);
          });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});