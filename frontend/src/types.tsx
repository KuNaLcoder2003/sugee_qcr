import React from "react";

export interface User {
  aadhar_no?: string;
  father_name?: string;
  pan_no?: string;
  address?: string;
  name?: string;
  dob?: string;
  gender?: string;
  account_number?: string;
  cif_number?: string;
}
export interface USER_AADHAAR_PAN {
  user_json : User,
  aadhar_json : Aadhaar,
  pan_josn : Pan
}

export interface Customer {
  gid: string,
  bank_code: string,
  branch_code: string,
  account_number: string,
  cif_number: string,
  id_number: string,
  name: string
}

export interface KYCEntries {
  gid: string;
  pan_page1_url: string;
  bank_code: string;
  aadhar_page1_url: string;
  aadhar_page2_url: string;
  selie_url: string;
  customer_guid: string;
  account_number: string;
  branch_code: string;
  cif_number: string;
  sign_url: string;
  aadhar_page1_path: string;
  aadhar_page2_path: string;
  aadhar_json: Aadhaar;
  created_on: string;
  pan_page1_path: string;
  selfie_path: string;
  sign_path: string;
  status: string;
  user_json: User,
  pan_json : Pan,
}
export interface Aadhaar {
  aadhar_number: string,
  dob : string,
  name: string,
  address : string,
  person_name? : string,
  relation? : string,
  relation_name? : string,
  gender : string

}
export interface Edit {
  gid: string,
  pan_page1_url: string,
  bank_code: string,
  aadhar_page1_url: string,
  aadhar_page2_url: string,
  selie_url: string,
  customer_guid: string,
  account_number: string,
  branch_code?: string,
  cif_number: string,
  sign_url: string,
  aadhar_json : Aadhaar,
  pan_josn : Pan
  created_on: string,
  status: string,
  user_json: User
}
export interface Pan {
  pan_number : string,
  father_name : string,
  dob : string,
  name : string
}
export interface Branch {
  bank_code: string;
  bank_name: string;
  active: string;
}

export interface Entry {
  gid: string,
  pan_page1_url: string,
  bank_code: string,
  aadhar_page1_url: string,
  aadhar_page2_url: string,
  selie_url: string,
  customer_guid: string,
  account_number: string,
  branch_code: string,
  cif_number: string,
  sign_url: string,
  aadhar_json?: Aadhaar,
  created_on: string,
  user_json: User
  status: string,
  pan_json : Pan,
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setEntryToEdit: React.Dispatch<React.SetStateAction<EntryEdit |null>>
}

export interface EntryEdit {
  gid: string,
  pan_page1_url: string,
  bank_code: string,
  aadhar_page1_url: string,
  aadhar_page2_url: string,
  selie_url: string,
  customer_guid: string,
  account_number: string,
  branch_code?: string,
  cif_number: string,
  sign_url: string,
  aadhar_json?: Aadhaar,
  pan_json : Pan
  created_on: string,
  status: string,
  user_json: User
}

export interface Image {
  src: string,
  name: string
}

