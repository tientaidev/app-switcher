export { };

import { sessionStorage } from "~sessionStorage";
import { localStorage } from "~localStorage";

// new tab is always created on the leftmost position
const TAB_DEFAULT_POSITION = 0;

// open options page when the extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.tabs.onCreated.addListener(async () => {
  const currentWindowTabs = await chrome.tabs.query({ currentWindow: true });
  await chrome.tabs.ungroup(currentWindowTabs.map(tab => tab.id));
  await groupTab();
});

const createNewTab = async (url: string, index: number) => {
  const tab = await chrome.tabs.create({ url: url, active: true, index: TAB_DEFAULT_POSITION });
  await sessionStorage.set(index.toString(), tab.id);

  return tab;
};

const findTab = async (index: number) => {
  const tabId = await sessionStorage.get(index.toString());

  if (!tabId) return null;

  try {
    return await chrome.tabs.get(parseInt(tabId));
  } catch (error) {
    return null;
  }
}

const groupTab = async () => {
  const currentWindowTabs = await chrome.tabs.query({ currentWindow: true });
  const userAppTabIds =
    await sessionStorage
      .getAll()
      .then(data => Object.values(data));
  const userAppTabIdsInCurrentWindowTabs =
    currentWindowTabs
      .filter(tab => userAppTabIds.includes(tab.id.toString()))
      .map(tab => tab.id);

  let groupId = null;
  try {
    groupId = await chrome.tabs.group({ tabIds: userAppTabIdsInCurrentWindowTabs });
  } catch (error) {
    groupId = null;
  }

  if (!groupId) return;

  await chrome.tabGroups.update(groupId, { collapsed: true });
}

chrome.commands.onCommand.addListener(async (command) => {
  const match = command.match(/^navigate_app_(\d)$/);
  if (!match) return;

  const index = match[1];
  const url = await localStorage.get(index);

  if (!url) return;
  const tab = await findTab(parseInt(index));

  if (tab) await chrome.tabs.update(tab.id, { active: true });
  else createNewTab(url, parseInt(index));

  await groupTab();
});
