import { QuestionOptions } from './question';
import { countries } from '@constants/countries';

export const SECTOR_CHOICES: QuestionOptions[] = [
  { value: 'Aerospace', viewValue: 'Aerospace' },
  { value: 'Agriculture', viewValue: 'Agriculture' },
  { value: 'Automotive', viewValue: 'Automotive' },
  { value: 'B2B Software', viewValue: 'B2B Software' },
  { value: 'Blockchain', viewValue: 'Blockchain' },
  {
    value: 'Consumer goods and services',
    viewValue: 'Consumer goods and services',
  },
  {
    value: 'Deep Tech (i.e AI / IoT / ML / DL)',
    viewValue: 'Deep Tech (i.e AI / IoT / ML / DL)',
  },
  { value: 'Education', viewValue: 'Education' },
  { value: 'Energy and Environment', viewValue: 'Energy and Environment' },
  { value: 'Fintech', viewValue: 'Fintech' },
  { value: 'Government', viewValue: 'Government' },
  { value: 'Healthcare', viewValue: 'Healthcare' },
  { value: 'HR Tech', viewValue: 'HR Tech' },
  { value: 'Marketplace', viewValue: 'Marketplace' },
  { value: 'Industrial', viewValue: 'Industrial' },
  { value: 'Media/Media Tech', viewValue: 'Media/Media Tech' },
  {
    value: 'Real Estate and Construction',
    viewValue: 'Real Estate and Construction',
  },
  { value: 'Web3', viewValue: 'Web3' },
  { value: 'Other', viewValue: 'Other' },
];

export const STAGE_CHOICES: QuestionOptions[] = [
  { value: 'Ideation/Early Stage', viewValue: 'Ideation/Early Stage' },
  { value: 'Pre-Seed', viewValue: 'Pre-Seed' },
  { value: 'Seed', viewValue: 'Seed' },
  { value: 'Series A', viewValue: 'Series A' },
  { value: 'Series B', viewValue: 'Series B' },
  { value: 'Series C', viewValue: 'Series C' },
  { value: 'Series D', viewValue: 'Series D' },
];
export const YES_NO_CHOICES: QuestionOptions[] = [
  { value: 'yes', viewValue: 'Yes' },
  { value: 'no', viewValue: 'No' },
];
export const IJF_MODE: QuestionOptions[] = [
  { value: 'offline', viewValue: 'Offline at IIT Bombay' },
  { value: 'online', viewValue: 'Online' },
];
export const HIRING_PREF: QuestionOptions[] = [
  { value: 'job', viewValue: 'Job' },
  { value: 'intern', viewValue: 'Internship' },
  { value: 'both', viewValue: 'Both' },
];
export const COMPANY_TYPE_CHOICES: QuestionOptions[] = [
  { value: 'PvtLtd', viewValue: 'Private Limited Company' },
  { value: 'PubLtd', viewValue: 'Public Limited Company' },
  { value: 'Partnership', viewValue: 'Partnerships Company' },
  { value: 'LLP', viewValue: 'Limited Liability Partnership' },
  { value: 'OPC', viewValue: 'One Person Company' },
  { value: 'SoleProp', viewValue: 'Sole Proprietorship' },
  { value: 'Sec8', viewValue: 'Section 8 Company' },
];

export const STATE_CHOICES: QuestionOptions[] = [
  { value: 'Andhra Pradesh', viewValue: 'Andhra Pradesh' },
  { value: 'Arunachal Pradesh', viewValue: 'Arunachal Pradesh' },
  { value: 'Assam', viewValue: 'Assam' },
  { value: 'Bihar', viewValue: 'Bihar' },
  { value: 'Chhattisgarh', viewValue: 'Chhattisgarh' },
  { value: 'Dehli', viewValue: 'Dehli' },
  { value: 'Goa', viewValue: 'Goa' },
  { value: 'Gujarat', viewValue: 'Gujarat' },
  { value: 'Haryana', viewValue: 'Haryana' },
  { value: 'Himachal Pradesh', viewValue: 'Himachal Pradesh' },
  { value: 'Jammu and Kashmir', viewValue: 'Jammu and Kashmir' },
  { value: 'Jharkhand', viewValue: 'Jharkhand' },
  { value: 'Karnataka', viewValue: 'Karnataka' },
  { value: 'Kerala', viewValue: 'Kerala' },
  { value: 'Madhya Pradesh', viewValue: 'Madhya Pradesh' },
  { value: 'Maharashtra', viewValue: 'Maharashtra' },
  { value: 'Manipur', viewValue: 'Manipur' },
  { value: 'Meghalaya', viewValue: 'Meghalaya' },
  { value: 'Mizoram', viewValue: 'Mizoram' },
  { value: 'Nagaland', viewValue: 'Nagaland' },
  { value: 'Odisha', viewValue: 'Odisha' },
  { value: 'Punjab', viewValue: 'Punjab' },
  { value: 'Rajasthan', viewValue: 'Rajasthan' },
  { value: 'Sikkim', viewValue: 'Sikkim' },
  { value: 'Tamil Nadu', viewValue: 'Tamil Nadu' },
  { value: 'Telangana', viewValue: 'Telangana' },
  { value: 'Tripura', viewValue: 'Tripura' },
  { value: 'Uttarakhand', viewValue: 'Uttarakhand' },
  { value: 'Uttar Pradesh', viewValue: 'Uttar Pradesh' },
  { value: 'West Bengal', viewValue: 'West Bengal' },
];

