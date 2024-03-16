import { all, fork } from "redux-saga/effects";
//layout
import LayoutSaga from "./layouts/saga";
//Auth
import AccountSaga from "./auth/register/saga";
import AuthSaga from "./auth/login/saga";
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";

//calendar
import calendarSaga from "./calendar/saga";
//chat
import chatSaga from "./chat/saga";
//ecommerce
import ecommerceSaga from "./ecommerce/saga";

import labSaga from "./lab/saga";

import toolSaga from "./tools/saga";

import academySaga from "./academy/saga";

//establishments
import establishmentsSaga from "./establishments/saga";

//settings
import settingSaga from "./settings/saga";

//Project
import projectSaga from "./projects/saga";
// Task
import taskSaga from "./tasks/saga";
// Crypto
import cryptoSaga from "./crypto/saga";
//TicketsList
import ticketsSaga from "./tickets/saga";

//crm
import crmSaga from "./crm/saga";
//invoice
import invoiceSaga from "./invoice/saga";
//mailbox
import mailboxSaga from "./mailbox/saga";

// Dashboard Analytics
import dashboardAnalyticsSaga from "./dashboardAnalytics/saga";

// Dashboard CRM
import dashboardCrmSaga from "./dashboardCRM/saga";

// Dashboard Ecommerce
import dashboardEcommerceSaga from "./dashboardEcommerce/saga";

// Dashboard Crypto
import dashboardCryptoSaga from "./dashboardCrypto/saga";

// Dashboard Project
import dashboardProjectSaga from "./dashboardProject/saga";

// Dashboard NFT
import dashboardNFTSaga from "./dashboardNFT/saga";

// Pages > Team
import teamSaga from "./team/saga";

// File Manager
import fileManager from "./fileManager/saga";

// To do
import todos from "./todos/saga";

//Job
import jobSaga from "./job/saga";

//API Key
import APIKeysaga from "./apikey/saga";
import userSaga from "./users/saga";
import prescriptionSaga from "./prescription/saga";
import adminSaga from "./admin/saga";

export default function* rootSaga() {
  yield all([
    //public
    fork(LayoutSaga),
    fork(AccountSaga),
    fork(AuthSaga),
    fork(ForgetSaga),
    fork(ProfileSaga),
    fork(chatSaga),
    fork(projectSaga),
    fork(taskSaga),
    fork(cryptoSaga),
    fork(ticketsSaga),
    fork(calendarSaga),
    fork(ecommerceSaga),
    fork(labSaga),
    fork(academySaga),
    fork(establishmentsSaga),
    fork(settingSaga),
    fork(userSaga),
    fork(crmSaga),
    fork(invoiceSaga),
    fork(prescriptionSaga),
    fork(mailboxSaga),
    fork(dashboardAnalyticsSaga),
    fork(dashboardCrmSaga),
    fork(dashboardEcommerceSaga),
    fork(dashboardCryptoSaga),
    fork(dashboardProjectSaga),
    fork(dashboardNFTSaga),
    fork(teamSaga),
    fork(fileManager),
    fork(todos),
    fork(jobSaga),
    fork(APIKeysaga),
    fork(toolSaga),
    fork(adminSaga),
  ]);
}
