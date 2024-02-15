/**
 * Get Wrike Contact ID's via API Call and push them in to users const.
 */
function getContactIdV4InObj() {
  var url = "https://www.wrike.com/api/v4/contacts";

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  var options = {
    method: "get",
    headers: { Authorization: "Bearer " + WRIKE_TOKEN },
    muteHttpExceptions: true,
  };

  var response = UrlFetchApp.fetch(url, options);
  var json = response.getContentText();
  var data = JSON.parse(json);
  for (var d = 0; d < data.data.length; d++) {
    for (var t in data.data[d]["profiles"][0]) {
      if (t == "email") {
        var emailArrPos = data.data[d]["profiles"][0]["email"];
        users[emailArrPos] = {};
        users[emailArrPos]["id"] = data.data[d].id;
      }
    }
  }

  return;
}

//-----------------------------------------------------------------------------------------------------
/**
 * Get list of Wrike Tasks from Folder.
 * @param {string} WRIKE_FOLDER_ID Input the folderID.
 * @return Array of Objects with tasks from folder.
 */
function getWrikeTasks(WRIKE_FOLDER_ID) {
  const url =
    "https://www.wrike.com/api/v4/folders/" + WRIKE_FOLDER_ID + "/tasks";

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  const options = {
    method: "get",
    headers: { authorization: "bearer " + WRIKE_TOKEN },
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = response.getContentText();
  const data = JSON.parse(json);
  return data.data;
}

//-----------------------------------------------------------------------------------------------------
/**
 * Get Task details for 100 tasks.
 * @param {Array} listOfIDs list of task ID's.
 * @param {string} category Main task or ODD subtask
 */
function getTaskDetails(listOfIDs, category) {
  const url = "https://www.wrike.com/api/v4/tasks/" + listOfIDs;

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  const options = {
    method: "get",
    headers: { Authorization: "Bearer " + WRIKE_TOKEN },
    muteHttpExceptions: true,
  };
  const response = UrlFetchApp.fetch(url, options);
  const json = response.getContentText();
  const data = JSON.parse(json);

  for (let i = 0; i < data.data.length; i++) {
    let status = idToStatus[data.data[i].customStatusId];

    if (category === "Main") {
      switch (status) {
        case "Complete":
          break;
        case "Incoming Inspection":
          let approval = getApprovals(data.data[i].id);
          if (approval === "Approved") {
            const taskObj = flattenObject(data.data[i]);
            const subtaskID = createSubtask(
              taskObj.id,
              taskObj.jobNumber + " - ORR/ASR",
              EMAILS[taskObj.engineer],
              "Please Generate the ORR then follow the Approval Process",
            );
            moveTask("Generate ORR", taskObj.id, subtaskID);
          }
          break;
        default:
          mainTaskObject[data.data[i].id] = flattenObject(data.data[i]);
          listOfSubtaskID.push(mainTaskObject[data.data[i].id]["ORR Task ID"]);
          break;
      }
    } else if (category === "ORR") {
      mainTaskObject[data.data[i].superTaskIds[0]].orrTask = flattenObject(
        data.data[i],
      );
    }
  }

  return;
}

//-----------------------------------------------------------------------------------------------------
/**
 * Get Task Approvals.
 * @param {Array} taskID
 * @return JSON Object with Task Approvals.
 */
function getApprovals(taskID) {
  const url = "https://www.wrike.com/api/v4/tasks/" + taskID + "/approvals";

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  const options = {
    method: "get",
    headers: { Authorization: "Bearer " + WRIKE_TOKEN },
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const approvals = JSON.parse(response.getContentText());
  const latestApp = approvals.data[0];

  return latestApp.decisions[0].status;
}
