#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch, { Headers, Request, Response } from 'node-fetch';


globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;


dotenv.config();
console.log("API Key from env:", process.env.GOOGLE_API_KEY);

const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
  console.error(chalk.red('❌ Error: GOOGLE_API_KEY not found in .env file.'));
  process.exit(1);
}

const program = new Command();

// Function to call Gemini API via fetch
async function callGemini(prompt) {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0) {
      console.log(chalk.green('\n🔍 Gemini Response:\n'));
      console.log(result.candidates[0].content.parts[0].text);
    } else {
      console.error(chalk.red('❌ No response from Gemini API.'));
      console.error(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error(chalk.red('❌ API call failed: '), error);
  }
}

// Command: explain <file>
program
  .command('explain <file>')
  .description('Explain code in a file using Gemini AI')
  .action(async (file) => {
    try {
      const code = fs.readFileSync(file, 'utf-8');
      await callGemini(`Explain the following code:\n\n${code}`);
    } catch (err) {
      console.error(chalk.red(`❌ Failed to read file: ${file}`));
    }
  });

// Command: ask <question>
program
  .command('ask <question>')
  .description('Ask Gemini AI a direct question')
  .action(async (question) => {
    await callGemini(question);
  });

// Command: summarize <file>
program
  .command('summarize <file>')
  .description('Summarize the content of a file using Gemini AI')
  .action(async (file) => {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      await callGemini(`Summarize the following text:\n\n${content}`);
    } catch (err) {
      console.error(chalk.red(`❌ Failed to read file: ${file}`));
    }
  });

// Command: suggest-code <instruction>
program
  .command('suggest-code <instruction>')
  .description('Generate code based on your instruction using Gemini AI')
  .action(async (instruction) => {
    await callGemini(`Generate a code snippet for the following instruction:\n${instruction}`);
  });

// 🆕 Command: review-code <file>
program
  .command('review-code <file>')
  .description('Review code in a file for improvements and issues using Gemini AI')
  .action(async (file) => {
    try {
      const code = fs.readFileSync(file, 'utf-8');
      await callGemini(
        `Please review the following code for bugs, performance improvements, security vulnerabilities, and code quality best practices. Provide a detailed review:\n\n${code}`
      );
    } catch (err) {
      console.error(chalk.red(`❌ Failed to read file: ${file}`));
    }
  });

program.parse(process.argv);
