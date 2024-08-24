import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function humanReadableDate(isoString) {
  // const isoString = "2024-05-05T11:54:58.000000Z";
  const date = new Date(isoString);
  return date.toLocaleString();
}

export function stripProtocolAndWWW(domain) {
  if (domain) {
    if (domain.startsWith('https://')) {
      domain = domain.substring(8); // Remove 'https://'
    } else if (domain.startsWith('http://')) {
      domain = domain.substring(7); // Remove 'http://'
    } else if (domain.startsWith('www.')) {
      domain = domain.substring(4); // Remove 'www.'
    }
  
    if (domain.startsWith('www.')) {
      domain = domain.substring(4); // Remove 'www.'
    }
    // Remove trailing forward slash if it exists
    if (domain.endsWith('/')) {
      domain = domain.slice(0, -1);
    }
  
    return domain;
  }
}