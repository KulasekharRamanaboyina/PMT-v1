import Activity from "../models/Activity";

interface ActivityPayload {
  userId: string;
  workspaceId: string;
  taskId?: string;
  note: string;
}

/**
 * logActivity
 * ----------------
 * Internal helper to log user activities.
 * This is NOT an express middleware.
 * No req, res, next here.
 */
export const logActivity = async ({
  userId,
  workspaceId,
  taskId,
  note,
}: ActivityPayload) => {
  try {
    await Activity.create({
      userId,
      workspaceId,
      taskId,
      note,
    });
  } catch (error) {
    console.error("❌ Activity log failed:", error);
  }
};
