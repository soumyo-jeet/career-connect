import { GoogleGenAI } from '@google/genai';
import { toast } from 'sonner';

export const verifyJob = async (dtls) => {
  const genai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
  console.log(dtls)
  const {
    title,
    profile,
    skillRequirements,
  } = dtls

  const prompt = `
    **Job Details**
    title = ${title},
    profile = ${profile},
    skillRequirements = ${skillRequirements},
    
    CHECK THE JOB PROFILE, TITLE AND SKILL REQUIREMENTS. IF ANYTHING MISMATCHES GIVE YOUR ANSWER ACCORDINGLY
    {
      ans: YES / NO (YES IF IT'S OKAY, NO MISMATCHES ARE THERE. NO IF THERE'RE MISMATCHES),
      rsn: SHORT_ONE_LINER_REASON
    } 

    **Instructions**
    1. Your response should be in this json format. 
    2. No further explanation should be there.
    `

  const response = await genai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt
  })
  const responseText = response.text

  const jsonStart = responseText.indexOf('{')
  const jsonEnd = responseText.lastIndexOf('}') + 1
  const jsonString = responseText.slice(jsonStart, jsonEnd)
  // Parse the JSON
  const data = JSON.parse(jsonString)
  console.log(data)
  if(data.ans.toLowerCase() === "no") {
    toast.error(data.rsn)
    return null
  }
  return data
}

export const improveJobDesc = async (dtls) => {
  const genai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
  console.log(dtls)
  const {
    title,
    profile,
    salary,
    compName,
    compAdd,
    jobDtls,
    mode,
    skillRequirements,
    applyStarts,
    applyEnds,
    ph,
    email,
    complogo,
    requireApplicant,
    tag
  } = dtls

  const prompt = `
    **Job Details**
    title = ${title},
    profile = ${profile},
    salary = ${salary},
    compName = ${compName},
    compAdd = ${compAdd},
    mode = ${mode},
    skillRequirements = ${skillRequirements},
    applyStarts = ${applyStarts},
    applyEnds = ${applyEnds},
    ph = ${ph},
    email = ${email},
    jobDtls = ${jobDtls}
    
    
    IMPROVE THE jobDtls AND REWRITE IT IN 3 TO 4 LINES BASED ON THE GIVEN DETAILS. IT SHOULD BE MORE PROFESSIONAL AND TRUSTFULL.

    **Instructions**
    1. Your response will only contain the part can be shown in jobDtls feild. 
    2. No further explanation should be there.
    `

  const response = await genai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt
  })

  return response.text

}

export const getResumeInsights = async (jobDtls, content) => {
  const { title, profile, mode, skillRequirements } = jobDtls
  const resume = content.resume

  try {
    const prompt = `
    **Job Details**
    title = ${title},
    profile = ${profile},
    mode = ${mode},
    skillRequirements = ${skillRequirements},

    Analyze this resume and return ONLY a JSON object with:
    {
      match: "Percentage_match_with_job_requirements",
      weaknesses: [ "weakness1", "weakness2", "weakness3" ],
      strengths: [ "strength1", "strength2", "strength3" ],
      tips: "Should_the_applicant_be_selected_or_rejected?"
    }
    If this is not a resume, return { "error": "Invalid resume" }.
    `;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GORQ_API}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "system",
              content: "You are a resume analyst. Respond ONLY with valid JSON.",
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: { url: resume }
                }
              ]

            }
          ],
          temperature: 0.5,
          max_tokens: 1024,
          response_format: { type: "json_object" },
        }),
      }
    )

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content;
    console.log(JSON.parse(result))
    const json = JSON.parse(result);
    if (json.error) {
      toast.warning("Applicant has not uploaded any resume jpg / jpeg.")
      return null
    }

    else return json
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

export const aiAnalysis = async (jobsCreated,jobsApplied,jobsSelected,jobsRejected) => {
  const genai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
  
  const prompt = `
    **Profile Details**
    jobsCreated = ${jobsCreated},
    jobsApplied = ${jobsApplied},
    jobsSelected = ${jobsSelected},
    jobsRejected = ${jobsSelected}

    GIVE AN ONE LINE ANALYTICAL RECOMENDATION BASED ON THE PROFILE DETAILS.

    **Instructions**
    1. Only the recomendation quote should be there. No further explanation should be there.
    `

  const response = await genai.models.generateContent({
    model: 'gemini-1.5-flash',
    contents: prompt
  })
  const responseText = response.text
  console.log(responseText)
  return responseText
}