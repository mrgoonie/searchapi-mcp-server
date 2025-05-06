//evals.ts

import { EvalConfig } from 'mcp-evals';
import { openai } from "@ai-sdk/openai";
import { grade, EvalFunction } from "mcp-evals";

const search_googleEval: EvalFunction = {
    name: 'search_google Tool Evaluation',
    description: 'Evaluates the functionality of the search_google tool',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Perform a Google search for 'SearchAPI.site' using the 'search_google' tool and provide the first few search results with their titles, snippets, and links.");
        return JSON.parse(result);
    }
};

const search_google_imagesEval: EvalFunction = {
    name: 'search_google_images Evaluation',
    description: 'Evaluates the google images search functionality',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please use search_google_images to find images of corgis wearing hats. Include titles, thumbnails, and source links in the response.");
        return JSON.parse(result);
    }
};

const search_youtubeEval: EvalFunction = {
    name: 'search_youtube Tool Evaluation',
    description: 'Evaluates the YouTube search tool functionality',
    run: async () => {
        const result = await grade(openai("gpt-4"), "Please search YouTube for the latest AI advancements and provide the video titles, thumbnails, descriptions, and links.");
        return JSON.parse(result);
    }
};

const config: EvalConfig = {
    model: openai("gpt-4"),
    evals: [search_googleEval, search_google_imagesEval, search_youtubeEval]
};
  
export default config;
  
export const evals = [search_googleEval, search_google_imagesEval, search_youtubeEval];