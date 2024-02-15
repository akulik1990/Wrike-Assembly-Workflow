/**
 * Create subtask in specific task.
 * @param {string} id Task ID (where subtask will be added).
 * @param {string} title subtask Title.
 * @param {string} responsible Asignee Email.
 * @param {string} description task Description (if Applicable).
 * @return response JSON Object as Array.
 */
function createSubtask(id, title, responsible, description = "") {
  const url = "https://www.wrike.com/api/v4/tasks";

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  const options = {
    method: "post",
    headers: { Authorization: "Bearer " + WRIKE_TOKEN },
    payload: {
      title: title,
      description: description,
      responsibles: JSON.stringify([users[responsible].id]),
      status: "Active",
      superTasks: JSON.stringify([id]),
    },
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = response.getContentText();
  const data = JSON.parse(json);
  return data.data;
}

//-----------------------------------------------------------------------------------------------------
/**
 * Change Task Status.
 * @param {string} id Task ID.
 * @param {string} statusID Status ID.
 * @return response JSON Object as Array.
 */
function changeStatus(id, statusID) {
  let url = "https://www.wrike.com/api/v4/tasks/" + id;

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  const options = {
    method: "put",
    headers: { Authorization: "Bearer " + WRIKE_TOKEN },
    payload: {
      customStatus: statusID,
    },
    muteHttpExceptions: false,
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = response.getContentText();
  const data = JSON.parse(json);
  return data.data;
}

//-----------------------------------------------------------------------------------------------------
/**
 * Create Approval on task.
 * @param {string} id Task ID.
 * @param {string} responsible Approver Email.
 * @return response JSON Object as Array.
 */
function createApproval(id, responsible) {
  const url = `https://www.wrike.com/api/v4/tasks/${id}/approvals`;

  /** @type {GoogleAppsScript.URL_Fetch.URLFetchRequestOptions} */
  const options = {
    method: "post",
    headers: { Authorization: "Bearer " + WRIKE_TOKEN },
    payload: {
      approvers: JSON.stringify([users[responsible].id]),
    },
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = response.getContentText();
  const data = JSON.parse(json);
  return data.data;
}
