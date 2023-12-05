const express = require('express');
require("dotenv").config();
const app = express();
const port = 3000;
const { AzureKeyCredential, TextAnalysisClient } = require("@azure/ai-language-text");

app.use(express.json());

const endpoint = process.env.LANGUAGE_ENDPOINT;
const apiKey = process.env.LANGUAGE_KEY;

async function ExtractTextExample(text) {

    // This example requires environment variables named "LANGUAGE_KEY" and "LANGUAGE_ENDPOINT"
    debugger;
    // Load the .env file if it exists
    require("dotenv").config();
    const endpoint = process.env.LANGUAGE_ENDPOINT;
    const apiKey = process.env.LANGUAGE_KEY;

  console.log("== Extractive Summarization Sample ==");

  const client = new TextAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const actions = [
    {
      kind: "ExtractiveSummarization",
      maxSentenceCount: 2,
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

      return new Promise((resolve, reject) => resolve(result.sentences.map((sentence) => sentence.text).join("\n")));
    }
  }
}


app.post('/', async(req, res) => {
    var text = req.body.text;
    await ExtractTextExample([text])
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