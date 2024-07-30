export const BASE_URL = 'http://localhost:8000';

export const colors = {
    primary: "#12296C",
    secondary: "#000000",
  };


export interface Note {
_id: string;
title: string;
content: string;
createdOn: string;
tags: string[];
isPinned: boolean;
};


export interface UserInfo {
firstName?: string;
lastName?: string;
email?: string;
};