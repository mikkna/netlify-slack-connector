import { Handler, HandlerEvent } from "@netlify/functions";
import fetch from 'node-fetch';

const webhookURL = process.env.SLACK_URL as string;

const handler: Handler = async (event: HandlerEvent) => {
  let text: string;
  try {
    const body = JSON.parse(event.body as string);
    text = `${body.url} is ${body.state}.`;
    if (body.manual_deploy) {
      text += '\nManual deploy.'
    } else {
      if (body.commit_url && body.title) {
        text += `\nCommit: <${body.commit_url}|${body.title}>.`
      }
    }
    if (body.error_message) {
      text += `\n${body.error_message}`
    }
  } catch(e) {
    text = '❌ Unknown event.';
  }
  
  try {
    await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({text}),
    })
  
    return {
      statusCode: 200,
    };
  } catch (e) {
    console.log(e);
    return {
      statusCode: 500,
    };
  }
};

export { handler };