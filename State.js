//Place Holders
var users = [];
var mainTaskObject = {};
var listOfSubtaskID = [];

//Google
const SPREADSHEETID = "";
var SS;
var REGISTER_SHEET_NAME = "";

//Other
const EMAILS = {
  Manager: "email goes here",
  name1: "email goes here",
  name2: "email goes here",
};

//Wrike
const WRIKE_TOKEN = "TOKEN GOES HERE";

const WRIKE_FOLDER_ID = "";

const statusToID = {
  Status: "ID",
  Status2: "ID",
};
var idToStatus = {};
const fieldsMap = {};

const wrikeWorkflow = {
  "Generate ORR": {
    next: "Submit ORR HW",
    prev: "Generate ORR",
    Approver: "Engineer",
    main: null,
  },
  "Submit ORR HW": {
    next: "Type ORR",
    prev: "Generate ORR",
    Approver: "Assembly",
    main: null,
  },
  "Type ORR": {
    next: "ORR Review",
    prev: "Submit ORR HW",
    Approver: "Engineer",
    main: null,
  },
  "ORR Review": {
    next: "Gen Insp Plan",
    prev: "Type ORR",
    Approver: "Manager",
    main: null,
  },
  "Ammend ORR": {
    next: "ORR Review",
    prev: "",
    Approver: "Engineer",
    main: "ORR",
  },
  "Gen Insp Plan": {
    next: "Issue ORR",
    prev: "Gen Insp Plan",
    Approver: "Engineer",
    main: "ORR Customer Review",
  },
  "Issue ORR": {
    next: "Generate ASR",
    prev: "Gen Insp Plan",
    Approver: "JobOwner",
    main: null,
  },
  "Generate ASR": {
    next: "Submit ASR HW",
    prev: "Generate ASR",
    Approver: "Engineer",
    main: "ASR",
  },
  "Submit ASR HW": {
    next: "Type ASR",
    prev: "Generate ASR",
    Approver: "Assembly",
    main: null,
  },
  "Type ASR": {
    next: "ASR Review",
    prev: "Submit ASR HW",
    Approver: "Engineer",
    main: null,
  },
  "ASR Review": {
    next: "Gen/Copy Inspection Plan",
    prev: "Ammend ASR",
    Approver: "Manager",
    main: null,
  },
  "Ammend ASR": {
    next: "ASR Review",
    prev: "Type ASR",
    Approver: "Engineer",
    main: "ASR",
  },
  "Gen/Copy Inspection Plan": {
    next: "Issue ASR to Cus",
    prev: "Gen/Copy Inspection Plan",
    Approver: "Engineer",
    main: "ASR Customer Review",
  },
  "Issue ASR to Cus": {
    next: "Final Inspection",
    prev: "Gen/Copy Inspection Plan",
    Approver: "JobOwner",
    main: null,
  },
  "Final Inspection": {
    next: "Complete",
    prev: "Issue ASR to Cus",
    Approver: "Assembly",
    main: "Final Inspection",
  },
  Complete: {
    Approver: null,
    main: "Assembly Complete",
  },
};
