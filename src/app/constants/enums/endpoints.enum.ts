export enum Endpoint {
  // Authentication
  LOGIN = 'login/',
  LOGIN_GOOGLE = 'login/google/',
  LOGOUT = 'logout/',
  FIND_USER = 'user/find/',
  SEND_OTP = 'otp/',
  VERIFY_OTP = 'user/verify/',
  REGISTER = 'user/register/',
  RESET_PASSWORD = 'resetpassword/',

  USER_INFO = 'user/info/',
  PROFILE = 'profile/',

  //
  GET_NOTIFIED = 'get_notified/',

  // Data endpoints
  EVENTS_LIST = 'events/',
  PAST_SPEAKERS_LIST = 'speakers/',
  CURRENT_SPEAKERS_LIST = 'current_speakers/',
  INVESTORS_LIST = 'investors/',
  SPONSORS_LIST = 'sponsors/',
  AGENDA = 'agenda/',

  // Event registration
  I_SUMMIT = 'event_reg/isummit/',
  TTMM = 'event_reg/ttmm/',
  NA = 'event_reg/na-startup/',
  NA_VERIFY_COFOUNDER = 'event_reg/na/verify-cofounder/',
  EXPO = 'event_reg/expo/',
  SEEDSTARS = 'event_reg/seedstars/',
  WORKSHOP = 'event_reg/workshops/',
  IJF_STUD = 'event_reg/ijf/studreg/',
  IJF_COMP = 'event_reg/ijf/compreg/',
  INFLUENCER = 'event_reg/influencer/',
  MUN = 'event_reg/mun/',
  MUN_BLOCKED_PREFERENCES = 'mun/blocked-preferences/',
  VSM = 'event_reg/vsm/',
  GEC = 'event_reg/gec/',

  // New Workshop API endpoints
  WORKSHOPS_LIST = 'api/workshops/',
  WORKSHOP_REGISTRATION = 'api/workshop-registration/',
  VERIFY_PAYMENT = 'api/verify-payment/',

  EVENT_RSVP = 'event_reg/rsvp/',

  // i-hack
  IHACK = 'event_reg/ihack/',
  IHACK_SUB = 'ihack/sub/',

  // Compi
  COMPI = 'event_reg/compi/',

  // Payments
  SUCCESS_PAYMENT = 'payments/redirect/success/',
  FAILED_PAYMENT = 'payments/failed/',

  // Acco
  ACCO = 'event_reg/acco/reg/',
  ACCO_INFO = 'acco/info/',
  ACCO_CREATE_PAYMENT = 'payments/acco/create/',
  ACCO_VERIFY_PAYMENT = 'payments/acco/verify/',
  ACCO_KONFHUB_URL = 'payments/acco/konfhub-url/',

  ACCO_DASH = 'dash/acco/',
  COMPI_DASH = 'dash/compi/',

  // Pass purchase
  PASS_GET = 'pass/get/',
  PASS_AMOUNT = 'payments/pass/info/',
  CREATE_PASS_PAYMENT = 'payments/pass/create/',
  VERIFY_PASS_PAYMENT = 'payments/pass/verify/',
  CHECK_PASS_PAYMENTS = 'payments/pass/check/',
  VERIFY_WORKSHOP_PAYMENT = 'payments/workshop/verify/',
  WORKSHOP_PAYMENT_VERIFY = 'api/verify-payment/',
  VERIFY_MUN_PAYMENT = 'payments/mun/verify/',
  VERIFY_MUN_GROUP_PAYMENT = 'payments/mun/group/verify/',
  CREATE_INF_SUMMIT_PAYMENT = 'payments/influencer/create/',
  VERIFY_INF_SUMMIT_PAYMENT = 'payments/influencer/verify/',

  // Contingent Leader
  CONTINGENT = 'contingent/',
  CONTINGENT_INFO = 'contingent/info/',
  CL_MEMBERS = 'contingent/members/',
  CONTINGENT_PRICE_INFO = 'payments/contingent/info/',
  CREATE_CONTINGENT_PAYMENT = 'payments/contingent/create/',
  VERIFY_CONTINGENT_PAYMENT = 'payments/contingent/verify/',
}
