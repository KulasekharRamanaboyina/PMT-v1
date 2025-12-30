import { GoogleGenAI } from "@google/genai";
import { Task, User, ActivityLog } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectSummary = async (tasks: Task[], users: User[], recentActivity: ActivityLog[]) => {
  if (!process.env.API_KEY) {
    return "⚠️ API Key is missing. Please configure your API_KEY to unlock AI insights.";
  }

  const now = new Date();
  
  // Enrich task data with calculated fields for the AI
  const tasksData = tasks.map(t => ({
    title: t.title,
    status: t.status,
    priority: t.priority,
    dueDate: t.dueDate,
    daysUntilDue: Math.ceil((new Date(t.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    assignee: users.find(u => u.id === t.assigneeId)?.name || 'Unassigned'
  }));

  // Format activity log for context
  const activityData = recentActivity.slice(0, 10).map(a => 
    `${new Date(a.timestamp).toLocaleDateString()}: ${a.details}`
  );

  const prompt = `
    You are an expert Project Manager AI (Nexus AI). Analyze the current project state based on the following data:

    Current Date: ${now.toLocaleDateString()}
    
    Task List:
    ${JSON.stringify(tasksData, null, 2)}

    Recent Activity Log:
    ${JSON.stringify(activityData, null, 2)}

    Please provide a concise Executive Summary with the following sections. 
    IMPORTANT: Use single asterisks (*) around section names for a clean italicized look.
    
    1. 📊 *Status Overview*: A brief assessment of overall project health.
    2. 🚨 *Critical Risks*: Identify overdue tasks, potential bottlenecks, or high-priority items lagging behind.
    3. 💡 *Smart Recommendations*: 2-3 actionable pieces of advice to improve velocity or team coordination.

    Keep the tone professional yet encouraging. Use emojis to highlight key points.
    Format as plain text with clear spacing between sections.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No insights generated.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "❌ AI Analysis Service Unavailable. Please check your connection or API quota.";
  }
};

export const suggestTaskPriority = async (taskDescription: string) => {
    if (!process.env.API_KEY) return "MEDIUM";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze this task description and assign a single priority level (LOW, MEDIUM, HIGH, CRITICAL). 
            
            Task: "${taskDescription}"
            
            Return ONLY the priority word.`,
        });
        const text = response.text?.trim().toUpperCase();
        if (['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(text || '')) {
            return text;
        }
        return "MEDIUM";
    } catch (e) {
        return "MEDIUM";
    }
}