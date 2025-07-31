import React from "react";

export interface User {
  aadhar_no: string,
  address: string,
  dob: string,
  father_name?: string,
  gender: string,
  name: string,
  pan_no: string
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
  aadhar_json: string;
  created_on: string;
  pan_page1_path: string;
  selfie_path: string;
  sign_path: string;
  status: string;
  user_json: User
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
  aadhar_json?: string,
  created_on: string,
  status: string,
  user_json: User
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
    aadhar_json?: string,
    created_on: string,
    user_json: User
    status: string,
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setEntryToEdit: React.Dispatch<React.SetStateAction<EntryEdit>>
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
    aadhar_json?: string,
    created_on: string,
    status: string,
    user_json: User
}

