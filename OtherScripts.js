/**
 * Get details of each task. Running chunks of 100 at a time due to API limitations.
 * @param {string} List of ID's to be pulled (limit 100).
 * @param {string} Type of pull (Main or ORR).
 */
function chunkIDs(IDs, type) {
  let listOfIDs = [];
  for (var i in IDs) {
    if (i % 100 == 0) {
      getTaskDetails(listOfIDs, type);
      listOfIDs = [IDs[i]];
    } else {
      listOfIDs.push(IDs[i]);
    }
  }
  if (listOfIDs.length > 0) {
    getTaskDetails(listOfIDs, type);
  }

  return;
}

//-------------------------------------------------------------------------
/**
 * Flattens a multinested JSON object in to single level.
 * @param {object} Input the object to flatten.
 * @return Single level object.
 */
function flattenObject(ob) {
  let result = {};
  for (const i in ob) {
    if (typeof ob[i] === "object") {
      if (Array.isArray(ob[i])) {
        if (typeof ob[i][0] === "object") {
          Object.keys(ob[i]).forEach(function (key) {
            result[filedsMap[ob[i][key].id]] = ob[i][key].value;
          });
        } else {
          result[i] = ob[i];
        }
      } else {
        const temp = flattenObject(ob[i], filedsMap);
        for (const j in temp) {
          result[j] = temp[j];
        }
      }
    } else {
      result[i] = ob[i];
    }
  }
  return result;
}

//-------------------------------------------------------------------------
/**
 * Swap Object Keys with Values.
 * @param {object} Input the object to swap.
 * @return Swapped object.
 */
function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}

//-------------------------------------------------------------------------
/**
 * Get Approver Email from task object and approver title.
 * @param {string} Input taskID.
 * @param {string} Input approver title.
 * @return email.
 */
function getEmailFromTitle(taskID, title) {
  let task = mainTaskObject[taskID];
  let approver = null;
  switch (title) {
    case "Engineer":
      approver = task.engineer;
      break;
    case "JobOwner":
      approver = task.jobOwner;
      break;
    case "Manager":
      approver = "Manager";
      break;

    default:
      break;
  }

  return EMAILS[approver];
}

//-------------------------------------------------------------------------
/**
 * Change task status and set approval if required. Change main task status if required.
 * @param {string} Input new status title.
 * @param {string} Input main task ID.
 * @param {string} Input subtask ID.
 */
function moveTask(newStatus, taskID, subtaskID) {
  changeStatus(subtaskID, statusToID[newStatus]);
  let statusObj = wrikeWorkflow[newStatus];
  if (statusObj.Approver) {
    createApproval(subtaskID, getEmailFromTitle(statusObj.Approver));
  }
  if (statusObj.main) {
    changeStatus(taskID, statusToID[statusObj.main]);
  }

  return;
}

//-------------------------------------------------------------------------
/**
 * Get google file ID from URL.
 * @param {string} Input the url to extract ID.
 * @return ID.
 */
function getIdFromUrl(url) {
  return url.match(/[-\w]{25,}/);
}
