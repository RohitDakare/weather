export function createPageUrl(pageName) {
  const baseUrl = "/";
  const pageMap = {
    "Home": "",
    "Profile": "profile",
    "Saved": "saved",
    "OutfitDetail": "outfit"
  };
  
  const path = pageMap[pageName] || pageName.toLowerCase();
  return path === "" ? baseUrl : `${baseUrl}${path}`;
}
