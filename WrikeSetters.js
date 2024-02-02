/**
 * Create subtask in specific task.
 * @param {string} Task ID (where subtask will be added).
 * @param {string} subtask Title.
 * @param {string} Asignee Email.
 * @param {string} task Description (if Applicable).
 * @return response JSON Object as Array.
 */
function createSubtask(id, title, responsible, description = "") {
  const url = "https://www.wrike.com/api/v4/tasks";
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
 * @param {string} Task ID.
 * @param {string} Status ID.
 * @return response JSON Object as Array.
 */
function changeStatus(id, statusID) {
  let url = "https://www.wrike.com/api/v4/tasks/" + id;
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
 * @param {string} Task ID.
 * @param {string} Approval Description (title).
 * @param {string} Approver Email.
 * @return response JSON Object as Array.
 */
function createApproval(id, description, responsible) {
  const url = `https://www.wrike.com/api/v4/tasks/${id}/approvals`;
  const options = {
    method: "post",
    headers: { Authorization: "Bearer " + WRIKE_TOKEN },
    payload: {
      description: description,
      approvers: JSON.stringify([users[responsible].id]),
      dueDate: dEnd,
    },
    muteHttpExceptions: true,
  };

  const response = UrlFetchApp.fetch(url, options);
  const json = response.getContentText();
  const data = JSON.parse(json);
  return data.data;
}
