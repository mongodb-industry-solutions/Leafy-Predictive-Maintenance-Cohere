import { NextApiRequest, NextApiResponse } from 'next';
const {Translate, TranslateConfig} = require('@google-cloud/translate').v2;


// Creates a client
//const translateConfig = new TranslateConfig(process.env.GCP_TRANSLATE_API_KEY);
const apiKey = process.env.GCP_TRANSLATE_API_KEY;
const projectId = process.env.GCP_PROJECT_ID;
const translate = new Translate({projectId, key: apiKey});

async function translateText(text,target) {
    // Translates the text into the target language. "text" can be a string for
    // translating a single piece of text, or an array of strings for translating
    // multiple texts.
    let [translations] = await translate.translate(text, target);
    translations = Array.isArray(translations) ? translations : [translations];
    console.log('Translations:');
    translations.forEach((translation, i) => {
      console.log(`${text[i]} => (${target}) ${translation}`);
    });
    return translations
  }

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;
  console.log(text);
  if (!text) {
    return res.status(400).json({ message: 'Text and target language are required' });
  }

  try {
    const result = await translateText(text, 'en');
    res.status(200).json({ translatedText: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error translating text', error: error.message });
  }
}