export const GENDER_CHOICES: QuestionOptions[] = [
  { value: 'Male', viewValue: 'Male' },
  { value: 'Female', viewValue: 'Female' },
  { value: 'Other', viewValue: 'Other' },
];

export const COUNTRY_CHOICES: QuestionOptions[] = Object.keys(countries).map(
  (country) => {
    return { value: country, viewValue: country };
  }
);

export const COMPI_YEAR_CHOICES: QuestionOptions[] = [
  { value: '6th', viewValue: '6th' },
  { value: '7th', viewValue: '7th' },
  { value: '8th', viewValue: '8th' },
  { value: '9th', viewValue: '9th' },
  { value: '10th', viewValue: '10th' },
  { value: '11th', viewValue: '11th' },
  { value: '12th', viewValue: '12th' },
  { value: 'First Year', viewValue: 'First Year' },
  { value: 'Second Year', viewValue: 'Second Year' },
  { value: 'Third Year', viewValue: 'Third Year' },
  { value: 'Fourth Year', viewValue: 'Fourth Year' },
  { value: 'Fifth Year', viewValue: 'Fifth Year' },
];

export const COMPI_NAME: QuestionOptions[] = [
  { value: 'ipl_auction', viewValue: 'IPL Auction' },
  { value: 'corporate_duel', viewValue: 'Corporate Duel' },
  { value: 'bid_and_build', viewValue: 'Bid and Build' },
  { value: 'ace_the_case', viewValue: 'Ace the Case' },
  { value: 'fish_tank', viewValue: 'Fish Tank' },
  { value: 'capital_quest', viewValue: 'Capital Quest' },
  { value: 'dtl', viewValue: 'DTL' },
];

export const IHACK_REG_TRACKS: QuestionOptions[] = [
  // {
  //   value: 'gitlab_codeforge',
  //   viewValue: 'GitLab’s CodeForge Track',
  // },
  {
    value: 'google_admob',
    viewValue: 'Google AdMob App Development Challenge Track',
  },
  // {
  //   value: 'cipla_datapulse',
  //   viewValue: 'Cipla Datapulse Track',
  // },
    {
    value: 'krafton_india_game_dev',
    viewValue: 'KRAFTON India Game Development Challenge',
  },
];

export const IHACK_SUB_TRACKS: QuestionOptions[] = [
  {
    value: 'gitlab_codeforge',
    viewValue: 'GitLab’s CodeForge Track',
  },
  {
    value: 'google_admob',
    viewValue: 'Google AdMob App Development Challenge Track',
  },
  {
    value: 'cipla_datapulse_1',
    viewValue: 'Cipla Datapulse Track 1',
  },
  {
    value: 'cipla_datapulse_2',
    viewValue: 'Cipla Datapulse Track 2',
  },
    {
    value: 'krafton_india_game_dev',
    viewValue: 'KRAFTON India Game Development Challenge',
  },
];

export const COMPANY_SIZE_CHOICES: QuestionOptions[] = [
  { value: '1-10', viewValue: '1–10' },
  { value: '11-50', viewValue: '11–50' },
  { value: '51-200', viewValue: '51–200' },
  { value: '201-500', viewValue: '201–500' },
  { value: '500+', viewValue: '500+' },
];

export const COMMUNICATION_MODE_CHOICES: QuestionOptions[] = [
  { value: 'email', viewValue: 'Email' },
  { value: 'call', viewValue: 'Call' },
  { value: 'whatsapp', viewValue: 'WhatsApp' },
  { value: 'other', viewValue: 'Other' },
];

export const JOINING_TIMELINE_CHOICES: QuestionOptions[] = [
  { value: 'immediate', viewValue: 'Immediate' },
  { value: '1_month', viewValue: 'Within 1 month' },
  { value: '3_months', viewValue: 'Within 3 months' },
  { value: 'flexible', viewValue: 'Flexible' },
];

export const WORK_LOCATION_CHOICES: QuestionOptions[] = [
  { value: 'onsite', viewValue: 'On-site' },
  { value: 'remote', viewValue: 'Remote' },
  { value: 'hybrid', viewValue: 'Hybrid' },
];

export const INTERNSHIP_DURATION_CHOICES: QuestionOptions[] = [
  { value: '3_months', viewValue: '3 months' },
  { value: '6_months', viewValue: '6 months' },
  { value: '1_year', viewValue: '1 year' },
  { value: 'flexible', viewValue: 'Flexible' },
  { value: 'other', viewValue: 'Other' },
];

export const COMPENSATION_TYPE_CHOICES: QuestionOptions[] = [
  { value: 'paid', viewValue: 'Paid' },
  { value: 'unpaid', viewValue: 'Unpaid' },
];

export const LOCATION_COUNTRY_CHOICES: QuestionOptions[] = [
  { value: 'India', viewValue: 'India' },
  { value: 'Other', viewValue: 'Other' },
];
