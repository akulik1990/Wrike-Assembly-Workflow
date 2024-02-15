/**
 * Starting Point. Pull tasks from Wrike Folder and Change their Statuses as required.
 */
function wrikePullout() {
  init();

  const mainTaskIDs = getWrikeTasks(WRIKE_FOLDER_ID).map((task) => task.id);

  chunkIDs(mainTaskIDs, "Main");

  chunkIDs(listOfSubtaskID, "ORR");

  for (let taskid in mainTaskObject) {
    let subtaskobject = mainTaskObject[taskid].orrtask;
    let subtaskid = subtaskobject.id;
    let status = idToStatus[subtaskobject.customstatusid];
    let approval = getApprovals(subtaskid);
    let oldstatus = wrikeWorkflow[status];
    switch (approval) {
      case "approved":
        moveTask(oldstatus.next, taskid, subtaskid);
        break;

      case "rejected":
        moveTask(oldstatus.prev, taskid, subtaskid);
        break;

      default:
        break;
    }
  }
}
