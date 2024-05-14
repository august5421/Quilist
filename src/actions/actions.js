export const setScreenState = (state) => ({
  type: "SET_SCREEN_STATE",
  payload: state,
});
export const setActiveUser = (state) => ({
  type: "SET_ACTIVE_USER",
  payload: state,
});
export const setUserCookie = (state) => ({
  type: "SET_USER_COOKIE",
  payload: state,
});
export const setSettingsExpanded = (state) => ({
  type: "SET_SETTINGS_EXPANDED",
  payload: state,
});
export const setChangePassword = (fieldName, value) => ({
  type: "CHANGE_PASSWORD",
  payload: { fieldName, value },
});
export const setDarkMode = (value) => ({
  type: "SET_DARK_MODE",
  payload: value,
});
export const setTheme = (value) => ({
  type: "SET_THEME",
  payload: value,
});
export const setSelectedTab = (value) => ({
  type: "SET_SELECTED_TAB",
  payload: value,
});
export const setSearchResults = (value) => ({
  type: "SET_SEARCH_RESULTS",
  payload: value,
});
export const setUserFriends = (value) => ({
  type: "SET_USER_FRIENDS",
  payload: value,
});
export const setShowAvatarEditor = (value) => ({
  type: "SET_SHOW_AVATAR_EDITOR",
  payload: value,
});
export const setInitAvatarCustomizer = (value) => ({
  type: "SET_INIT_AVATAR_CUSTOMIZER",
  payload: value,
});
export const setActiveListTab = (value) => ({
  type: "SET_ACTIVE_LIST_TAB",
  payload: value,
});
export const setInitListInfo = (index, key, value) => ({
  type: "SET_INIT_LIST_INFO",
  payload: { index, key, value },
});
export const setInitListNumber = (listItems) => ({
  type: "SET_LIST_NUMBER",
  payload: listItems,
});
export const setInitListTopInfo = (name, values) => ({
  type: "SET_INIT_LIST_TOP_INFO",
  payload: { name, values },
});
export const setSucceffListSave = (value) => ({
  type: "SET_SUCCEFF_LIST_SAVE",
  payload: value,
});
export const setUserLists = (value) => ({
  type: "USER_LISTS",
  payload: value,
});
export const setRelativeListRole = (value) => ({
  type: "SET_RELATIVE_LIST_ROLE",
  payload: value,
});
export const resetListInfo = () => ({
  type: "RESET_LIST_INFO",
});
export const setListInforFromJSON = (value) => ({
  type: "SET_LIST_INFO_FROM_JSON",
  payload: value,
});
export const setEditingListId = (value) => ({
  type: "EDITING_LIST_ID",
  payload: value,
});
export const setToastette = (value) => ({
  type: "SET_TOASTETTE",
  payload: value,
});
export const setListSaveError = (value) => ({
  type: "SET_LIST_SAVE_ERROR",
  payload: value,
});
export const setDatePickerDate = (index, key, value) => ({
  type: "SET_DATE_PICKER_DATE",
  payload: { index, key, value },
});
