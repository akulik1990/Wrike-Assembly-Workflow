/**
 * Starting Point. Pull tasks from Wrike Folder and Change their Statuses as required.
 */
function wrikePullout() {
  init();

  const mainTaskIDs = getWrikeTasks(WRIKE_FOLDER_ID).map((task) => task.id);

  chunkIDs(mainTaskIDs, "Main");

  chunkIDs(listOfSubtaskID, "ORR");

  for (taskID in mainTaskObject) {
    let subtaskObject = mainTaskObject[taskID].orrTask;
    let subtaskID = subtaskObject.id;
    let status = idToStatus[subtaskObject.customStatusId];
    let approval = getApprovals(subtaskID);
    let oldStatus = wrikeWorkflow[status];
    switch (approval) {
      case "Approved":
        moveTask(oldStatus.next, taskID, subtaskID);
        break;

      case "Rejected":
        moveTask(oldStatus.prev, taskID, subtaskID);
        break;

      default:
        break;
    }
  }
}
